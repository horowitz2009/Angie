angular.module('felt.shop', [
  'ui.router',
  'angularUtils.directives.uiBreadcrumbs'
])

  .config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      console.log("[ 10 shop.config]");
      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider
          
          .when('/shop/cart', ['$state', function ($state) {
            $state.go('shop.cart.edit');
          }])
          .when('/shop/cart/checkout', ['$state', function ($state) {
            $state.go('shop.cart.checkout');
          }]);
          
            
/*                .when('/shop/cart', ['$match', '$stateParams', 
            function ($match, $stateParams) {
              //if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
              //  $state.transitionTo(state, $match, false);
              //}
              console.log('match:');
              console.log($match);
            }]
          )*/

          // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state

    
      $stateProvider

        /////////////
        //  SHOP   //
        /////////////
        .state('shop', {

          abstract: true,

          url: '/shop',


          data: {
            breadcrumbProxy: 'shop.all'
          },

          resolve: {
            categories: ['ShopService',
              function (ShopService) {
                return ShopService.getCategories();
              }],
              
            allColors:  ['ShopService',
              function (ShopService) {
                return ShopService.getAllColors();
              }]
          },

          templateUrl: 'app/shop/partials/shop.html',
          controller: ['$scope', '$state', 'categories', 'utils', 'allColors', 'ShopService',
            function ($scope, $state, categories, utils, allColors, ShopService) {

              //TODO apply 'loading and then' approach
              $scope.categories = ShopService.getPublishedCategories();

              $scope.goToRandom = function () {
                var randId = utils.newRandomKey($scope.categories, "id", $state.params.categoryId);

                $state.go('shop.category', {categoryId: randId});
              };
              
              
              $scope.filters = [];
              
              $scope.categories.forEach(function(category) {
                
                $scope.filters[category.id] = new CategoryFilter(ShopService.extractOrigins(category.id),
                    ShopService.extractColors(category.id, allColors.colorGroups));
                
              });
              
            }]
        })

        ///////////////////////
        // SHOP > CATEGORIES //
        ///////////////////////
        .state('shop.all', {

          url: '',

          data: {
            displayName: 'Начало',
            title: 'Онлайн магазин за вълна и коприна'
          },

          views: {

            'filter': {
              templateUrl: 'app/shop/partials/filter.html'
            },

            'content': {
              templateUrl: 'app/shop/partials/categories.all.html'
            }
          }

        })

        ////////////////////////////////
        // SHOP > CATEGORY > PRODUCTS //
        ////////////////////////////////
        .state('shop.one', {

          url: '/{categoryId}',

          data: {
            displayName: '{{category.name}}' //{{category.name}}
          },


          resolve: {
            category: ['categories', '$stateParams', 'utils',
              function (categories, $stateParams, utils) {
                return utils.findById(categories, $stateParams.categoryId);
              }]
          },

          views: {
            'filter': {
              templateUrl: 'app/shop/partials/filter.html',
              controller: ['$scope', 'ShopService', 'category',
                  function($scope, ShopService, category) {
                    if (category) {
                      var catFilter = $scope.filters[category.id];
                      /*if (!catFilter) {
                        var newFilter = {};
                        newFilter.origins = ShopService.extractOrigins(category);
                        $scope.filters[category.id] = newFilter;
                        catFilter = newFilter;
                      }*/
                  
                      $scope.filter = catFilter;
                    }
                  }
              ]
            },

            'content': {
              templateUrl: 'app/shop/partials/categories.one.html',
              controller: ['$scope', 'category', 'allColors', 'ShopService',
                function ($scope, category, allColors, ShopService) {
                  $scope.category = category;
                  $scope.products = ShopService.getPublishedProducts(category.id);
                  
                  //UPDATE filter numbers
                  $scope.$watch('results', function(newValue, oldValue) {
                    
                    //recalcNumbers
                    var filterObj = $scope.filters[$scope.category.id];
                    var originFilter = filterObj.getSelectedOrigins();
                    var colorFilter = filterObj.getSelectedColors();
                    
                    var prc = ShopService.getPublishedProductsRS(category.id);
                    if (colorFilter.length > 0 && colorFilter.length < filterObj.colors.length) {
                      prc.where(function(product){
                        for (var i = 0; i < colorFilter.length; i++) {
                          if (product.colorGroups && product.colorGroups.indexOf(colorFilter[i]) >= 0) {
                            return true;
                          }
                        }
                        return false;
                      });
                    }                    
                    var newOrigins = ShopService.extractOrigins(category.id, prc.data());
                    
                    var pro = ShopService.getPublishedProductsRS(category.id);
                    if (originFilter.length > 0 && originFilter.length < filterObj.origins.length)
                      pro.where(function(product){
                        for (var i = 0; i < originFilter.length; i++) {
                          if (originFilter[i] === product.origin) {
                            return true;
                          }
                        }
                        return false;
                      });
                    var newColors = ShopService.extractColors(category.id, allColors.colorGroups, pro.data());
                      
                    filterObj.setOriginCounts(newOrigins);
                    filterObj.setColorCounts(newColors);
                    
                  });
                  
                //SEARCH FUNCTION USED TO FILTER DATA IN NG-REPEAT
                $scope.search = function (product) {
                  var filterObj = $scope.filters[$scope.category.id];
                  var originFilter = filterObj.getSelectedOrigins();
                  var colorFilter = filterObj.getSelectedColors();
                  
                  //check origin
                  var matchOrigin = false;
                  if (originFilter.length == 0 || originFilter.length == filterObj.origins.length) {
                    matchOrigin = true;
                  } else {
                    for (var i = 0; i < originFilter.length; i++) {
                      if (originFilter[i] === product.origin) {
                        matchOrigin = true;
                        break;
                      }
                    }
                  }

                  //check color
                  var matchColor = false;
                  if (matchOrigin) {
                    if (colorFilter.length == 0 || colorFilter.length == filterObj.colors.length) {
                      matchColor = true;
                    } else {
                      for (var i = 0; !matchColor && i < colorFilter.length; i++) {
                        if (product.colorGroups && product.colorGroups.indexOf(colorFilter[i])>=0) {
                          matchColor = true;
                          break;
                        }
                      }
                    }
                  }
                  
                  return matchColor;

                };

                  
                  
                  
                  
                  
                  
                }]

            }
          }

        })

        ///////////////////////////////
        // SHOP > Category > Product //
        ///////////////////////////////
        .state('shop.one.product', {

          url: '/:productId',

          data: {
            displayName: '{{product.name}}'
          },

          resolve: {
            product: ['category', '$stateParams', 'utils',
              function (category, $stateParams, utils) {
                return utils.findById(category.products, $stateParams.productId);
              }]
          },

          views: {
            'filter@shop': { template: '' },
            'content@shop': { template: '' },
            
            'content2@shop': {
              templateUrl: 'app/shop/partials/product.html',
              controller: ['$scope', 'product', 'Lightbox',
                function ($scope, product, Lightbox) {
                  $scope.product = product;
                  $scope.imageIndex = 0;
                  
                  $scope.changeImageIndex = function (index) {
                    $scope.imageIndex = index;
                  }
                  
                  $scope.openLightboxModal = function (index) {
                    Lightbox.openModal($scope.product.images, index);
                  };
                }]
            }
          }
        })

    }
  ]
)

;//end

function CategoryFilter(origins, colors) {
  this.origins = origins  
  this.colors = colors;
  return this;
}



CategoryFilter.prototype.getSelectedOrigins = function () {
  return this.getSelected(this.origins);
}

CategoryFilter.prototype.getSelectedColors = function () {
  return this.getSelected(this.colors);
}

CategoryFilter.prototype.setOriginCounts = function(newOrigins) {
  this.setCounts(this.origins, newOrigins);
}

CategoryFilter.prototype.setColorCounts = function(newColors) {
  this.setCounts(this.colors, newColors);
}

CategoryFilter.prototype.getSelected = function (arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].value) {
      res.push(arr[i].id ? arr[i].id : arr[i].name);
    }
  }
  return res;
}

CategoryFilter.prototype.setCounts = function(oldArr, newArr) {
  
  oldArr.forEach(function(obj) {
    var found = false;
    for (var i = 0; i < newArr.length; i++) {
      if (obj.id == newArr[i].id) {
        obj.cnt = newArr[i].cnt;
        found = true;
        break;
      }
    }
    if (!found)
      obj.cnt = 0;
  });
  
}



