function ShippingOption(name, type, courier) {
  if (typeof name === 'object') {
    this.name = name.name;
    this.type = name.type;
    this.amount = name.amount;
    this.service = name.service;
    this.courier = name.courier;
  } else {
    this.name = name;
    this.type = type;
    this.amount = -1.00;
    this.service = "";
    this.courier = courier;
  }
}

ShippingOption.prototype.toString = function() {
  return this.type + "|" + this.service + "|" + this.amount;    
};

ShippingOption.prototype.getNameAndService = function() {
  var s = this.name;
  if (this.service) {
    s += (" - (" + this.service + ")");
  }
  return s;
};
  
function ShippingData() {
  this.settlement = { "country": "България" };
  this.options = [];
  this.selectedOption = null;
  this.office = {};
}

ShippingData.prototype.canShippingBeCalculated = function() {
  if (!this.settlement.country)
    return false;

  if (this.settlement.country == 'България') {
    if (!this.settlement.zipCode || !this.settlement.city)
      return false;
  }
  
  return true;  
}

ShippingData.prototype.getCityPretty = function () {
  var s = this.settlement;
  var res='';
  if (s.type) 
    res += s.type + ' ';
  if (s.city)  
    res += s.city;
  return res;
}

ShippingData.prototype.getCityAndZipPretty = function () {
  var res = this.getCityPretty();
  if (this.settlement.zipCode)
    res += ' ' + this.settlement.zipCode;
  return res;  
}

ShippingData.prototype.getOption = function () {
  if (this.selectedOptionObj == null)
    for (var i = 0; this.options && i < this.options.length; i++) {
      if (this.options[i].toString() === this.selectedOption) {
        this.selectedOptionObj = this.options[i];
        break;
      }
    }
  return this.selectedOptionObj;
}

ShippingData.prototype.setOption = function (optionStrOrObj) {
  if (typeof optionStrOrObj === 'string')
    this.selectedOption = optionStrOrObj;
  else {
    this.selectedOption = optionStrOrObj ? optionStrOrObj.toString() : null;
    this.selectedOptionObj = optionStrOrObj;
  }
}

ShippingData.prototype.updateOptions = function (newOptions) {
  { //if (!angular.equals(this.options, newOptions)){
    this.options = newOptions;
    if (this.selectedOption) {
      var ss = this.selectedOption.split("|");
      var found = false;
      for (var i = 0; !found && i < this.options.length; i++) {
        if (this.options[i].type === ss[0] && this.options[i].service === ss[1]) {
          this.selectedOptionObj = this.options[i];
          this.selectedOption = this.options[i].toString();
          found = true;
          break;
        }
      }
      if (!found) {
        this.selectedOptionObj = null;
        this.selectedOption = null;
      }
    } else {
      this.selectedOptionObj = null;
    }
  }
}

ShippingData.prototype.copyTo = function(obj) {
  angular.copy(this.settlement, obj.settlement);
  angular.copy(this.options, obj.options);
  obj.selectedOptionObj = null;
  obj.selectedOption = this.selectedOption;

  //angular.copy(this.prototype, obj.prototype);
}

ShippingData.prototype.propagateSettlement = function(obj) {
  this.settlement.type = obj.type;
  this.settlement.city = obj.city;
  this.settlement.zipCode = obj.zipCode;
  this.settlement.combo = obj.combo;
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

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

                $timeout.cancel(timeoutPromise); // does nothing, if timeout already done
                timeoutPromise = $timeout(function() {
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
    
    ///////////////////////////////////////////
    // cart
    ///////////////////////////////////////////
    .value(
        "cart",
        
          { "items": [], "subTotal": 0.00, "shippingCosts": 0.00, "total": 0.00, "count": 0.00, "weight": 0.00,
            "contactData": {},
            "shippingData": new ShippingData(),
            "initial": true }

    )

    ////////////////////////////////////////////
    // CartService
    ////////////////////////////////////////////
    .factory('CartService',
        [ 'cart', 'utils', '$rootScope', 'CART_EVENTS', function(cart, utils, $rootScope, CART_EVENTS) {
          console.log("[243 cart.factory CartService]");
          var service = {};

          // cart object
          service.cart = cart;

          // addItem
          service.addItem = function(product, qty) {
            var quantity = parseInt(qty);
            var item = service.findItem(product.fullId);
            if (item) {
              // console.log("already exists");
              item.quantity = parseInt(item.quantity) + parseInt(quantity);
            } else {
              // console.log("adding new item in cart");
              item = buildItem(product, quantity);
              cart.items.push(item);
            }
            $rootScope.$broadcast(CART_EVENTS.itemAdded, item);
            service.recalcTotals();
          }

          // removeItem
          service.removeItem = function(id) {
            var index = utils.getIndexOf(cart.items, id);
            if (index >= 0) {
              cart.items.splice(index, 1);
              $rootScope.$broadcast(CART_EVENTS.itemRemoved, id);
              service.recalcTotals();
            }
          }

          // addItem
          service.editItem = function(id, newQty) {
            var quantity = parseInt(newQty);
            var item = service.findItem(id);
            if (item) {
              if (quantity == 0) {
                service.removeItem(id);
              } else {
                item.quantity = quantity;
                $rootScope.$broadcast(CART_EVENTS.itemQuantityChanged, item);
                service.recalcTotals();
              }
            }
          }

          // reset cart
          service.resetCart = function() {
            cart.items.splice(0, cart.items.length);
            service.recalcTotals();
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
            // angular.copy(items, cart.items);
            // service.recalcTotals();
          }
          
          service.canShippingBeCalculated = function() {
            var a = cart.shippingData.settlement;
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
            var oldCart = angular.copy(cart);
            var newTotal = 0.00;
            var cnt = 0.00;
            var weight = 0.00;
            cart.items.forEach(function(item) {
              item.sum = item.product.price * item.quantity;
              newTotal += item.sum;
              cnt += parseInt(item.quantity);
              if (!isNaN(parseInt(item.product.weight)))
                weight += (parseInt(item.product.weight) * item.quantity);
            });
            cart.subTotal = newTotal;
            cart.count = cnt;
            cart.weight = weight;
            //TODO recalc shipping costs
            cart.shippingCosts = 0.00;
            if (service.canShippingBeCalculated()) {
              cart.shippingCosts = 6.00;
              if (cart.subTotal == 0)
                  cart.shippingCosts = 0.00;
              if (cart.subTotal >= 40)
                cart.shippingCosts = 3.00;
              if (cart.subTotal >= 60)
                cart.shippingCosts = 0.00;
            }
            cart.total = cart.subTotal + cart.shippingCosts;
            
            if(!angular.equals(oldCart, cart)) {
              console.log("broadcast change cart...");
              $rootScope.$broadcast(CART_EVENTS.cartChanged, cart);
            }
          }

          // findItem
          service.findItem = function(id) {
            return utils.findById(cart.items, id);
          }
          
          service.isAddressDataOK = function() {
            
            if (!service.canShippingBeCalculated()) 
              return false;

            var sd = cart.shippingData;
            var so = sd.selectedOption;
            
            
            var option = sd.getOption();
            if (!option)
              return false;
            
            if (option.type === "atelier") {
              //nothing more is required
              return true;
            } else if (option.type === "office") {
              if (!sd.office[option.courier]) {
                return false;
              }
            } else if (option.type === "address") {
              if (!sd.office[option.type])
                return false;
            }
          
            if (sd.wantInvoice && !sd.invoiceData)
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
            var jsonStr = JSON.stringify(service.cart, function(key, value) {
                if (key === 'options')
                  return [];
                else if (key === 'selectedOptionObj')
                  return null;
                else if (key === 'ekontOffices')
                  return [];
                else if (key === 'speedyOffices')
                  return [];
                  
                return value;  
              });
            
            return $.ajax({
              type : "POST",
              encoding:"UTF-8",
              url : 'php/save_cart.php',
              data : { 'cart': jsonStr, 'username': username },//TODO use replacer to exclude some fields
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
                
                if (newCart.items) {
                  angular.copy(newCart.contactData, service.cart.contactData);
                  angular.copy(newCart.shippingData, service.cart.shippingData);
                  angular.copy(newCart.items, service.cart.items);
                  CartService.recalcTotals();
                  console.log("CART LOADED................................");
                }
                
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
