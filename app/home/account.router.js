angular.module('home.account')

.config(['$stateProvider', function($stateProvider) {
  console.log("[  7 home.account config...]");

  $stateProvider

    // ///////////
    // account  //
    // ///////////
    .state("account", {
      abstract : true,

      url : "/account",

      data : {
        breadcrumbProxy : 'account.summary'
      },
  
      views : {
        'banner' : {},
        '' : {
          templateUrl : 'app/shop/partials/shop.html'
  
        }
      }
  
    })
  
    // //////////////
    // account.man //
    // //////////////
    .state("account.man", {
      
      abstract : true,
      
      url : "",
      
      data : {
        breadcrumbProxy : 'account.summary'
      },
      
      resolve : {
        zipCodes : [ 'ShippingService', function(ShippingService) {
          return ShippingService.getZipCodes();
        } ],
        
        zipCodesExceptions : [ 'ShippingService', function(ShippingService) {
          return ShippingService.getZipCodesExceptions();
        } ],
        
        speedyTables : [ 'ShippingService', function(ShippingService) {
          return ShippingService.getSpeedyTables();
        } ],
        
        ekontTables : [ 'ShippingService', function(ShippingService) {
          return ShippingService.getEkontTables();
        } ],
        speedyOffices : [ 'ShippingService', function(ShippingService) {
          return ShippingService.getAllSpeedyOffices();
        } ],
        
        ekontOffices : [ 'ShippingService', function(ShippingService) {
          return ShippingService.getAllEkontOffices();
        } ]
      }//resolve
      
    })
    
    // ///////////////////
    // account.man.edit //
    // ///////////////////
    .state("account.man.edit", {
  
      url : "/edit",
  
      data : {
        displayName : 'Редактиране'
      },
  
      views : {
        'content3@account' : {
          templateUrl : 'app/home/partials/myaccount.html',
          controller : ['$scope', '$rootScope', '$state', 'AuthService', 'ShippingFactory', 'ShippingService',
              'AccountService', 'Account', 'Session', '$timeout',
              function($scope, $rootScope, $state, AuthService, ShippingFactory, ShippingService,
                  AccountService, Account, Session, $timeout) {

                console.log("account.edit controller...");

                $scope.headingLabel = "Моят акаунт";
                $scope.newPasswordLabel = "Нова парола";
                $scope.newPasswordAgainLabel = "Нова парола отново";

                if (AuthService.isGuest()) {
                  $state.go('home');
                  return;
                } else {
                  $scope.shippingCtrl = ShippingFactory.getInstance('account.edit', Account.shippingData);
                  $scope.shippingCtrl.factory(ShippingService, $rootScope);
                  $scope.shippingData = $scope.shippingCtrl.shippingData;

                  $scope.account = Account;
                  $scope.contactData = Account.contactData;
                  $scope.oldUsername = $scope.account.contactData.email;

                  // only those functions that mess with external
                  // services need to be wrapped
                  $scope.setZipCodeAndCity = function(result) {
                    $scope.shippingCtrl.setZipCodeAndCity(result);
                  }

                  $scope.setZipCodeAndCity1 = function(result) {
                    $scope.shippingCtrl.setZipCodeAndCity(result);
                    if (result) {
                      var input = $('#city2'); // TODO perhaps class
                                                // is better than id
                      input.val($scope.shippingData.getCityPretty());
                      input.change();
                    }
                  }

                  $scope.customLookup = function(str, data) {
                    return $scope.shippingCtrl.customLookup(str, data);
                  }

                  $scope.setOffice = function(result, courier) {
                    $scope.shippingCtrl.setOffice(result, courier);
                  }

                  $scope.lookupOffices = function(str, courier) {
                    return $scope.shippingCtrl.lookupOffices(str, courier);
                  }

                  $scope.setWantInvoice = function(val) {
                    $scope.shippingData.wantInvoice = val;
                  }

                  $scope.$on("settlement-changed", function(event, shippingData) {
                    $scope.shippingCtrl.recalcOptions(null, shippingData);
                    $scope.shippingCtrl.updateOffices(shippingData);
                  });

                  $scope.$watch('shippingData.settlement.country', function(newValue, oldValue) {
                    console.log("account.edit country changed from " + oldValue + " to " + newValue);
                    if (oldValue !== newValue) {
                      $scope.shippingData.clearAddress();
                      var input = $('#city2');
                      input.val($scope.shippingData.getCityPretty());
                      input.change();
                      input = $('#zipCode2');
                      input.val($scope.shippingData.zipCode);
                      input.change();
                      $scope.shippingCtrl.recalcOptions(null, $scope.shippingData);
                    }
                  });

                  $scope.$on("user-changed", function(event, oldUsername, newUsername) {
                    if (newUsername === 'guest') {
                      $scope.shippingCtrl.reset();
                    }
                    $scope.oldUsername = newUsername;
                  });

                  $scope.account.contactData.email = Session.userId;
                  $scope.editPassword = false;
                  $scope.setEditPassword = function(value) {
                    $scope.editPassword = value;
                  }

                  $scope.message = '';

                  $scope.saveAccount = function() {
                    $scope.message = '...';
                    console.log("Saving account: ");
                    console.log($scope.account);
                    AccountService.saveAccount($scope.account, function() {
                      console.log("good");

                      if ($scope.contactData.oldPassword) {
                        $scope.contactData.oldPassword = null;
                        $scope.contactData.newPassword1 = null;
                        $scope.contactData.newPassword2 = null;
                        $scope.editPassword = false;
                        $('#changePassButton').show();
                      }

                      if ($scope.account.getEmail() !== Session.userId) {
                        Session.userId = $scope.account.getEmail(); 
                        $scope.setCurrentUser($scope.account.contactData);
                      }
                      $rootScope.$broadcast("account-changed", null, $scope.account);

                      $scope.message = 'Акаунтът е записан успешно!';
                      $scope.$apply();
                      // TODO after 1-2 seconds hide the passwords and
                      // animate scroll up

                      // TODO timeout 30sec and remove the message
                      $timeout(function() {
                        $scope.message = '';
                        $state.go('account.summary');
                        $scope.$apply();
                      }, 2000);
                    },

                    function(resp) {
                      if (resp.status === 401) {
                        console.log("UH OH 401");
                        $scope.message = 'Невярна парола! Моля въведете коректно старата си парола!';
                      } else if (resp.status === 409) {
                          console.log("UH OH 409");
                          $scope.message = 'Проблем! Открихме профил с имейл ' + $scope.account.getEmail() + '. Въведете друг имейл!';
                      } else {
                        console.log("UH OH " + resp.status);
                        $scope.message = 'Грешка! Връзката със сървъра бе загубена! Опитайте отново!';
                      }
                      $scope.$apply();
                    });
                  }

                  $scope.shippingCtrl.recalcOptions(null, $scope.shippingData);

                }
              } ]
            }//content3
  
          }//view
  
    })//state

    // //////////////////
    // account.man.new //
    // //////////////////
    .state("account.man.new", {
  
      url : "/new",

      data : {
        displayName : 'Регистрация на акаунт'
      },

      views : {
        'content3@account' : {
          templateUrl : 'app/home/partials/myaccount.html',

          controller : [
              '$scope',
              '$rootScope',
              '$state',
              'AuthService',
              'ShippingFactory',
              'CartService',
              'cart',
              'AuthService',
              'ShippingService',
              'AccountService',
              'Account',
              'Session',
              '$timeout',
              function($scope, $rootScope, $state, AuthService, ShippingFactory, CartService, cart,
                  AuthService, ShippingService, AccountService, Account, Session, $timeout) {

                console.log("account.edit controller...");

                // 1
                $scope.newAccount = true;
                $scope.headingLabel = "Регистрация на акаунт";
                $scope.newPasswordLabel = "Парола";
                $scope.newPasswordAgainLabel = "Парола отново";

                manageAccount(cart, Account);

                $scope.shippingCtrl = ShippingFactory.getInstance('account.edit', Account.shippingData);
                $scope.shippingCtrl.factory(ShippingService, $rootScope);
                $scope.shippingData = $scope.shippingCtrl.shippingData;

                $scope.account = Account;
                $scope.contactData = Account.contactData;

                // only those functions that mess with external
                // services need to be wrapped
                $scope.setZipCodeAndCity = function(result) {
                  $scope.shippingCtrl.setZipCodeAndCity(result);
                }

                $scope.setZipCodeAndCity1 = function(result) {
                  $scope.shippingCtrl.setZipCodeAndCity(result);
                  if (result) {
                    var input = $('#city2'); // TODO perhaps class is
                                              // better than id
                    input.val($scope.shippingData.getCityPretty());
                  }
                }

                $scope.customLookup = function(str, data) {
                  return $scope.shippingCtrl.customLookup(str, data);
                }

                $scope.setOffice = function(result, courier) {
                  $scope.shippingCtrl.setOffice(result, courier);
                }

                $scope.lookupOffices = function(str, courier) {
                  return $scope.shippingCtrl.lookupOffices(str, courier);
                }

                $scope.setWantInvoice = function(val) {
                  $scope.shippingData.wantInvoice = val;
                }

                $scope.$on("settlement-changed", function(event, shippingData) {
                  $scope.shippingCtrl.recalcOptions(null, shippingData);
                  $scope.shippingCtrl.updateOffices(shippingData);
                });

                $scope.$watch('shippingData.settlement.country', function(newValue, oldValue) {
                  console.log("account.edit country changed from " + oldValue + " to " + newValue);
                  if (oldValue !== newValue) {
                    $scope.shippingData.clearAddress();
                    var input = $('#city2');
                    input.val($scope.shippingData.getCityPretty());
                    input = $('#zipCode2');
                    input.val($scope.shippingData.zipCode);
                    $scope.shippingCtrl.recalcOptions(null, $scope.shippingData);
                  }
                });

                $scope.$on("user-changed", function(event, oldUsername, newUsername) {
                  if (newUsername === 'guest') {
                    $scope.shippingCtrl.reset();
                  }
                });

                // 1
                // $scope.account.contactData.email = Session.userId;
                $scope.editPassword = true;
                $scope.setEditPassword = function(value) {
                  $scope.editPassword = value;
                }

                $scope.message = '';

                $scope.saveAccount = function() {
                  $scope.message = '...';
                  console.log("Saving account: ");
                  console.log($scope.account);
                  AccountService.saveNewAccount($scope.account, function() {
                    console.log("new account saved");

                    $state.go('home');// TODO create new stage
                                      // 'account.welcome'

                    AuthService.login({
                      email : $scope.account.contactData.email,
                      password : $scope.account.contactData.newPassword1,
                      rememberme : true
                    });

                    // $rootScope.$broadcast("account-changed", null,
                    // $scope.account);

                    $scope.message = 'Акаунтът е записан успешно!';
                    $scope.$apply();
                    // TODO after 1-2 seconds hide the passwords and
                    // animate scroll up

                    // TODO timeout 30sec and remove the message
                    $timeout(function() {
                      $scope.message = '';
                      $scope.$apply();
                    }, 10000);
                  },

                  function(resp) {
                    if (resp.status === 401) {
                      console.log("UH OH");
                      $scope.message = 'Невярна парола! Моля въведете коректно старата си парола!';
                    } else {
                      console.log("UH OH");
                      $scope.message = 'Грешка! Връзката със сървъра бе загубена! Опитайте отново!';
                    }
                    $scope.$apply();
                  });

                  $scope.shippingCtrl.recalcOptions(null, $scope.shippingData);

                }
              } ]
        }//content3

      }//view

    })//state
    
    // //////////////////
    // account.summary //
    // //////////////////
    .state("account.summary", {
      
      url : "",
      
      data : {
        displayName : 'Моят акаунт'
      },
      
      views : {
        'content3@account' : { //TODO CLEANUP!!!
          templateUrl : 'app/home/partials/account.summary.html',

          controller : ['$scope', '$rootScope', '$state', 'OrderService',
                        'Account', 'Session', '$timeout',
            function($scope, $rootScope, $state, OrderService, 
                     Account, Session, $timeout) {

              console.log("account.summary controller...");

              $scope.account = Account;
              $scope.contactData = Account.contactData;

              $scope.orders = [];
              OrderService.getAllUserOrders().then(function(newOrders){
                $scope.$apply(function(){
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
        console.log("Entered state account.summary")
      }
      
      ,      resolve : {
        orders : function(OrderService) {
          return OrderService.getAllUserOrders();
        }
      },
      
    })//state
    
    
    // /////////////////////////
    // account.summary.orders //
    // /////////////////////////
    .state("account.summary.orders", {
      
      url : "/orders",
      
      data : {
        displayName : 'Поръчки'
      },
      resolve : {
        orders : function(OrderService) {
          return OrderService.getAllUserOrders();
        }
      },
      
      views : {
        'content3@account' : {
          templateUrl : 'app/home/partials/account.orders.html',
          controller : [ '$scope', '$state', 'OrderService', function($scope, $state, OrderService) {
            
            $scope.orders = null;
            OrderService.getAllUserOrders().then(function(newOrders){
              $scope.$apply(function(){
                $scope.orders = newOrders;
              });
            });
            
            
            
          } ]
        }//content3
      
      }//view
      ,
      onEnter: function() {
        console.log("Entered state account.summary.orders")
      }
      
      
    })//state
    
    // ////////////////////////
    // account.summary.order //
    // ////////////////////////
    .state('account.summary.order', {

      abstract : true,

      url : '/order',

      params : {
        'id' : -1
      },

      data : {
        breadcrumbProxy : 'account.summary.orders'
      },

//       resolve : {
//         order : [ '$stateParams', 'utils', 'OrderService', function($stateParams, utils, OrderService) {
//           // return utils.findById(categories, $stateParams.categoryId);
//           return OrderService.getOrder($stateParams['id']);
//         } ]
//       }


    })

    .state('account.summary.order.display', {
      
      url : '/{id}',

      data : {
        displayName : "Поръчка #{{$stateParams['id']}}"
      },

      views : {
        
        'content3@account' : {  
          template: ''
        },

        'content4@account' : {
          templateUrl : 'app/home/partials/account.order.html',
          controller : [ '$scope', '$rootScope', '$stateParams', 'OrderService', '$state', 
                         function($scope, $rootScope, $stateParams, OrderService, $state) {
            
            
            $scope.id = $stateParams['id'];
            $scope.order = null;
            OrderService.getOrder($stateParams['id']).then(function(newOrder){
              
              OrderService.getAllUserOrderIds().then(function (orderIds) {
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
                    $state.go('account.summary');
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


.directive('formatAddress', ['$sce', function($sce) {

  function getCityPretty(s) {
    var res='';
    if (s.type) 
      res += s.type + ' ';
    if (s.city)  
      res += s.city;
    return res;
  }

  function getAddress(o) {
    var res = '';
    if (o.option.type === 'office') {
      res = 'До офис: ' + o.shippingData.office[o.option.courier];
    } else if (o.option.type === 'address') {
      res = o.shippingData.office['address'];
    }
    return res;
  }

  return {
    template: //'{{order.shippingData.settlement.country}}, {{city}}<br>' +
              '<span ng-bind-html="address"></span>',

      link : function(scope, elem, attrs) {
        if (scope.order.option.type == 'atelier') {
          //if (scope.order.status == 'pending')
            scope.address = 'Вземане от ателието';
          //else  
          //  scope.address = 'взето от ателието';
        } else {
          scope.address = scope.order.shippingData.settlement.country + ', ' +
            getCityPretty(scope.order.shippingData.settlement) + '<br>' + 
            getAddress(scope.order);
          
        }

        scope.address = $sce.trustAsHtml(scope.address);
        //scope.city = getCityPretty(scope.order.shippingData.settlement);
        //scope.address = getAddress(scope.order);
      }
      
  };
}])

;// end




