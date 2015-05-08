angular
    .module('felt.shop.cart', [ 'ui.router', 'angularUtils.directives.uiBreadcrumbs', 'common.utils.service'

    ])

    .constant('CART_EVENTS', {
      cartChanged : 'cart-changed',
      itemAdded : 'item-added',
      itemRemoved : 'item-removed',
      itemQuantityChanged : 'item-quantity-changed',
      cartCleared : 'cart-cleared'
    })

    .config([ '$stateProvider', '$filterProvider', function($stateProvider, $filterProvider) {
      console.log("[ 15 cart.config]");
      // register a filter factory which uses the
      // greet service to demonstrate DI.
      $filterProvider.register('shortCategory', function() {
        return function(text) {
          if (text === "wool")
            return "w";
          return text;
        };
      });
      $filterProvider.register('shortOrigin', function() {
        return function(text) {
          if (text === "България")
            return "bg";
          if (text === "Германия")
            return "de";
          if (text === "Англия")
            return "en";
          return text;
        };
      });
      $filterProvider.register('numberAligned', function() {
        return function(text) {
          console.log("numberAligned");
          console.log(text);

          var floatNumber = parseFloat(text);
          var integerPart = Math.floor(floatNumber);
          floatNumber = floatNumber - integerPart;

          var frac = Math.round(floatNumber * 100);
          console.log(integerPart);
          console.log(floatNumber);
          console.log(frac);

          return '<span class="left">' + integerPart + '</span><span class="right">' + frac + '</span>';
        };
      });

      $stateProvider

      // /////////////////
      // SHOP > CART //
      // /////////////////
      .state('shop.cart', {

        abstract : true,

        url : '/cart',

        views : {
          'filter' : {
            templateUrl : 'app/shop/partials/filter.html'
          },

          'content' : {
            template : '<div ui-view="cartContent"></div>'
          }
        },

        data : {
          breadcrumbProxy : 'shop.cart.edit'
        }

      })

      .state('shop.cart.edit', {

        url : '',

        data : {
          displayName : 'Количка'
        },

        views : {
          'cartContent' : {
            templateUrl : 'app/shop/partials/cart.details.html',
            controller : [ '$scope', 'cart', 'CartService', function($scope, cart, CartService) {
              if (!$scope.cart) {
                console.log('adding cart to this scope');
                $scope.cart = cart;
              }
            } ]
          }
        }

      });
    } ])

    .directive('cartRepeatDirective',
        [ '$timeout', '$animate', '$rootScope', 'CART_EVENTS', function($timeout, $animate, $rootScope, CART_EVENTS) {
          console.log("[106 cart.directive cartRepeatDirective]");

          return {
            link : function(scope, element, attrs) {

              if (scope.$last) {
                scope.$emit('LastElem');
              }

              // apply TouchSpin
              scope.$watch('item', function() {
                $(element).children().find('input.qtyInput').TouchSpin({
                  min : 1,
                  max : 999,
                  stepinterval : 1,
                  maxboostedstep : 3,
                  replacementval : 1,
                  buttondown_class : 'btn btn-default',
                  buttonup_class : 'noborder-round btn btn-default',
                  buttondown_txt : '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>',
                  buttonup_txt : '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'

                });
              });

              var delayInMs = 100;
              var timeoutPromise = null;

              scope.$watch('item.quantity', function() {

                $timeout.cancel(timeoutPromise); // does nothing, if timeout
                // alrdy done
                timeoutPromise = $timeout(function() { // Set timeout
                  $rootScope.$broadcast(CART_EVENTS.itemQuantityChanged);
                  scope.recalcCart();
                }, delayInMs);

              });

            }
          };
        } ])

    .value("maxVisibleElements", 10)

    .value("maxV", {
      "value" : 10
    })

    .value(
        "cart",
        
          { "items": [], "subTotal": 0.00, "shippingCosts": 0.00, "total": 0.00, "initial": true }

    )

    .factory('CartService',
        [ 'cart', 'utils', '$rootScope', 'CART_EVENTS', function(cart, utils, $rootScope, CART_EVENTS) {
          console.log("[243 cart.factory CartService]");
          var service = {};

          // cart object
          service.cart = cart;

          // addItem
          service.addItem = function(product, qty) {
            var quantity = parseInt(qty);
            var item = this.findItem(product.fullId);
            if (item) {
              // console.log("already exists");
              item.quantity = parseInt(item.quantity) + parseInt(quantity);
            } else {
              // console.log("adding new item in cart");
              item = buildItem(product, quantity);
              this.cart.items.push(item);
            }
            $rootScope.$broadcast(CART_EVENTS.itemAdded, item);
            this.recalcTotals();
          }

          // removeItem
          service.removeItem = function(id) {
            var index = utils.getIndexOf(this.cart.items, id);
            if (index >= 0) {
              this.cart.items.splice(index, 1);
              $rootScope.$broadcast(CART_EVENTS.itemRemoved, id);
              this.recalcTotals();
            }
          }

          // addItem
          service.editItem = function(id, newQty) {
            var quantity = parseInt(newQty);
            var item = this.findItem(id);
            if (item) {
              if (quantity == 0) {
                this.removeItem(id);
              } else {
                item.quantity = quantity;
                $rootScope.$broadcast(CART_EVENTS.itemQuantityChanged, item);
                this.recalcTotals();
              }
            }
          }

          // mergeCarts
          service.mergeCarts = function(cart1, cart2) {
            //TODO fix this shit
//            var items = [];
//            if (cart1 && cart1.items) {
//              items = items.concat(cart1.items);
//            }
//            if (cart2 && cart2.items) {
//              items = items.concat(cart2.items);
//            }
//            angular.copy(items, this.cart.items);
            this.recalcTotals();
          }
          
          // recalcTotals
          service.recalcTotals = function() {
            var oldCart = angular.copy(this.cart);
            var newTotal = 0.00;
            this.cart.items.forEach(function(item) {
              item.sum = item.product.price * item.quantity;
              newTotal += item.sum;
            });
            this.cart.subTotal = newTotal;
            
            // TODO recalcShippingCosts
            this.cart.shippingCosts = 6.00;
            if (this.cart.subTotal == 0)
              this.cart.shippingCosts = 0.00;
            if (this.cart.subTotal >= 20)
              this.cart.shippingCosts = 3.00;
            if (this.cart.subTotal >= 40)
              this.cart.shippingCosts = 0.00;
            this.cart.total = this.cart.subTotal + this.cart.shippingCosts;
            
            if(!angular.equals(oldCart, this.cart)) {
              console.log("broadcast change cart...");
              $rootScope.$broadcast(CART_EVENTS.cartChanged, this.cart);
            }
          }

          // findItem
          service.findItem = function(id) {
            return utils.findById(this.cart.items, id);
          }

          return service;
        } ])

    // ////////////////////////////////////////////////////////////////////////
    // CART PERSISTENCE
    // ////////////////////////////////////////////////////////////////////////

    .factory('CartPersistenceService',
        [ 'CartService', 'utils', '$rootScope', 'CART_EVENTS', function(CartService, utils, $rootScope, CART_EVENTS) {
          console.log("[322 cart.factory CartPersistenceService]");
          var service = {};

          service.cart = CartService.cart;
          
          // try not use these callbacks, instead use the promise functionality
          service.saveCart = function(username, successCallback, errorCallback) {
            console.log("Saving cart of user " + username);
//            if (service.cart.initial) {
//              console.log("Saving cart skipped...");
//              return null;
//            }
            return $.ajax({
              type : "POST",
              encoding:"UTF-8",
              url : 'php/save_cart.php',
              data : { 'cart': JSON.stringify(service.cart), 'username': username },
              success : successCallback,
              error : errorCallback
            });

          }
          
          service.loadCart = function(username) {
            return $.ajax({
              type : "POST",
              encoding:"UTF-8",
              url : 'php/load_cart.php',
              data : {'username' : username},
              success : function(newCart) {
                //service.cart = newCart;//TODO check if this is working
                if (newCart.items)
                  angular.copy(newCart, service.cart);
                CartService.recalcTotals();
              }
            });
            
          }

          return service;
        } ])

.run(function () { console.log("[363 cart.run]"); })
.config([ '$stateProvider', '$filterProvider', function($stateProvider, $filterProvider) {
      console.log("[365 cart.config2]");
}])

;

// private functions

function buildItem(product, qty) {
  var quantity = parseInt(qty);
  var item = {};
  item.id = product.fullId;
  item.product = product;
  item.quantity = quantity;
  item.sum = product.price * quantity;
  return item;
}
