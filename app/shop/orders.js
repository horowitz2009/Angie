angular.module('felt.shop.orders', [

])

// ////////////////////////////////////////////////////////////////////////
// ORDER SERVICE
// ////////////////////////////////////////////////////////////////////////
.factory(
    'OrderService',
    [ '$http', 'utils', '$q', '$state', 'AuthService', 'CartService', 'ShippingFactory','OrderPersistenceService',
        function($http, utils, $q, $state, AuthService, CartService, ShippingFactory, OrderPersistenceService) {
          console.log("[  6 order.factory OrderService]");

          var factory = {};
          
          factory.order = {};
          
          
          
          factory.getOrder = function(id) {
            return OrderPersistenceService.loadOrder(AuthService.getUsername(), id);
          }
          
          factory.getAllOrders = function(id) {
            return OrderPersistenceService.getAllOrders(AuthService.getUsername());
          }
          
          factory.submitOrder = function() {
            console.log("submit order...");

            // 1. save the order
            // TODO convert cart to order, please!!!
            var order = {};
            var cart = CartService.cart;
            order.contactData = {};
            order.shippingData = {};
            order.items = [];
            angular.copy(cart.contactData, order.contactData);
            angular.copy(cart.shippingData, order.shippingData);
            angular.copy(cart.items, order.items);
            order.subTotal = cart.subTotal;
            order.status = 'pending';
            
            order.option = cart.shippingData.getOption();
            
            factory.order = order;
            
            OrderPersistenceService.saveOrder(AuthService.getUsername(), order, function(resp) {
              // on success
              // 2. clear the cart
              // 3. display the "congrats" page
              console.log(resp);
              CartService.emptyCart();
              
              $state.go('shop.cart.done', resp);
              
            }, function(err) {
              console.log("whaaat" + err);
            });
          }

          // PSEUDO-PRIVATE METHODS
          function doSomething(par) {
          }

          return factory;
        } ])

// ////////////////////////////////////////////////////////////////////////
// ORDER PERSISTENCE SERVICE
// ////////////////////////////////////////////////////////////////////////

.factory('OrderPersistenceService', ['utils', '$rootScope', function(utils, $rootScope) {
  console.log("[    order.factory OrderPersistenceService]");
  var service = {};

  // try not use these callbacks, instead use the promise functionality
  service.saveOrder = function(username, order, successCallback, errorCallback) {
    console.log("Saving order of user " + username);
    var jsonStr = JSON.stringify(order, function(key, value) {
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
      encoding : "UTF-8",
      url : 'php/place_order.php',
      data : {
        'data' : jsonStr,
        'username' : username
      },
      success : successCallback,
      error : errorCallback
    });

  }

  service.loadOrder = function(username, orderId) {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/load_order.php',
      data : {
        'username' : username,
        'id' : orderId
      },
      success : function(order) {
        return order;
      }
    });

  }

  service.getAllOrders = function(username) {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/get_orders.php',
      data : {
        'username' : username
      },
      success : function(order) {
        return order;
      }
    });
    
  }
  
  service.changeOrderStatus = function(orderId, newStatus) {
    console.log("Changing status of order #" + orderId + " to " + newStatus);
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/update_order_status.php',
      data : {
        'id' : orderId,
        'newstatus' : newStatus
      }
    });

  }

  return service;
} ]);
