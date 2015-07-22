// Make sure to include the `ui.router` module as a dependency
angular.module('felt', [

    'felt.shop',
    'felt.shop.cart',
    'felt.shop.orders',
    'felt.shop.service',
    'felt.color.service',
    'felt.shipping.service',
    
    'common.utils.service',
    'common.authentication',
    'home.account',
	  
    'ui.bootstrap',
    'ui.router',
    'angucomplete-alt',
    
    'ngAnimate'
])



.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    console.log("[ 59 app.config]");

            /////////////////////////////
            // Redirects and Otherwise //
            /////////////////////////////
            $urlRouterProvider.otherwise('/');


            //////////////////////////
            // State Configurations //
            //////////////////////////
            $stateProvider
                //////////
                // Home //
                //////////
                .state("home", {

                    // Use a url of "/" to set a state as the "index".
                    url: "/",

                    data: {
                      displayName: 'Добре дошли!'
                    },

                    views: {
                        'banner': {
                            templateUrl: 'app/home/partials/slider.html'
                        },

                        '': {

                        }

                    },
                    
                    onExit: function () {
                        $('.slider-v1').cycle('destroy');
                    }

                })

                
                //////////
                // My Account //
                //////////
                .state("myaccount", {

                    url: "/myaccount",

                    data: {
                      displayName: 'Моят акаунт'
                    },
                    
                    resolve: {
                      account : [ 'AccountService', 'Session', function(AccountService, Session) {
                        return AccountService.loadAccount(Session.userId);
                      } ]
                    },

                    views: {
                        'banner': {
                            
                        },

                        '': {
                          templateUrl: 'app/home/partials/myaccount.html',
                          controller : [ '$scope', 'AccountService', 'account', 'Session', function($scope, AccountService, account, Session) {
                            $scope.account = angular.copy(account);
                            $scope.account.contactData.email = Session.userId;
                            $scope.editPassword = false;
                            $scope.message = '';
                            $scope.saveAccount = function() {
                              $scope.message = '...';
                              console.log("Saving account: ");
                              console.log($scope.account);
                              AccountService.saveAccount($scope.account, function() {
                                console.log("good");
                                $scope.message = 'Профилът е записан успешно!';
                              },
                              
                              function() {
                                console.log("UH OH");
                                $scope.message = 'Грешка! Връзката със сървъра бе загубена! Опитайте отново!';
                              });
                            }
                          }]
                        }

                    },
                    
                    onExit: function () {
                        $('.slider-v1').cycle('destroy');
                    }

                })

                ///////////
                // About //
                ///////////

                .state('about', {
                    url: '/about',

                    data: {
                      displayName: 'За нас'
                    },
                    // Showing off how you could return a promise from templateProvider
                    templateProvider: ['$timeout',
                        function ($timeout) {
                            return $timeout(function () {
                                return '<p class="lead">UI-Router Resources</p><ul>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router/tree/master/sample">Source for this Sample</a></li>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router">Github Main Page</a></li>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' +
                                    '</ul>';
                            }, 300);
                        }]
                })
                
                
                
                
  }
])

.run(['$rootScope', '$state', '$stateParams', 'AuthService',
  function ($rootScope, $state, $stateParams, AuthService) {
    console.log("[333 21 app.run]");

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

//     // TRY LOGIN FROM REMEMBER ME
//     console.log("LOGIN FROM REMEMBER ME...");
//     AuthService.loginFromRememberMe(false).then(function(user) {
//       console.log("successfully logged through RememberMe service");
//     }, function() {
//       console.log("FAILED TO LOG through RememberMe service");
//     })
    


    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            console.log('state changed from ' + fromState.name + ' to ' + toState.name);

            $("html, body").animate({ scrollTop: 0 }, 200);
            
            /*
            console.log("fromState:");
            console.log(fromState);
            console.log("toState:");
            console.log(toState);
            console.log("fromParams:");
            console.log(fromParams);
            console.log("toParams:");
            console.log(toParams);
            console.log("EVENT:");
            console.log(event);
            */
        });


  }
])

.factory('Title', ['$rootScope', '$interpolate', function ($rootScope,   $interpolate) {
  console.log("[319 app.factory Title]");

        var factory = {};

        factory.getTitle = function () {
          var title = '';
          var currentState = $rootScope.$state.$current;
          var data = null;
          if (currentState.data) {
            if (currentState.data.title)
              data = currentState.data.title;
            else
              data = currentState.data.displayName;
            if (data) {
              var interpolationContext =  (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;
              title = $interpolate(data)(interpolationContext);
            }
          }
          return title;
        };
        

        return factory;

  }
])

.directive('pwCheck', function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      
      var me = attrs.ngModel;
      var matchTo = attrs.pwCheck;
      scope.$watchGroup([me, matchTo], function(value) {
        ctrl.$setValidity('pwmatch', value[0] === value[1] );
      });
      
    }
  }
})
   
.directive('updateTitle', ['$rootScope', '$timeout', 'Title',
  function($rootScope, $timeout, Title) {
    console.log("[348 app.directive updateTitle]");
    return {
      link: function(scope, element, attrs) {
        var listener = function(event, toState) {

          var title = attrs.prefix + ' ' + Title.getTitle();
            
          $timeout(function() {
            element.text(title);
          }, 0, false);
        };

        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }
])


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN CONTROLLER
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller('MainCtrl', ['$scope', '$rootScope', 'USER_ROLES', 'AuthService','AUTH_EVENTS',
                         'ShopService', 'maxVisibleElements',
                         'cart', 'CartService', 'CartPersistenceService', 'CART_EVENTS',
                         '$animate', '$timeout', '$interval',
                    function($scope, $rootScope, USER_ROLES, AuthService, AUTH_EVENTS, ShopService, maxVisibleElements, 
            		         cart, CartService, CartPersistenceService, CART_EVENTS, 
            		         $animate, $timeout, $interval) {
  
  console.log("[217 app.controller] MainCtrl");
  $scope.currentUser = 'guest';
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
  
  $scope.getUsername = function() {
    return $scope.currentUser;
  }
  
  $scope.setCurrentUser = function(user) {
    //MAY BE NOT DEPRECATED
    console.log('MAY BE NOT DEPRECATED');
    var oldUsername = $scope.getUsername();
    $scope.currentUser = user == null ? 'guest' : user.email;
    var newUsername = $scope.getUsername();
    console.log("SET CURRENT USER: " + newUsername);
    $rootScope.$broadcast("user-changed", oldUsername, newUsername);
  };
  
  $scope.logout = function (logoutAll) {
	  console.log("LOGOUT CLICKED");
	  AuthService.logout(logoutAll).always(function (user) {
		  $scope.setCurrentUser('guest');
		  $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
	  });
  };

  $scope.isLoginPage = false;
  $scope.cartEvents = null;
  
  $scope.wireCartEvents = function() {
    console.log("wiring cart events...");
    //wire cart persistence
    $scope.cartEvents = $scope.$on(CART_EVENTS.cartChanged, function(event, args) {
      
      if (saveCartPromise) {
        $timeout.cancel(saveCartPromise);  
      }
      
      saveCartPromise = $timeout(function() {
        console.log("SAVING CART...")
        CartPersistenceService.saveCart(AuthService.getUsername());
      }, 1000);
      
    });
    return $scope.cartEvents;
  }
  
  $scope.loadCart = function(oldUsername, newUsername) {
    console.log("LOADING CART " + oldUsername + " -> " + newUsername + "   - " + AuthService.getUsername());
    var oldCart = angular.copy($scope.cart);
    CartPersistenceService.loadCart(AuthService.getUsername()).then(function(){
      if($scope.cartEvents != null) {
        console.log("................................................................WIRING...");
        $scope.cartEvents();
        console.log("................................................................WIRING...");
        $scope.wireCartEvents();
    } else {
      $scope.wireCartEvents();
    }


    }).then(function() {
      //newCart is a copy!!!
      console.log("THIS IS IT. 000000000000000000000000000000000000000000000000000");
      console.log("OLD cart");
      console.log(oldCart);
      console.log("NEW cart");
      newCart = $scope.cart;
      console.log(newCart);
      $rootScope.$broadcast("cart-loaded", oldCart, $scope.cart);

      if (isEmpty(oldCart)) {
         //no problem for all situations
      } else {
         if(isEmpty(newCart)) {
           //copy oldCart to newCart. remove oldCart from DB
           CartService.mergeCarts(oldCart, newCart);
         } else {
           if (!angular.equals(oldCart, newCart)) {
             //STRATEGY 'USE NEWEST'
             //means although user has a cart as logged, the current and newest cart as guest will be used
             angular.copy(oldCart, $scope.cart);             
           }
           if (oldUsername == "guest" && newUsername != "guest") {
             //transfer the cart from guest to logged
             CartPersistenceService.transferCart(oldUsername, newUsername);
           } else {
             CartService.resetCart();
           } 
         }
       }
      
      //1. if different and both are not empty
      //have to choose
      
      //2. if different and old is empty guest, new is user and not empty
      //no problem - load new and do nothing
      
      //3. if different and old is empty user, new is guest and not empty - should be not possible
      
      //4. if different and old is full user, new is guest
      // -> remove the cart
      
      //5. if different, old is full guest, new empty user
      // -> copy old cart to new cart and remove guest cart
      
      console.log("oldCart isEmpty: " + isEmpty(oldCart));
      console.log("newCart isEmpty: " + isEmpty(newCart));
      console.log("===============================================================");
      
      
    }).then(function(){
      $scope.$apply();
    });

    
    
    
    
  }

  //HMM
//  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
//    if (args.email) {
//      $scope.loadCart('guest', args.email);
//      
//    }
//  });

  // TRY LOGIN FROM REMEMBER ME
  console.log("LOGIN FROM REMEMBER ME...");
  //AuthService.loginFromRememberMe(false);
  
  AuthService.loginFromRememberMe(true).then(function(user) {
    if (user) {
      console.log("Logged by RememberMe...");
      $scope.setCurrentUser(user);
    } else {
      console.log("No valid token found...");
      $scope.setCurrentUser(null);
    }
    
  }, function() {
    console.log("Failed to login by RememberMe...");
    $scope.setCurrentUser(null);
  })
  
  .always(function() {
    $('#userMenu').removeClass('hide');
    $scope.$apply();
  });
  
  
  
  $scope.$on("user-changed", function(event, oldUsername, newUsername) {
    console.log("user changed:");
    console.log("old username: " + oldUsername);
    console.log("new username: " + newUsername);
    
    var oldCart2 = angular.copy($scope.cart);
    
    var savePromise = null;
    if (cart.initial) {
      cart.initial = false;
      //skip first save
    } else {
      var savePromise = CartPersistenceService.saveCart(oldUsername);
    }
    
    if (savePromise)
      savePromise.always(function() {
        $scope.loadCart(oldUsername, newUsername);//load the cart after saving the previous is done
        
      });
    else 
      $scope.loadCart(oldUsername, newUsername);//load cart. no cart is being saved
    
  });
  
  
  
  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
    console.log("login success caught");
    $scope.setCurrentUser(args);
  });

  var subTotalPromise = null;
  var addToCartPromise = null;
  var saveCartPromise = null;

  $scope.cart = cart;

  ShopService.getCategories().then(function(data) {
    console.log("[207 app.MainCtrl] getCategories");
    var categories = data;
    //console.log("Categories:");
    //console.log(categories);
    $scope.catMenuItems = ShopService.extractCatMenuItems(categories);
    console.log("[212 app.MainCtrl] extractCatMenuItems");

  });

  $scope.gridview = function() {
    $scope.productView = '';
    $scope.gridView = 'sel';
    $scope.listView = '';
  }

  $scope.listview = function() {
    $scope.productView = 'list-view';
    $scope.gridView = '';
    $scope.listView = 'sel';
  }

  $scope.gridview();

  $scope.flashIt = function(product) {
    if ($scope.cartPromise) {
        $animate.cancel($scope.cartPromise);
      }

      $timeout(function() {
        $scope.cartPromise = $animate.addClass($('#btn-'
            + product.fullId), "btn2-activated");
        $scope.cartPromise.then(function() {
            $('#btn-' + product.fullId).removeClass("btn2-activated");
        });
      }, 1);

  }
  
  $scope.addToCart = function(product, quantity) {
    $scope.flashIt(product);
    CartService.addItem(product, quantity);
  }

  $scope.removeFromCart = function(id) {
    CartService.removeItem(id);
  }

  $scope.recalcCart = function() {
    CartService.recalcTotals();
    //console.log("cart recalculated");
  }

  $scope.$watch('cart.subTotal', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      console.log("SUBTOTAL");
      if (subTotalPromise) {
        $animate.cancel(subTotalPromise);
      }

      $timeout(function() {
        subTotalPromise = $animate.addClass($('.cart111'),
            "flashing");
        subTotalPromise.then(function() {
          $('.cart111').removeClass("flashing");
        });
      }, 1);

    }
  });
  

  //HAS FOCUS FEATURE OFF ////////////////
  
  $scope.hasFocus = false;


  //   $interval(function() {
  //     $scope.hasFocus = document.hasFocus();
  //   }, 333);

  ////////////////////////////////////////  

}])
    
    







; //the end


function isEmpty(cart) {
  return  cart == null || (cart.items && cart.items.length == 0);  
}
