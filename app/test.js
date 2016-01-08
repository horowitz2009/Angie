// Make sure to include the `ui.router` module as a dependency
angular.module('felt.test', [

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

.run(
    [ '$rootScope', '$state', '$stateParams', '$log', 'AuthService',
        function($rootScope, $state, $stateParams, $log, AuthService) {
          $log.debug("Run tests");
          console.log("Run tests");

          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;

          $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $log.debug('state changed from ' + fromState.name + ' to ' + toState.name);

            $log.debug($rootScope.$state);

          });

        } ])
        
        
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN CONTROLLER
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller('MainCtrl', ['$scope', '$state', '$rootScope', 'USER_ROLES', 'AuthService', 'AccountService', 'ShippingFactory',
                         'Account', 'AUTH_EVENTS', 'ShopService', 'InventoryService', 'StockEntries', 'maxVisibleElements',
                         'cart', 'CartService', 'CartPersistenceService', 'CART_EVENTS',
                         '$animate', '$timeout', '$interval', '$translate', '$window', '$log',
                    function($scope, $state, $rootScope, USER_ROLES, AuthService, AccountService, ShippingFactory,
                         Account, AUTH_EVENTS, ShopService, InventoryService, StockEntries, maxVisibleElements, 
                         cart, CartService, CartPersistenceService, CART_EVENTS, 
                         $animate, $timeout, $interval, $translate, $window, $log) {
  
  $log.info("MAIN CONTROLLER......................");
  
  ShopService.loadCatalog().then(function(){
    console.log("//////////////////////////////");
    console.log("// CATALOG LOADED           //");
    console.log("//////////////////////////////");
    
    $scope.catMenuItems = ShopService.extractCatMenuItems();
  });
  
  
  InventoryService.getPackagings().then(function(hmm) {
    
    $log.debug("Packagings loaded");
    $log.debug(hmm);
    
    InventoryService.getInventory();
    
    // GET
    StockEntries.get({ categoryId:"wool", productId: "yellow", packagingId: "p10"}).then(function(res) {
      
      // SUCCESS MEANS IT IS FOUND
      console.log("found it?");
      console.log(res);
      
      // MODIFY IT
      res.quantity = parseInt(res.quantity) + 100;
      res.min = 2;
      res.opt = 20;
      res.onHold = parseInt(res.onHold) + 1;
      if (res.quantity > 300) {
        
        // DELETE
        StockEntries.del(res);
      } else {
        // CHANGE
        StockEntries.change(res);
      } 

      //GET SOME - get all with categoryId: wool
      StockEntries.getSome({ categoryId:"wool"}).then(function(res){
          //success - empty array if nothing found
          console.log(res);
        }, function(res){
          //uh oh
          console.log("NOT FOUND OR WHAT!?")
          console.log(res);
        }); 
    }, function(res) {
      console.log("not found! inserting one...");
      
      // INSERT
      StockEntries.insert({ categoryId:"wool", productId: "yellow", packagingId: "p10", quantity: 15, min:3, opt:25, onHold: 0}).then(function(){
        StockEntries.getSome({ categoryId:"wool"}).then(function(res){
          console.log(res);
        });
      });
    });
    
  });
  
  
        

  

}])

; //end