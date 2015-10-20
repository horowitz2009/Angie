angular.module('backend', [

])

.config(['$stateProvider', function($stateProvider) {
  console.log("[  4 backend config...]");

  $stateProvider

    // ///////////
    // account  //
    // ///////////
    .state("backend", {
      abstract : true,

      url : "/backend",

      data : {
        breadcrumbProxy : 'backend.summary'
      },
  
      views : {
        'banner' : {},
        '' : {
          templateUrl : 'app/shop/partials/shop.html'
  
        }
      }
  
    })
  
    
    // //////////////////
    // account.summary //
    // //////////////////
    .state("backend.summary", {
      
      url : "",
      
      data : {
        displayName : 'Админ Панел'
      },
      
      views : {
        'content3@backend' : { //TODO CLEANUP!!!
          templateUrl : 'app/backend/partials/backend.summary.html',

          controller : ['$scope', '$rootScope', '$state', 'OrderService',
                        'Account', 'Session', '$timeout',
            function($scope, $rootScope, $state, OrderService, 
                     Account, Session, $timeout) {

              console.log("backend.summary controller...");

              $scope.account = Account;
              $scope.contactData = Account.contactData;

              $scope.orders = [];
              OrderService.getAllOrders().then(function(newOrders){
                $scope.$apply(function(){
                  var cntPending = 0;
                  for(var i = 0; i < newOrders.length; i++) {
                    if (newOrders[i].status === 'pending')
                      cntPending++;
                  }
                  $scope.cntPending = cntPending;
                  $scope.orders = newOrders;
                });
              });
              
              $scope.formatAddress = function(shippingData) {
                return shippingData.settlement.country;
              }
              
            } ]
        }//content3

      }//view
      ,
      onEnter: function() {
        console.log("Entered state backend.summary")
      }
      
      ,      resolve : {
        orders : function(OrderService) {
          return OrderService.getAllOrders();
        }
      },
      
    })//state
    
    
    // /////////////////////////
    // backend.summary.orders //
    // /////////////////////////
    .state("backend.summary.orders", {
      
      url : "/orders",
      
      data : {
        displayName : 'Поръчки'
      },
      resolve : {
        orders : function(OrderService) {
          return OrderService.getAllOrders();
        }
      },
      
      views : {
        'content3@backend' : {
          templateUrl : 'app/backend/partials/backend.orders.html',
          controller : [ '$scope', '$state', 'OrderService', function($scope, $state, OrderService) {
            
            $scope.selection = {
                ids: {}
            };

            $scope.orders = null;
            OrderService.getAllOrders().then(function(newOrders){
              $scope.$apply(function(){
                $scope.orders = newOrders;
              });
            });
            
            $scope.changeOrderStatus = function(newStatus) {
              var ids = $scope.selection.ids;
              console.log(ids);
              
              for (var id in ids) {
                if (ids[id]) {
                  console.log("id " + id + " is true");
                  OrderService.changeOrderStatus(id, newStatus);
                  updateOrderStatus($scope.orders, id, newStatus);
                }
              }
              
//              //refresh
//              OrderService.getAllOrders().then(function(newOrders){
//                $scope.$apply(function(){
//                  $scope.orders = newOrders;
//                });
//              });
              
            }
            
          } ]
        }//content3
      
      }//view
      ,
      onEnter: function() {
        console.log("Entered state backend.summary.orders")
      }
      
      
    })//state
    
    // ////////////////////////
    // backend.summary.order //
    // ////////////////////////
    .state('backend.summary.order', {

      abstract : true,

      url : '/order',

      params : {
        'id' : -1
      },

      data : {
        breadcrumbProxy : 'backend.summary.orders'
      },

//       resolve : {
//         order : [ '$stateParams', 'utils', 'OrderService', function($stateParams, utils, OrderService) {
//           // return utils.findById(categories, $stateParams.categoryId);
//           return OrderService.getOrder($stateParams['id']);
//         } ]
//       }


    })

    .state('backend.summary.order.display', {
      
      url : '/{id}',

      data : {
        displayName : "Поръчка #{{$stateParams['id']}}"
      },

      views : {
        
        'content3@backend' : {  
          template: ''
        },

        'content4@backend' : {
          templateUrl : 'app/backend/partials/backend.order.html',
          controller : [ '$scope', '$rootScope', '$stateParams', 'OrderService', '$state', 
                         function($scope, $rootScope, $stateParams, OrderService, $state) {
            
            $scope.id = $stateParams['id'];
            $scope.order = null;
            OrderService.getOrderAdmin($stateParams['id']).then(function(newOrder){
              
              OrderService.getAllOrderIds().then(function (orderIds) {
                $scope.nextId = -1;  
                $scope.prevId = -1;
                
                console.log(orderIds);
                for(var i = 0; i < orderIds.length; i++) {
                  if (orderIds[i] == $scope.id) {
                    if ( i > 0)
                      $scope.prevId = orderIds[i - 1];
                    if (i < orderIds.length - 1)
                      $scope.nextId = orderIds[i + 1];
                    
                    $scope.index = i + 1;
                    $scope.length = orderIds.length;
                    break;
                  }
                }

                //here I'm done
                $scope.$apply(function(){
                  if (newOrder && !angular.equals(newOrder, {})) 
                    $scope.order = new Order(newOrder);
                  else {
                    $scope.order = null;
                    $state.go('backend.summary');
                  }
                  $scope.id = newOrder.id;
                });

                //
              });
              
            });
            
            $scope.orderAgain = function(order) {
              $rootScope.$broadcast('order-again', order);
            }
            
          } ]
        }
      }
    })



} ])


;// end


function updateOrderStatus(orders, id, newStatus) {
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id == id) {
      orders[i].status = newStatus;
      break;
    }
  }
}
