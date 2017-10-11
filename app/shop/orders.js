angular.module('felt.shop.orders', [

])

.filter('orderStatus', function() {
  return function(input) {
    input = input || '';
    var out = "";
    
    return out;
  };
})

// ////////////////////////////////////////////////////////////////////////
// ORDER SERVICE
// ////////////////////////////////////////////////////////////////////////
.factory(
    'OrderService',
    [ '$http', 'utils', '$q', '$state', 'AuthService', 'CartService', 'ShippingFactory','OrderPersistenceService',
        function($http, utils, $q, $state, AuthService, CartService, ShippingFactory, OrderPersistenceService) {
          console.log("[  6 order.factory OrderService]");

          var factory = {};
          
          factory.order = {};//TODO is this used?
          
          
          
          factory.getOrder = function(id) {
            return OrderPersistenceService.loadOrder(AuthService.getUsername(), id);
          }

          factory.getOrderAdmin = function(id) {
            return OrderPersistenceService.loadOrder('', id);
          }
          
          factory.getAllUserOrders = function() {
            if (AuthService.getUsername() == 'guest')
	      return [];
            return OrderPersistenceService.getAllOrders(AuthService.getUsername());
          }

          factory.getAllUserOrderIds = function() {
            return OrderPersistenceService.getAllOrderIds(AuthService.getUsername());
          }
          
          factory.getAllOrders = function() {
            return OrderPersistenceService.getAllOrders('');
          }
          
          factory.getAllOrderIds = function() {
            return OrderPersistenceService.getAllOrderIds('');
          }
          
          factory.changeOrderStatus = function(id, newStatus) {
            return OrderPersistenceService.changeOrderStatus(id, newStatus);
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
            order.status = 'pending';
            order.subTotal = cart.subTotal;
            order.option = cart.shippingData.getOption();
            order.total = cart.subTotal + order.option.amount;
            
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
        if (order && !angular.equals(order, {})) {
          order.datePlaced = new Date(order.datePlaced);
          order.dateChanged = new Date(order.dateChanged);
        } else
          return null;
          
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
      success : function(orders) {
        for(var i = 0; i < orders.length; i++) {
          orders[i].datePlaced = new Date(orders[i].datePlaced);
          orders[i].dateChanged = new Date(orders[i].dateChanged);
        }
        return orders;
      }
    });
    
  }
  
  service.getAllOrderIds = function(username) {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/get_order_ids.php',
      data : {
        'username' : username
      },
      success : function(orderIds) {
        return orderIds;
      }
    });
    
  }
  
  service.changeOrderStatus = function(orderId, newStatus) {
    console.log("Changing status of order #" + orderId + " to " + newStatus);
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/change_order_status.php',
      data : {
        'id' : orderId,
        'status' : newStatus
      }
    });

  }

  return service;
} ]);
