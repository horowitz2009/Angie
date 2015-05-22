angular.module('felt.shop.cart')

.config(
    [
        '$stateProvider',
        function($stateProvider) {
          console.log("[  4 cart.router.config]");

          $stateProvider

          // /////////////////
          // SHOP > CART //
          // /////////////////
          .state('shop.cart', {

            abstract : true,

            url : '/cart',

            views : {
              'filter' : {
                template : ''
              },

              'content3' : {
                template : '<div ui-view="cartContent"></div>'
              }
            },

            data : {
              breadcrumbProxy : 'shop.cart.edit'
            }

          })

          .state('shop.cart.edit', {

            url : '',

            data : {
              displayName : 'Количка'
            },

            views : {
              'cartContent' : {
                templateUrl : 'app/shop/partials/cart.details.html',
                controller : [ '$scope', 'cart', 'CartService', function($scope, cart, CartService) {
                  if (!$scope.cart) {
                    console.log('adding cart to this scope');
                    $scope.cart = cart;
                    if (!cart.address) {
                      cart.address = {
                        country : "България"
                      };
                    }

                  }
                  
                  $scope.address = cart.address;
                  $scope.zipCity = cart.address.city;
                  
                  $scope.setZip = function (cart) {
                    //TODO
                    console.log($scope.zipCity);
                    $("#ModalZip").modal('hide');
                  }
                  
                  $scope.canShippingBeCalculated = function() {
                    var a = cart.address;
                    if (!a || !a.country)
                      return false;

                    if (a.country == 'България') {
                      if (!a.zipCode || !a.city)
                        return false;
                    }
                    
                    return true;
                  }
                  
                  
                  
                } ]
              }
            }

          })

          .state(
              'shop.cart.checkout',
              {

                url : '/checkout',

                data : {
                  displayName : 'Към касата'
                },

                views : {
                  'cartContent' : {
                    templateUrl : 'app/shop/partials/cart.checkout.html',
                    controller : [ '$scope', '$rootScope', '$state', 'cart', 'CartService', 'CART_EVENTS', '$timeout',
                        function($scope, $rootScope, $state, cart, CartService, CART_EVENTS, $timeout) {
                          if (!$scope.cart) {
                            console.log('adding cart to this scope');
                            $scope.cart = cart;
                          }
                          if (!$scope.cart.address) {
                            $scope.cart.address = {
                              country : "България"
                            };
                            $scope.cart.address.showOptions = true;
                          }
                          if (cart.count == 0) {
                            //cart is empty
                            $state.go('shop.cart.edit');
                            return;
                          }
                          

                          // ///////////////////////
                          // isXXXXXXDataOK
                          // ///////////////////////
                          $scope.isContactDataOK = function() {
                            var a = cart.address;
                            if (!a || !a.firstName || !a.lastName || !a.phone)
                              return false;

                            return true;
                          }

                          $scope.isAddressDataOK = function() {
                            return CartService.isAddressDataOK();
                          }

                          $scope.isPaymentDataOK = function() {
                            // TODO nothing to check yet
                            return true;
                          }
                          
                          $scope.showFullAddress = function() {
                            var str = '';
                            if ($scope.isContactDataOK() && $scope.isAddressDataOK()) {
                              var a = $scope.cart.address;
                              str = a.country + '<br>';
                              if (a.country == 'България') {
                                if (a.addressOption == "ekont") {
                                  str += ('Do ofis na Ekont: ' + a.ekontOffice);
                                } else if (a.addressOption == "speedy") {
                                  str += ('Do ofis na Speedy: ' + a.speedyOffice);
                                } else {
                                  str += (a.city + ', ' + a.zipCode + '<br>');
                                  str += (a.streetAddress1 + '<br>');
                                  if (a.streetAddress2)
                                    str += ('(<small>' + a.streetAddress2 + ')</small><br>');
                                }
                              }
                            }

                            return str;
                          }

                          // ////////////////////////
                          // setEditXXXXXXData
                          // ////////////////////////
                          $scope.setEditContactData = function(val) {
                            $scope.editContactData = val;
                          }

                          $scope.setEditAddressData = function(val) {
                            $scope.editAddressData = val;
                          }

                          $scope.setEditPaymentData = function(val) {
                            $scope.editPaymentData = val;
                          }

                          // //////////////////////////
                          // whichIsNext
                          // //////////////////////////
                          $scope.whichIsNext = function(startingStep) {
                            var step = startingStep;

                            if (step == 1) {
                              if ($scope.isContactDataOK())
                                step = 2;
                            }

                            if (step == 2) {
                              if ($scope.isAddressDataOK())
                                step = 3;
                            }

                            if (step == 3) {
                              if ($scope.isPaymentDataOK())
                                step = 4;
                            }

                            return step;
                          }

                          $scope.gotoNext = function(startingStep) {
                            console.log("GOTO NEXT " + startingStep);
                            var step = $scope.whichIsNext(startingStep);
                            $scope.editContactData = !$scope.isContactDataOK();
                            $scope.editAddressData = !$scope.isAddressDataOK();
                            $scope.editPaymentData = !$scope.isPaymentDataOK();
                            if (step == 1) {
                              $('#collapseContactData').collapse("show");
                              // $timeout(function() {
                              // $('body').scrollTo('#contactData', 300,
                              // {offset:-100});
                              // }, 10);

                              if ($scope.editAddressData) {
                                $('#collapseAddressData').collapse("hide");
                              }
                              if ($scope.editPaymentData) {
                                $('#collapsePaymentData').collapse("hide");
                              }
                            }

                            if (step == 2) {
                              $('#collapseAddressData').collapse("show");
                              // $timeout(function() {
                              // $('body').scrollTo('#addressData', 300,
                              // {offset:-100});
                              // }, 10);
                              if ($scope.editPaymentData) {
                                $('#collapsePaymentData').collapse("hide");
                              }
                            }

                            if (step == 3) {
                              $('#collapsePaymentData').collapse("show");
                              // $timeout(function() {
                              // $('body').scrollTo('#paymentData', 300,
                              // {offset:-100});
                              // }, 10);
                            }
                            if (step == 4) {
                              // TADAAAAAA We're ready!!!

                              // $timeout(function() {
                              // $('body').scrollTo('#paymentData', 300,
                              // {offset:-100});
                              // }, 10);
                              $timeout(function() {
                                $('body').scrollTo('#contactData', 300, {
                                  offset : -100
                                });
                              }, 10);

                            }

                          }

                          // //////////////////////////
                          // saveContactData
                          // //////////////////////////
                          $scope.saveContactData = function(el) {
                            console.log(cart);
                            $rootScope.$broadcast(CART_EVENTS.addressChanged, cart);
                            // TODO do i need this event?
                            CartService.recalcTotals();
                            $rootScope.$broadcast(CART_EVENTS.cartChanged, cart);

                            $scope.gotoNext(1);
                          }

                          // //////////////////////////
                          // saveAddress
                          // //////////////////////////
                          $scope.saveAddress = function(el) {
                            console.log(cart);
                            $rootScope.$broadcast(CART_EVENTS.addressChanged, cart);
                            // TODO do i need this event?
                            CartService.recalcTotals();
                            $rootScope.$broadcast(CART_EVENTS.cartChanged, cart);

                            $scope.gotoNext(2);
                          }

                          $scope.setWantInvoice = function(val) {
                            $scope.cart.address.wantInvoice = val;
                          }

                          $scope.showOptions = function(show) {
                            $scope.cart.address.showOptions = show;
                            if (show) {

                            } else {
                              $scope.cart.address.addressOption = "address";
                            }
                          }
                          
                          
                          $scope.submitOrder = function() {
                            //TODO
                          }

                          // //////////////////////////
                          // WATCHERS
                          // //////////////////////////
                          $scope.$watch('cart.address.addressOption', function(newValue, oldValue) {
                            console.log("addressOption is being watched:");
                            console.log(oldValue);
                            console.log(newValue);
                            /*
                             * if (newValue == "ekont") {
                             * $scope.cart.address.speedyOffice = ''; } else if
                             * (newValue == "speedy") {
                             * $scope.cart.address.ekontOffice = ''; } else if
                             * (newValue == "address") {
                             * $scope.cart.address.ekontOffice = '';
                             * $scope.cart.address.speedyOffice = ''; }
                             */
                          });
                          $scope.$watch('cart.address.country', function(newValue, oldValue) {
                            console.log("country is being watched:");
                            console.log(oldValue);
                            console.log(newValue);
                            if (newValue == "България") {
                              $scope.showOptions(true);
                            }

                            if (oldValue == "България") {
                              $scope.showOptions(false);
                            }

                          });

                          $scope.$watch('cart', function(newValue, oldValue) {
                            console.log("CART CHANGED");
                            console.log(oldValue);
                            console.log(newValue);

                            if ($scope.cart.address.country == "България") {
                              $scope.showOptions(true);
                            }

                            $scope.gotoNext(1);

                          });

                          $scope.$on("cart-loaded", function(event, oldCart, newCart) {
                            if (newCart.count == 0) {
                              //cart is empty
                              $state.go('shop.cart.edit');
                              return;
                            }
                            $scope.gotoNext(1);
                          });

                        } ]
                  }
                }

              })

          ;// state chain end
        } ]);

// the end

