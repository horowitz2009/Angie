angular
    .module('felt.shop.cart', [ 'ui.router', 'angularUtils.directives.uiBreadcrumbs', 'common.utils.service'

    ])
    
    //Router stuff is in cart.router.js

    .constant('CART_EVENTS', {
      cartChanged : 'cart-changed',
      itemAdded : 'item-added',
      itemRemoved : 'item-removed',
      itemQuantityChanged : 'item-quantity-changed',
      cartCleared : 'cart-cleared',
      addressChanged : 'address-changed'
    })

    .config(['$filterProvider', function($filterProvider) {
      console.log("[ 17 cart.config1]");
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
    }])
    
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
        
          { "items": [], "subTotal": 0.00, "shippingCosts": 0.00, "total": 0.00, "count": 0.00,
            "address": { country: "България"},
            
            "initial": true }

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

          // reset cart
          service.resetCart = function() {
            this.cart.items.splice(0, this.cart.items.length);
            this.recalcTotals();
          }
          
          // mergeCarts
          service.mergeCarts = function(cart1, cart2) {
            //TODO someday I could rethink this strategy. For now I stick to 'use newest'
            // var items = [];
            // if (cart1 && cart1.items) {
            // items = items.concat(cart1.items);
            // }
            // if (cart2 && cart2.items) {
            // items = items.concat(cart2.items);
            // }
            // angular.copy(items, this.cart.items);
            // this.recalcTotals();
          }
          
          service.canShippingBeCalculated = function() {
            var a = this.cart.address;
            if (!a || !a.country)
              return false;

            if (a.country == 'България') {
              if (!a.zipCode || !a.city)
                return false;
            }
            
            return true;
          }
          
          // recalcTotals
          service.recalcTotals = function() {
            var oldCart = angular.copy(this.cart);
            var newTotal = 0.00;
            var cnt = 0.00;
            this.cart.items.forEach(function(item) {
              item.sum = item.product.price * item.quantity;
              newTotal += item.sum;
              cnt += parseInt(item.quantity);
            });
            this.cart.subTotal = newTotal;
            console.log("count: " + cnt);
            this.cart.count = cnt;
            
            // TODO recalcShippingCosts
            this.cart.shippingCosts = 0.00;
            if (this.canShippingBeCalculated()) {
              this.cart.shippingCosts = 6.00;
              if (this.cart.subTotal == 0)
                this.cart.shippingCosts = 0.00;
              if (this.cart.subTotal >= 40)
                this.cart.shippingCosts = 3.00;
              if (this.cart.subTotal >= 60)
                this.cart.shippingCosts = 0.00;
            }
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
          
          service.isAddressDataOK = function() {
            var a = this.cart.address;
            if (!a || !a.country)
              return false;

            var addressRequired = true;
            if (a.country == 'България') {
              if (a.addressOption == "ekont") {
                addressRequired = false;
                if (!a.ekontOffice)
                  return false;
              } else if (a.addressOption == "speedy") {
                addressRequired = false;
                if (!a.speedyOffice)
                  return false;
              }
            }
            if (addressRequired) {
              // either is Bulgaria and not office option, or
              // not Bulgaria
              if (!a.zipCode || !a.city || !a.streetAddress1)
                return false;
            }
            if (a.wantInvoice && !a.invoiceData)
              return false;
            return true;
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
          
          service.transferCart = function(oldUsername, newUsername) {
            console.log("Transferring cart from " + oldUsername + " to " + newUsername);
            return $.ajax({
              type : "POST",
              encoding:"UTF-8",
              url : 'php/transfer_cart.php',
              data : { 'cart': JSON.stringify(service.cart), 'oldusername': oldUsername, 'newusername': newUsername }
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
