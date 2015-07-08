angular.module('felt.shop.orders', [

])

// ////////////////////////////////////////////////////////////////////////
// ORDER SERVICE
// ////////////////////////////////////////////////////////////////////////
.factory('OrderService', [ '$http', 'utils', '$q', function($http, utils, $q) {
  console.log("[  6 order.factory OrderService]");

  var factory = {};

  factory.getSomething = function() {
    var promise = null;
    return promise;
  }

  // PSEUDO-PRIVATE METHODS
  function doSomething(par) {
  }

  return factory;
} ])

// ////////////////////////////////////////////////////////////////////////
// ORDER PERSISTENCE SERVICE
// ////////////////////////////////////////////////////////////////////////

.factory('OrderPersistenceService',
    [ 'OrderService', 'utils', '$rootScope', function(OrderService, utils, $rootScope) {
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
