angular.module('backend', [

])


.value(
        "ordersFilter",
        
        
        
        { 
          'user'    : '',
          'address' : '',
          'content' : '',
          'statuses': [
               //{'name':'awaiting_payment', 'value':false, 'icon':'fa-archive'},
               {'name':'pending', 'value':false, 'icon':'fa-clock-o'},
               {'name':'preparing', 'value':false, 'icon':'fa-archive'},
               {'name':'shipped', 'value':false, 'icon':'fa-truck'},
               {'name':'awaiting_pick_up', 'value':false, 'icon':'fa-check-square-o'},
               {'name':'picked_up', 'value':false, 'icon':'fa-check-square'},
               {'name':'delivered', 'value':false, 'icon':'fa-check-square'},
               {'name':'canceled', 'value':false, 'icon':'fa-times'}
               //,{'name':'refunded', 'value':false, 'icon':'fa-archive'}
               
        ]}
    )

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
        'banner' : { template: '' },
        '' : {
          templateUrl : 'app/backend/partials/adminPanel.html',
          controller: ['$scope', function($scope) {
            angular.element("#mainContainer").addClass("container-fluid").removeClass("container");

          }]
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
              
              
            } ]
        }//content3

      }//view
      ,
      onEnter: function() {
        //////console.log("-====================================================== ENTERED state backend.summary");
        //////console.log("found it " + $("#mainContainer"));
        
        //$("#mainContainer").removeClass("container").addClass("container-fluid");
      },
      
      onExit: function () {
        //////console.log("-====================================================== LEFT state backend.summary");
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
        'filter@backend': {
          templateUrl: 'app/backend/partials/filter.html',
          controller: ['$scope', 'ordersFilter',
              function($scope, ordersFilter) {
                $scope.filter = ordersFilter;
              }
          ]
        },

        'content3@backend': { template: '' },
        
        
        
        'content@backend' : {
          templateUrl : 'app/backend/partials/backend.orders.html',
          controller : [ '$scope', '$state', 'ordersFilter', 'OrderService', 'Address', function($scope, $state, ordersFilter, OrderService, Address) {
            
            $scope.selection = {
                ids: {}
            };
            
            $scope.clearSelection = function() {
              $scope.selection.ids = {};
            }

            $scope.statuses = ordersFilter.statuses;
            
            $scope.orders = [];
            
            OrderService.getAllOrders().then(function(newOrders){
              $scope.$apply(function(){
                $scope.orders = newOrders;
              });
            });
            
            $scope.changeOrderStatus = function(newStatus) {
              var ids = $scope.selection.ids;
              //console.log(ids);
              
              for (var id in ids) {
                if (ids[id]) {
                  console.log("id " + id + " is true");
                  OrderService.changeOrderStatus(id, newStatus);
                  updateOrderStatus($scope.orders, id, newStatus);
                }
              }
              
              //$scope.clearSelection();
              
//              //refresh
//              OrderService.getAllOrders().then(function(newOrders){
//                $scope.$apply(function(){
//                  $scope.orders = newOrders;
//                });
//              });
              
            }
            
            
            //SEARCH FUNCTION
            $scope.filterOrders = function (order) {
              
              //STATUS
              var statuses = [];
              ordersFilter.statuses.forEach(function(s){
                if (s.value)
                  statuses.push(s.name);
              });
              
              var ok = statuses.length == 0;
              for(var i = 0; i < statuses.length; i++) {
                if (statuses[i] === order.status) {
                  ok = true;
                  break;
                }
              }

              //USERDATA - firstName lastName email and phone
              if (ok && ordersFilter.user.length >= 2) {
                var cd = order.contactData;
                var name =   (cd.firstName + ' ' + cd.lastName + ' ' + cd.email + ' ' + cd.phone).toLowerCase();              
                var sf = ordersFilter.user.toLowerCase().split(" ");
                
                //try names
                for(var i = 0; ok && i < sf.length; i++)
                  ok = ok && (name.indexOf(sf[i]) >= 0);
              }
              
              //ADDRESS - order.shippingData
              if (ok && ordersFilter.address.length >= 2) {
               
                var address = Address.getAddressAsString(order).toLowerCase();              
                var sf = ordersFilter.address.toLowerCase().split(" ");
                
                //try address
                for(var i = 0; ok && i < sf.length; i++)
                  ok = ok && (address.indexOf(sf[i]) >= 0);
              }
              
              //CONTENT - product.name //USE comma separator, instead of space
              if (ok && ordersFilter.content.length >= 2) {
                
                var sf = ordersFilter.content.toLowerCase().split(",");
                
                /*
                var begin = sf.indexOf("'");
                if (begin >= 0) {
                    var ss = sf.substr(begin + 1);
                    var end = ss.indexOf("'");
                    if(end > 0)
                      ss = ss.substring(0, end);
                    console.log(ss);
                    content +=' ' + ss;
                    
                }*/
                                
                //try content
                for(var i = 0; ok && i < sf.length; i++) {
                  
                  //find sf[i] in order items
                  var found = false;
                  for(var j = 0; j < order.items.length; j++) {
                    var pname = order.items[j].product.name.toLowerCase();
                    if (pname.indexOf(sf[i]) >= 0) {
                      found = true;
                      break;
                    }
                  }                  
                  ok = ok && found;
                }
              }
              
              
              
              
              

              //REMOVE SELECTION IF NOT VISIBLE
              if (!ok) {
                var ids = $scope.selection.ids;
                
                for (var id in ids) {
                  if (id == order.id) {
                    ids[id] = false;
                    break;
                  }
                }

              }
              
              return ok;
            };


            
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

.factory('Address',
        [ '$translate', function($translate) {
          console.log("[340 Address]");
          var service = {};

          
          service.getCountry = function(sd) {
            return sd.settlement.country;
          }
          
          service.getCityPretty = function(sd) {
            var s = sd.settlement;
            var res='';
            if (s.type) 
              res += s.type + ' ';
            if (s.city)  
              res += s.city;
            return res;
          }
          
          service.getAddress = function(o) {
            var res = '';
            if (o.option.type === 'office') {
              res = 'До офис на ' + $translate.instant(o.option.courier) +": " + o.shippingData.office[o.option.courier];
            } else if(o.option.type === 'address') {
              res = o.shippingData.office['address'];
            } else if(o.option.type === 'atelier') {
              res = o.option.name;
            }
            return res;
          }
          
          service.getAddressAsString = function(o) {
            var res = service.getCountry(o.shippingData) + ", ";
            if (o.option.type != 'atelier') {
              res += service.getCityPretty(o.shippingData) + ", ";
            }
            res += service.getAddress(o);
            return res;
          }
          
          service.getAddressAsHTML = function(o) {
            if (o.option.type == 'atelier') {
              return 'Вземане от ателието';
            } else {
              var res = service.getCountry(o.shippingData);
              res += ", " + service.getCityPretty(o.shippingData);
              res += "<br>" + service.getAddress(o);
              return res;
            }
          }
          
          
          return service;
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
