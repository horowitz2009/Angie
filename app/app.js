// Make sure to include the `ui.router` module as a dependency
angular.module('felt', [

    'felt.shop',
    'felt.shop.cart',
    'felt.shop.orders',
    'felt.shop.service',
    'felt.shop.inventory',
    'felt.shop.stockentries',
    'felt.color.service',
    'felt.shipping.service',
    
    'common.utils.service',
    'common.authentication',
    'home.account',
    'backend',
	  
    'ui.bootstrap',
    'ui.router',
    'angucomplete-alt',
    'pascalprecht.translate',
    
    'bootstrapLightbox',
    
    'ngAnimate'
])



.config(['$stateProvider', '$urlRouterProvider', 'LightboxProvider',
  function ($stateProvider, $urlRouterProvider, LightboxProvider) {
    console.log("[ 59 app.config]");
    
            LightboxProvider.fullScreenMode = true;

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
// .run(['$rootScope', '$state', '$stateParams', 'AuthService', 'ShopService',
//   function ($rootScope, $state, $stateParams, AuthService, ShopService) {
    console.log("[333 21 app.run]");
    
    
//     ShopService.loadCatalog().then(function(){
//       console.log("//////////////////////////////");
//       console.log("// CATALOG LOADED 0         //");
//       console.log("//////////////////////////////");
//     });


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

            console.log($rootScope.$state);
            
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


.config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en', {
    HEADLINE: 'Hello there, This is my awesome app!',
    INTRO_TEXT: 'And it has i18n support!',
    BUTTON_EN: 'English',
    BUTTON_BG: 'Bulgarian',
    
    Speedy: 'Speedy',
    Ekont: 'Ekont',
    
    awaiting_payment: 'Awaiting payment',
    pending: 'Pending',
    preparing: 'Preparing in progress',
    shipped: 'Shipped',
    awaiting_pick_up: 'Awaiting pick up',
    delivered: 'Delivered',
    canceled: 'Canceled',
    refunded: 'Refunded'
  })
  .translations('bg', {
    HEADLINE: 'Здрасти',
    INTRO_TEXT: 'Ихаа. има много езициии!',
    BUTTON_EN: 'Английски',
    BUTTON_BG: 'Български',
    ONLY_IN_BG: 'Само на български',
    
    Speedy: 'Спиди',
    Ekont: 'Еконт',

    awaiting_payment: 'Очаква плащане',
    pending: 'Обработва се',
    preparing: 'Приготвя се',
    shipped: 'Изпратена',
    awaiting_pick_up: 'Очаква вземане от ателието',
    picked_up: 'Взета от ателието',
    delivered: 'Доставена',
    canceled: 'Отказана',
    refunded: 'Плащането върнато'
    
  });
  $translateProvider.preferredLanguage('bg');
}])


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN CONTROLLER
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller('MainCtrl', ['$scope', '$state', '$rootScope', 'USER_ROLES', 'AuthService', 'AccountService', 'ShippingFactory',
                         'Account', 'AUTH_EVENTS', 'ShopService', 'InventoryService', 'StockEntries', 'maxVisibleElements',
                         'cart', 'CartService', 'CartPersistenceService', 'CART_EVENTS',
                         '$animate', '$timeout', '$interval', '$translate', '$window',
                    function($scope, $state, $rootScope, USER_ROLES, AuthService, AccountService, ShippingFactory,
                         Account, AUTH_EVENTS, ShopService, InventoryService, StockEntries, maxVisibleElements, 
            		         cart, CartService, CartPersistenceService, CART_EVENTS, 
            		         $animate, $timeout, $interval, $translate, $window) {
  
  $scope.isDebug = false;
  
  $scope.states = $state.get();
  
  console.log("[217 app.controller] MainCtrl");
  $scope.currentUser = 'guest';
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
  
  $scope.getUsername = function() {
    return $scope.currentUser;
  }
  
  $scope.setCurrentUser = function(user) {
    var oldUsername = $scope.getUsername();
    $scope.currentUser = user == null ? 'guest' : user.email;
    var newUsername = $scope.getUsername();
    console.log("SET CURRENT USER: " + newUsername);
    $rootScope.$broadcast("user-changed", oldUsername, newUsername);
  };
  
  $scope.logout = AuthService.logout;

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
    
    CartPersistenceService.loadCart(newUsername)
    
    .then(function(){
        if($scope.cartEvents != null) {
          $scope.cartEvents();
          $scope.wireCartEvents();
        } else {
          $scope.wireCartEvents();
        }
      })
      
    .then(function() {
        //newCart is a copy!!!
        console.log("THIS IS IT. 000000000000000000000000000000000000000000000000000");
        console.log("OLD cart");
        console.log(oldCart);
        console.log("NEW cart");
        newCart = $scope.cart;
        console.log(newCart);
        
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
              //login
              //transfer the cart from guest to logged
              
              //manageAccount($scope.cart, Account);

              CartPersistenceService.transferCart(oldUsername, newUsername);
            } 
          }
        }

        if (oldUsername != "guest" && newUsername == "guest") {
          //logout

          CartService.resetCart();//TODO might be obsolete
          ShippingFactory.resetAll();
        }

        manageAccount($scope.cart, Account);

        $rootScope.$broadcast("cart-loaded", oldCart, $scope.cart);
        
        console.log("===============================================================");
      })
    
    .then(function(){
        $scope.$apply();
      });

    
  }

  //LOGIN FROM REMEMBER ME
  console.log("LOGIN FROM REMEMBER ME...");
  AuthService.loginFromRememberMe(true).always(function() {
    $('#userMenu').removeClass('hide');
    $scope.$apply();
  });
  
  $scope.userChanged = function(oldUsername, newUsername) {
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
    
  }
  
  $scope.setLanguage = function(langKey) {
    $translate.use(langKey);
  }
  
  
  $scope.$on("user-changed", function(event, oldUsername, newUsername) {
    console.log("user changed:");
    console.log("old username: " + oldUsername);
    console.log("new username: " + newUsername);
    var accountPromise = null;

    $scope.isAdmin = false;
    
    if (!AuthService.isGuest()) {
      accountPromise = AccountService.loadAccount(newUsername);
      
      if (AuthService.isAuthorized('admin')) {
        console.log("ADMINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
        $scope.isAdmin = true;
      }

    } else {
      //IT IS GUEST
      Account.reset();
      //if ($rootScope.$state.current.name === 'account.edit' || $rootScope.$state.current.name === 'shop.order.placed') {
        $rootScope.$state.go('home');
      //}
    }
    
    if (accountPromise)
      accountPromise.always(function(){
        $scope.userChanged(oldUsername, newUsername);
      });
    else
      $scope.userChanged(oldUsername, newUsername);
    
  });
  
  
  
  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
    console.log("login success caught");
    $scope.setCurrentUser(args);
  });

  $scope.$on(AUTH_EVENTS.logoutSuccess, function(event, args) {
    console.log("logout success caught");
    $scope.setCurrentUser(null);
  });
  
  $scope.$on(AUTH_EVENTS.loginFailed, function(event, args) {
    console.log("login failed caught");
    $scope.setCurrentUser(null);
  });

  $scope.$on("account-changed", function(event, notused, account) {
    console.log("shop.cart.edit account-changed...");
    
    angular.copy(account.contactData, cart.contactData);
    account.shippingData.copyTo(cart.shippingData);
    
  });

  $scope.$on("address-changed", function(event, cart) {
    console.log("shop.cart.checkout address-changed...");
    
    if (!Account.contactData.firstName) {
      angular.copy(cart.contactData, Account.contactData);
    }
    if (!Account.shippingData.canShippingBeCalculated()) {
      cart.shippingData.copyTo(Account.shippingData);
    }
    
  });
  
  $scope.$on("order-again", function(event, order) {
    console.log("ORDER AGAIN " + order);
    //TODO check before dump the current cart
    
    //for now we just empty teh cart and fill it with order stuff
    CartService.emptyCart();
    angular.copy(order.items, cart.items);
    CartService.recalcTotals()
    //$rootScope.$broadcast("cart-loaded", null, cart);
    $rootScope.$broadcast("cart-changed", cart);
    $state.go("shop.cart.edit");
    
  });
  
  

  var subTotalPromise = null;
  var addToCartPromise = null;
  var saveCartPromise = null;

  $scope.cart = cart;
  
  
  ShopService.loadCatalog().then(function(){
    console.log("//////////////////////////////");
    console.log("// CATALOG LOADED 1         //");
    console.log("//////////////////////////////");
    
    $scope.catMenuItems = ShopService.extractCatMenuItems();
  });
  
  ShopService.getCategories().then(function(data) {
    console.log("[207 app.MainCtrl] getCategories");
    var categories = data;
    //console.log("Categories:");
    //console.log(categories);
    //$scope.catMenuItems = ShopService.extractCatMenuItems(categories);
    //console.log("[212 app.MainCtrl] extractCatMenuItems");

  });
  
  InventoryService.getPackagings().then(function(ps) {
    console.log("Packagings loaded");
    console.log(ps);
    InventoryService.getInventory();
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
            + product.categoryId + '-' + product.id), "btn2-activated");
        $scope.cartPromise.then(function() {
            $('#btn-' + product.categoryId + '-' + product.id).removeClass("btn2-activated");
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
  
  $scope.showSlider = false;
  
  $scope.toggleSlider = function() {
    
    $scope.showSlider= !$scope.showSlider;
  }
  


}])
    
    







; //the end


function isEmpty(cart) {
  return  cart == null || (cart.items && cart.items.length == 0);  
}

function manageAccount(cart, account) {
  if (hasContactData(account.contactData)) {
    //we have contactData //copy it to cart
    angular.copy(account.contactData, cart.contactData);
    account.shippingData.copyTo(cart.shippingData);
  } else {
    if (hasContactData(cart.contactData)) {
      angular.copy(cart.contactData, account.contactData);
      cart.shippingData.copyTo(account.shippingData);
    }
  }
}

function hasContactData(a) {
  return a && a.firstName && a.lastName && a.phone;
}


$(window).resize(function() {
  // This will execute whenever the window is resized
  //$(window).height(); // New height
  //$(window).width(); // New width
  console.log("HMM width : " + $(window).innerWidth());
  console.log("HMM height: " + $(window).innerHeight());
  
});
