angular.module('felt.shop.orders')

.config([ '$stateProvider', function($stateProvider) {
  console.log("[  4 orders.router.config]");

  $stateProvider
  
  // /////////////////
  // SHOP > ORDER //
  // /////////////////
  .state('shop.order', {

    abstract : true,

    url : '/order',

    params : {
      'id' : -1
    },

    views : {
      'filter' : {
        template : ''
      },

      'content3' : {
        template : '<div ui-view="cartContent"></div>'
      }
    },

    data : {
      //breadcrumbProxy : 'shop.order.display'
    },

    resolve : {
      order : [ '$stateParams', 'utils', function($stateParams, utils) {
        // return utils.findById(categories, $stateParams.categoryId);
        return {
          "id" : $stateParams['id']
        };
      } ]
    }


  })

  .state('shop.order.display', {
    
    url : '/display/{id}',

    data : {
      displayName : 'Поръчка #{{order.id}}'
    },

    views : {
      'cartContent' : {
        templateUrl : 'app/shop/partials/cart.done.html',
        controller : [ '$scope', 'shippingCtrl', 'order', '$state', function($scope, shippingCtrl, order, $state) {
          $scope.id = order.id;
          $scope.order = order;
          $scope.shippingCtrl = shippingCtrl;
          $scope.cart = shippingCtrl.cart;
          $scope.shippingData = shippingCtrl.shippingData;

          $scope.showOrder = false;

          $scope.myhref = $state.href('shop.order.display', order, {'absolute': true});
          
          $scope.showDetails = function() {
            $scope.showOrder = true;
          };

        } ]
      }
    }
  })

  .state('shop.order.placed', {

    url : '/placed',

    data : {
      displayName : 'Вашата поръчка е приета'
    },
    
    views : {
      'cartContent' : {
        templateUrl : 'app/shop/partials/cart.done.html',
        controller : [ '$scope', 'shippingCtrl', 'order', '$state', function($scope, shippingCtrl, order, $state) {
          $scope.order = order;
          $scope.id = order.id;
          $scope.shippingCtrl = shippingCtrl;
          $scope.cart = shippingCtrl.cart;
          $scope.shippingData = shippingCtrl.shippingData;

          $scope.showOrder = false;

          $scope.myhref = $state.href('shop.order.display', order, {'absolute': true});

          $scope.showDetails = function() {
            $scope.showOrder = true;
          };

        } ]
      }
    }

  })

  ;// state chain end
} ]);
// the end

