
/**
 * The Selection Model module
 *
 * The ngRepeat companion. This module exists to give developers a lightweight
 * option for easily managing selections in lists and tables. It also aims to
 * play nicely with native angular features so you can leverage existing tools
 * for filtering, sorting, animations, etc.
 *
 * @package selectionModel
 */

angular.module('selectionModel', []);


/**
 * Selection Model Ignore
 *
 * For clickable elements that don't directly interact with `selectionModel`.
 *
 * Useful for when you want to manually change the selection, or for things like
 * "delete" buttons that belong under `ngRepeat` but shouldn't select an item
 * when clicked.
 *
 * @package selectionModel
 * @copyright 2014 Justin Russell, released under the MIT license
 */

angular.module('selectionModel').directive('selectionModelIgnore', [
  function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var ignore = function(event) {
          event.selectionModelIgnore = true;

          /**
           * If jQuery is on the page `event` will actually be a jQuery Event
           * and other handlers will only get to see a subset of the event
           * properties that supported by all browsers. Our custom attribute
           * will be dropped. We need to instead decorate the original event
           * object.
           *
           * @see https://github.com/jtrussell/angular-selection-model/issues/27
           */
          if(event.originalEvent) {
            event.originalEvent.selectionModelIgnore = true;
          }
        };

        element.on('click', function(event) {
          if(!attrs.selectionModelIgnore || scope.$eval(attrs.selectionModelIgnore)) {
            ignore(event);
          }
        });
      }
    };
  }
]);


/**
 * Selection Model - a selection aware companion for ngRepeat
 *
 * @package selectionModel
 * @copyright 2014 Justin Russell, released under the MIT license
 */

angular.module('selectionModel').directive('selectionModel', [
  'selectionStack', 'uuidGen', 'selectionModelOptions', '$document',
  function(selectionStack, uuidGen, selectionModelOptions, $document) {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        /**
         * Defaults from the options provider
         *
         * Use `selectionModelOptionsProvider` when configuring your module to
         * set application wide defaults
         */
        var defaultOptions = selectionModelOptions.get()
            , defaultSelectedAttribute = defaultOptions.selectedAttribute
            , defaultSelectedClass = defaultOptions.selectedClass
            , defaultType = defaultOptions.type
            , defaultMode = defaultOptions.mode
            , defaultCleanupStrategy = defaultOptions.cleanupStrategy
            , defaultUseKeyboardNavigation = defaultOptions.useKeyboardNavigation;

        /**
         * The selection model type
         *
         * Controls how selections are presented on the underlying element. Use
         * 'basic' (the default) to simply assign a "selected" class to
         * selected items. If set to 'checkbox' it'll also sync the checked
         * state of the first checkbox child in each underlying `tr` or `li`
         * element.
         *
         * Note that the 'checkbox' type assumes the first input child element
         * will be the checkbox.
         */
        var smType = scope.$eval(attrs.selectionModelType) || defaultType;

        /**
         * The selection mode
         *
         * Supports 'single', 'multi[ple]', and 'multi[ple]-additive'. Single
         * mode will only allow one item to be marked as selected at a time.
         * Vanilla multi mode allows for multiple selectioned items but requires
         * modifier keys to select more than one item at a time. Additive-multi
         * mode allows for multiple items to be selected and will not deselect
         * other items when a vanilla click is made. Additive multi also allows
         * for de-selection without a modifier key (think of `'multi-additive'`
         * as turning every click into a ctrl-click.
         */
        var smMode = scope.$eval(attrs.selectionModelMode) || defaultMode
            , isMultiMode = /^multi(ple)?(-additive)?$/.test(smMode)
            , isModeAdditive = /^multi(ple)?-additive/.test(smMode);

        /**
         * The item attribute to track selected status
         *
         * Use `selection-model-selected-attribute` to override the default
         * attribute.
         */
        var selectedAttribute = scope.$eval(attrs.selectionModelSelectedAttribute) || defaultSelectedAttribute;

        /**
         * The selected class name
         *
         * Will be applied to dom items (e.g. `tr` or `li`) representing
         * selected items. Use `selection-model-selected-class` to override the
         * default class name.
         */
        var selectedClass = scope.$eval(attrs.selectionModelSelectedClass) || defaultSelectedClass;

        /**
         * The cleanup strategy
         *
         * How to handle items that are removed from the current view. By
         * default no action is taken, you may set this to `deselect` to force
         * items to be deselected when they are filtered away, paged away, or
         * otherwise no longer visible on the client.
         */
        var cleanupStrategy = scope.$eval(attrs.selectionModelCleanupStrategy) || defaultCleanupStrategy;

        /**
         * Whether or not to use Keyboard Navigation
         *
         * If evaluated to true, we'll bind the parent element with
         * UpArrow/DownArrow keyboard events to navigate the selections.
         */
        var smUseKeyboardNav = scope.$eval(attrs.selectionModelUseKeyboardNavigation) || defaultUseKeyboardNavigation;

        /**
         * The onEnterKeypress callback
         *
         * To be executed whenever the user presses Enter if
         * we're using Keyboard Navigation
         */
        var smOnEnterKeypress = attrs.selectionModelOnEnterKeypress;
        if(smOnEnterKeypress && !smUseKeyboardNav) {
          throw 'selection-model-on-enter-keypress must be used with selection-model-use-keyboard-navigation set to true';
        }

        /**
         * The change callback
         *
         * To be executed whenever the item's selected state changes.
         */
        var smOnChange = attrs.selectionModelOnChange;

        /**
         * The list of items
         *
         * selectionModel must be attached to the same element as an ngRepeat
         */
        var repeatLine = attrs.ngRepeat;
        if(!repeatLine) {
          throw 'selectionModel must be used along side ngRepeat';
        }

        /**
         * The list of selected items
         *
         * If used should resolve to an (initially empty) array.  Use this in
         * your view as **read only** if you'd like to do something with just
         * the selected items. Note that order is not guarenteed and any items
         * added to this array programmatically are ignored.
         */
        var selectedItemsList = scope.$eval(attrs.selectionModelSelectedItems);

        /**
         * The last-click stack id
         *
         * There may be multiple selection models on the page and each will need
         * independent click stacks.
         */
        var clickStackId = (function() {
          if(!isMultiMode) {
            return null;
          }
          var idAttr = 'data-selection-model-stack-id';
          // Id may be cached on this element
          var stackId = element.attr(idAttr);
          if(stackId) {
            return stackId;
          }

          // Otherwise it may be on the partent
          stackId = element.parent().attr(idAttr);
          if(stackId) {
            element.attr(idAttr, stackId);
            return stackId;
          }

          // welp guess we're the first, create a new one and cache it on this
          // element (for us) and the parent element (for others)
          stackId = uuidGen.create();
          element.attr(idAttr, stackId);
          element.parent().attr(idAttr, stackId);
          return stackId;
        }());

        /**
         * repeatParts[0] -> The item expression
         * repeatParts[1] -> The collection expression
         * repeatParts[2] -> The track by expression (if present)
         */
        var repeatParts = repeatLine.split(/\sin\s|\strack\sby\s/g)
            , smItem = scope.$eval(repeatParts[0])
            , hasTrackBy = repeatParts.length > 2;

        var updateDom = function() {
          if(smItem[selectedAttribute]) {
            element.addClass(selectedClass);
          } else {
            element.removeClass(selectedClass);
          }

          if('checkbox' === smType) {
            var checkboxes = [];
            angular.forEach(element.find('input'), function(input) {
              input = angular.element(input);
              if(input.attr('type') === 'checkbox') {
                checkboxes.push(input);
              }
            });

            if(checkboxes.length) {
              checkboxes[0].prop('checked', smItem[selectedAttribute]);
            }
          }
        };

        var getAllVisibleItems = function() {
          return scope.$eval(repeatParts[1]);
        };

        // Strips away filters - this lets us e.g. deselect items that are
        // filtered out
        var getAllItems = function() {
          return scope.$eval(repeatParts[1].split(/[|=]/)[0]);
        };

        // Get us back to a "clean" state. Usually we'll want to skip
        // deselection for items that are about to be selected again to avoid
        // firing the `selection-mode-on-change` handler extra times.
        //
        // `except` param may be `undefined` (deselect all the things), a single
        // item (don't deselect *that* item), or an array of two items (don't
        // deselect anything between those items inclusively).
        var deselectAllItemsExcept = function(except) {
          var useSelectedArray = angular.isArray(selectedItemsList)
              , isRange = angular.isArray(except) && 2 === except.length
              , allItems = getAllItems()
              , numItemsFound = 0
              , doDeselect = false
              , ixItem;
          if(useSelectedArray) {
            selectedItemsList.length = 0;
          }
          angular.forEach(allItems, function(item) {
            if(isRange) {
              ixItem = except.indexOf(item);
              if(ixItem > -1) {
                numItemsFound++;
                doDeselect = false;
                except.splice(ixItem, 1);
              } else {
                doDeselect = 1 !== numItemsFound;
              }
            } else {
              doDeselect = item !== except;
            }
            if(doDeselect) {
              item[selectedAttribute] = false;
            } else {
              if(useSelectedArray && item[selectedAttribute]) {
                selectedItemsList.push(item);
              }
            }
          });
        };

        var selectItemsBetween = function(lastItem) {
          var allItems = getAllVisibleItems()
              , foundLastItem = false
              , foundThisItem = false;

          lastItem = lastItem || smItem;

          angular.forEach(allItems, function(item) {
            foundThisItem = foundThisItem || item === smItem;
            foundLastItem = foundLastItem || item === lastItem;
            var inRange = (foundLastItem + foundThisItem) === 1;
            if(inRange || item === smItem || item === lastItem) {
              item[selectedAttribute] = true;
            }
          });
        };

        /**
         * Item click handler
         *
         * Use the `ctrl` key to select/deselect while preserving the rest of
         * your selection. Note your your selection mode must be set to
         * `'multiple'` to allow for more than one selected item at a time. In
         * single select mode you still must use the `ctrl` or `shift` keys to
         * deselect an item.
         *
         * The `shift` key allows you to select ranges of items at a time. Use
         * `ctrl` + `shift` to select a range while preserving your existing
         * selection. In single select mode `shift` behaves like `ctrl`.
         *
         * When an item is clicked with no modifier keys pressed it will be the
         * only selected item.
         *
         * On Mac the `meta` key is treated as `ctrl`.
         *
         * Note that when using the `'checkbox'` selection model type clicking
         * on a checkbox will have no effect on any row other than the one the
         * checkbox is in.
         */
        var handleClick = function(event) {

          /**
           * Set by the `selectionModelIgnore` directive
           *
           * Use `selectionModelIgnore` to cause `selectionModel` to selectively
           * ignore clicks on elements. This is useful if you want to manually
           * change a selection when certain things are clicked.
           */
          if(event.selectionModelIgnore || (event.originalEvent && event.originalEvent.selectionModelIgnore)) {
            return;
          }

          // Never handle a single click twice.
          if(event.selectionModelClickHandled || (event.originalEvent && event.originalEvent.selectionModelClickHandled)) {
            return;
          }
          event.selectionModelClickHandled = true;
          if(event.originalEvent) {
            event.originalEvent.selectionModelClickHandled = true;
          }

          var isCtrlKeyDown = event.ctrlKey || event.metaKey || isModeAdditive
              , isShiftKeyDown = event.shiftKey
              , target = event.target || event.srcElement
              , isCheckboxClick = 'checkbox' === smType &&
              'INPUT' === target.tagName &&
              'checkbox' === target.type;

          /**
           * Guard against label + checkbox clicks
           *
           * Clicking a label will cause a click event to also be fired on the
           * associated input element. If that input is nearby (i.e. under the
           * selection model element) we'll suppress the click on the label to
           * avoid duplicate click events.
           */
          if('LABEL' === target.tagName) {
            var labelFor = angular.element(target).attr('for');
            if(labelFor) {
              var childInputs = element[0].getElementsByTagName('INPUT'), ix;
              for (ix = childInputs.length; ix--;) {
                if(childInputs[ix].id === labelFor) {
                  return;
                }
              }
            } else if(target.getElementsByTagName('INPUT').length) {
              // Label has a nested input element, we'll handle the click on
              // that element
              return;
            }
          }

          // Select multiple allows for ranges - use shift key
          if(isShiftKeyDown && isMultiMode && !isCheckboxClick) {
            // Use ctrl+shift for additive ranges
            if(!isCtrlKeyDown) {
              scope.$apply(function() {
                deselectAllItemsExcept([smItem, selectionStack.peek(clickStackId)]);
              });
            }
            selectItemsBetween(selectionStack.peek(clickStackId));
            scope.$apply();
            return;
          }

          // Use ctrl/shift without multi select to true toggle a row
          if(isCtrlKeyDown || isShiftKeyDown || isCheckboxClick) {
            var isSelected = !smItem[selectedAttribute];
            if(!isMultiMode) {
              deselectAllItemsExcept(smItem);
            }
            smItem[selectedAttribute] = isSelected;
            if(smItem[selectedAttribute]) {
              selectionStack.push(clickStackId, smItem);
            }
            scope.$apply();
            return;
          }

          // Otherwise the clicked on row becomes the only selected item
          deselectAllItemsExcept(smItem);
          scope.$apply();

          smItem[selectedAttribute] = true;
          selectionStack.push(clickStackId, smItem);
          scope.$apply();
        };

        /**
         * getBaseElement
         *
         * If we're using keyboard navigation we need to determine our outer base parent element to ensure we have focus
         * before handling key presses.
         *
         * For tables if we're repeating over <tr> elements we can't simply use the parent of the current element,
         * since we might be inside of a <tbody> or <thead>. Instead, search up until we find the base <table> element.
         *
         * For <li> elements we can find the <ol> or <li> elements.
         *
         * For <a> or similar elements we can find the <nav>.
         */
        function getBaseElement() {
          var el = element
            , currentTagName
            , baseElement
            , baseElementFound = false
            , maxSearchDepth = 5;

          // Recursively search up the parent stack until we find our parent <table>/<ul>/<ol>/<nav>
          while (baseElementFound !== true && maxSearchDepth > 0) {
            el = el.parent();
            currentTagName = el[0] ? el[0].tagName : '';
            if('TABLE' === currentTagName ||
                'UL' === currentTagName ||
                'OL' === currentTagName ||
                'NAV' === currentTagName) {
              baseElementFound = true;
              baseElement = el[0];
            }
            maxSearchDepth--;
          }

          if(!baseElement) {
            throw 'selection-model-use-keyboard-navigation must be used inside of a table, ul, ol, or nav element';
          }

          return baseElement;
        }

        var doesBaseElementHaveFocus = function() {
          var currentlyFocusedElement = $document[0].activeElement
            , baseElement = getBaseElement();

          return currentlyFocusedElement === baseElement;
        };

        /**
         * Key Press event handler
         *
         * Pressing up/down while selectionModelUseKeyboardNavigation is set to true will change your selection to the
         * previous/next item in the visible list of items.
         *
         * If smMode is set to 'multiple', holding Shift will not deselect the previous item(s) so you can shift-press
         * multiple rows.
         *
         */
        var handleKeypress = function(event) {
          var keyCode = event.keyCode
            , keyPressed;

          if(!doesBaseElementHaveFocus()) {
            // Don't do anything if our base element is out of focus
            return;
          }

          // Determine which key the user has pressed
          // If not arrowUp, ArrowDown, or Enter: exit.
          switch (keyCode) {
            case (38):
              keyPressed = 'arrowUp';
              break;
            case (40):
              keyPressed = 'arrowDown';
              break;
            case (13):
              keyPressed = 'enter';
              break;
            default:
              return;
          }

          // If they've pressed the enter key, execute smOnEnter callback and exit
          if(keyPressed === 'enter') {
            scope.$eval(smOnEnterKeypress);
            return;
          }

          // Prevent default scrolling behavior (scrolling the browser window)
          // event.preventDefault();
          var isShiftKeyDown = event.shiftKey;

          var allItems = getAllVisibleItems()
            , maxIx = allItems.length
            , firstItem = selectionStack.peek(clickStackId) ? selectionStack.peek(clickStackId) : allItems[0]
            , currentIx = allItems.indexOf(firstItem)
            , nextItem;

          // Ensure our firstItem is within the list of visible Items
          if(currentIx > -1) {
            if(keyPressed === 'arrowDown' && currentIx + 1 <= maxIx) {
              // As long as next item isn't outside the top bounds of our list
              nextItem = allItems[currentIx + 1];
            } else if(keyPressed === 'arrowUp' && currentIx - 1 >= 0) {
              // As long as next item isn't outside the bottom bounds of our list
              nextItem = allItems[currentIx - 1];
            }
            if(nextItem) {
              if(!isShiftKeyDown && isMultiMode) {
                deselectAllItemsExcept(nextItem);
                scope.$apply();
              }

              nextItem[selectedAttribute] = true;
              selectionStack.push(clickStackId, nextItem);
              scope.$apply();
            }
          }
        };

        /**
         * Bind the document keydown event to our handleKeypress function.
         * Since the parent element is not an input we have to use onkeydown
         * on the $document itself.
         *
         * Only do this once per list of selection-model elements, so flag
         * that we have done so on the parent element once completed for the
         * first time.
         */
        var bindKeypress = function() {
          var keypressAttr = 'data-selection-model-keypress-bound';

          // Look to see if cached on parent
          if(element.parent().attr(keypressAttr)) {
            return;
          }

          // We haven't bound the keypress to the parent element yet
          // Do so now and then cache the attribute
          element.parent().attr(keypressAttr, true);

          // Now bind our keypress event to the document
          $document.on('keydown', handleKeypress);
        };
        if(smUseKeyboardNav) {
          bindKeypress();
        }

        /**
         * Routine to keep the list of selected items up to date
         *
         * Adds/removes this item from `selectionModelSelectedItems`.
         */
        var updateSelectedItemsList = function() {
          if(angular.isArray(selectedItemsList)) {
            var ixSmItem = selectedItemsList.indexOf(smItem);
            if(smItem[selectedAttribute]) {
              if(-1 === ixSmItem) {
                selectedItemsList.push(smItem);
              }
            } else {
              if(-1 < ixSmItem) {
                selectedItemsList.splice(ixSmItem, 1);
              }
            }
          }
        };

        element.on('click', handleClick);
        if('checkbox' === smType) {
          var elCb = element.find('input');
          if(elCb[0] && 'checkbox' === elCb[0].type) {
            element.find('input').on('click', handleClick);
          }
        }

        // We might be coming in with a selection
        updateDom();
        updateSelectedItemsList();

        // If we were given a cleanup strategy then setup a `'$destroy'`
        // listener on the scope.
        if('deselect' === cleanupStrategy) {
          scope.$on('$destroy', function() {
            var oldSelectedStatus = smItem[selectedAttribute];
            smItem[selectedAttribute] = false;
            updateSelectedItemsList();
            if(smOnChange && oldSelectedStatus) {
              scope.$eval(smOnChange);
            }
          });
        }

        scope.$watch(repeatParts[0] + '.' + selectedAttribute, function(newVal, oldVal) {
          // Be mindful of programmatic changes to selected state
          if(newVal !== oldVal) {
            if(!isMultiMode && newVal && !oldVal) {
              deselectAllItemsExcept(smItem);
              smItem[selectedAttribute] = true;
            }
            updateDom();
            updateSelectedItemsList();

            if(smOnChange) {
              scope.$eval(smOnChange);
            }
          }
        });

        // If we're using track-by with ngRepeat it's possible the item
        // reference will change without this directive getting re-linked.
        if(hasTrackBy) {
          scope.$watch(repeatParts[0], function(newVal) {
            smItem = newVal;
          });
        }
      }
    };
  }
]);


/**
 * Default options for the selection model directive
 *
 *
 *
 * @package selectionModel
 */

angular.module('selectionModel').provider('selectionModelOptions', [function() {
  'use strict';

  var options = {
    selectedAttribute: 'selected',
    selectedClass: 'selected',
    type: 'basic',
    mode: 'single',
    cleanupStrategy: 'none',
    useKeyboardNavigation: false
  };

  this.set = function(userOpts) {
    angular.extend(options, userOpts);
  };

  this.$get = function() {
    var exports = {
      get: function() {
        return angular.copy(options);
      }
    };
    return exports;
  };


}]);


angular.module('selectionModel').service('selectionStack', function() {
  'use strict';
  var exports = {}
    , maxSize = 1000
    , stacks = {};

  exports.push = function(id, item) {
    if(!stacks.hasOwnProperty(id)) {
      stacks[id] = [];
    }
    var stack = stacks[id];
    stack.push(item);
    while(stack.length > maxSize) {
      stack.shift();
    }
    return stack.length;
  };

  exports.pop = function(id) {
    if(!stacks.hasOwnProperty(id)) {
      stacks[id] = [];
    }
    var stack = stacks[id];
    return stack.pop();
  };

  exports.peek = function(id) {
    if(!stacks.hasOwnProperty(id)) {
      stacks[id] = [];
    }
    var stack = stacks[id];
    return stack.length ? stack[stack.length - 1] : undefined;
  };

  return exports;
});

/*jshint bitwise:false */

angular.module('selectionModel').service('uuidGen', function() {
  'use strict';
  var exports = {};
  var uid = ['0', '0', '0'];

  exports.create = function() {
    var index = uid.length;
    var digit;
    while (index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit === 57 /*'9'*/ ) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit === 90 /*'Z'*/ ) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  };

  return exports;
});
