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
              } ]
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
              breadcrumbProxy : 'shop.cart.edit'
            }

          })

          //////////////////////////////////////////////////
          // EDIT
          //////////////////////////////////////////////////
          .state('shop.cart.edit', {

            url : '',

            data : {
              displayName : 'Количка'
            },

            views : {
              'cartContent' : {
                templateUrl : 'app/shop/partials/cart.details.html',
                controller : [ '$scope', '$rootScope', 'ShippingService', 'ShippingFactory', 'cart',
                               function($scope, $rootScope, ShippingService, ShippingFactory, cart) {
                  
                  console.log("shop.cart.edit controller...");
                  $scope.shippingCtrl = ShippingFactory.getInstance('shop.cart.edit');
                  $scope.shippingCtrl.factory(ShippingService, $rootScope);
                  $scope.shippingData = $scope.shippingCtrl.shippingData;
                  $scope.cart = cart;

                  //only those functions that mess with external services need to be wrapped
                  $scope.setZipCodeAndCity = function(result) {
                    $scope.shippingCtrl.setZipCodeAndCity(result);
                  }
                  
                  $scope.customLookup = function(str, data) {
                    return $scope.shippingCtrl.customLookup(str, data);
                  }
                  
                  $scope.submitSettlement = function () {
                    console.log("submitSettlement...");
                    if ($scope.shippingData.selectedOption) {
                      angular.copy($scope.shippingData.settlement, cart.shippingData.settlement);
                      cart.shippingData.selectedOption = $scope.shippingData.selectedOption;
                      $scope.shippingCtrl.recalcOptions(cart, cart.shippingData);
                      $scope.shippingCtrl.updateOffices(cart.shippingData);
                      $rootScope.$broadcast('cart-changed', cart);
                    }  
                    
                    $("#ModalZip").modal('hide');
                  }

                  
                  $scope.$on("settlement-changed", function(event, shippingData) {
                    $scope.shippingCtrl.recalcOptions(cart, shippingData);
                  });
                  
                  $scope.$on("cart-loaded", function(event, oldCart, newCart) {
                    console.log("shop.cart.edit cart-loaded...");
                    $scope.shippingCtrl.recalcOptions(newCart, newCart.shippingData);
                    if (!$scope.shippingCtrl.shippingData.settlement.city) {//TODO improve it
                      $scope.shippingCtrl.setShippingData(newCart.shippingData);
                    }
                  });
                  
                  $scope.$on("user-changed", function(event, oldUsername, newUsername) {
                    console.log("shop.cart.edit user-changed...");
                    if (oldUsername !== "guest" && newUsername === "guest") {
                      $scope.shippingCtrl.reset();
                    }
                  });
                  
                  $scope.$on("cart-changed", function(event, cart) {
                    console.log("shop.cart.edit cart-changed...");
                    console.log(cart);
                    $scope.shippingCtrl.recalcOptions(cart, $scope.shippingCtrl.shippingData);
                    $scope.shippingCtrl.recalcOptions(cart, cart.shippingData);
                  });
                  
                  $scope.$watch('shippingCtrl.shippingData.settlement.country', function(newValue, oldValue) {
                    console.log("shop.cart.edit country changed from " + oldValue + " to " + newValue);
                    
                    if (oldValue !== newValue) {
                      $scope.shippingCtrl.shippingData.clearAddress();
                      ////$scope.cart.shippingData.clearAddress();
//                      var input = $('#city2');
//                      input.val(cart.shippingData.getCityPretty());
//                      input = $('#zipCode2');
//                      input.val(cart.shippingData.zipCode);
                      $scope.shippingCtrl.recalcOptions(cart, $scope.shippingCtrl.shippingData);
                    }
                  });

                  //in case cart is loaded before all watchers and listeners get assigned

                  $scope.shippingCtrl.recalcOptions(cart, cart.shippingData);
                  if (cart.shippingData.settlement.city) {
                    $scope.shippingCtrl.setShippingData(cart.shippingData);
                  }
                } ]
              }
            }

          })
          
          //////////////////////////////////////////////////
          // CHECKOUT
          //////////////////////////////////////////////////
          .state(
              'shop.cart.checkout',
              {

                url : '/checkout',

                data : {
                  displayName : 'Към касата'
                },

                resolve : {
                  speedyOffices : [ 'ShippingService', function(ShippingService) {
                    return ShippingService.getAllSpeedyOffices();
                  } ],
                  
                  ekontOffices : [ 'ShippingService', function(ShippingService) {
                    return ShippingService.getAllEkontOffices();
                  } ]
                },
                views : {
                  'cartContent' : {
                    templateUrl : 'app/shop/partials/cart.checkout.html',
                    controller : [ '$scope', '$rootScope', 'cart', 'ShippingService', 'ShippingFactory', '$state', 
                                       'CartService', 'OrderService', 'CART_EVENTS', '$timeout',
                                   function($scope, $rootScope, cart, ShippingService, ShippingFactory, $state, 
                                       CartService, OrderService, CART_EVENTS, $timeout) {

                      console.log("shop.cart.checkout controller...");

                      $scope.shippingCtrl = ShippingFactory.getInstance('shop.cart.checkout', cart.shippingData);
                      $scope.shippingCtrl.factory(ShippingService, $rootScope);
                      $scope.shippingData = $scope.shippingCtrl.shippingData;//it's cart.shippingData
                      $scope.cart = cart;

                      /*if ($scope.cart.count == 0) {
                        // cart is empty
                        $state.go('shop.cart.edit');
                        return;
                      }*/
                          
                      $scope.shippingCtrl.recalcOptions(cart, cart.shippingData);
                      
                      
                      //only those functions that mess with external services need to be wrapped
                      $scope.setZipCodeAndCity = function(result) {
                        $scope.shippingCtrl.setZipCodeAndCity(result);
                      }
                      
                      $scope.setZipCodeAndCity1 = function(result) {
                        $scope.shippingCtrl.setZipCodeAndCity(result);
                        if (result) {
                          var input = $('#city2'); //TODO perhaps class is better than id
                          input.val($scope.cart.shippingData.getCityPretty());
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
                      

                      $scope.$on("settlement-changed", function(event, shippingData) {
                        $scope.shippingCtrl.recalcOptions(cart, shippingData);
                        $scope.shippingCtrl.updateOffices(cart.shippingData);
                        //shippingCtrlEdit.setShippingData(shippingData);
                      });
                      
                      
                      
                      $scope.$watch('cart.shippingData.settlement.country', function(newValue, oldValue) {
                        console.log("shop.cart.checkout country changed from " + oldValue + " to " + newValue);
                        if (oldValue !== newValue) {
                          $scope.cart.shippingData.clearAddress();
                          var input = $('#city2');
                          input.val(cart.shippingData.getCityPretty());
                          input = $('#zipCode2');
                          input.val(cart.shippingData.zipCode);
                          $scope.shippingCtrl.recalcOptions($scope.cart, $scope.cart.shippingData);
                        }
                      });


                      // ///////////////////////
                      // isXXXXXXDataOK
                      // ///////////////////////
                      $scope.isContactDataOK = function() {
                        var a = $scope.cart.contactData;
                        if (!a || !a.firstName || !a.lastName || !a.phone)
                          return false;

                        return true;
                      }

                      $scope.isAddressDataOK = function() {
                        return CartService.isAddressDataOK();
                      }

                      $scope.isOfficesOK = function(form) {
                        var opt = $scope.cart.shippingData.getOption();
                        if (opt) {
                          if (opt.type === 'atelier' || opt.type === 'address')
                            return true;
                            
                          var test = form['officeInput_' + opt.courier];
                          if (test)
                            return !test.$invalid;
                        }
                        return true;
                      }
                      
                      $scope.isPaymentDataOK = function() {
                        // TODO nothing to check yet
                        return true;
                      }

                      $scope.showFullAddress = function() {
                        var str = '';
                        if ($scope.isContactDataOK() && $scope.isAddressDataOK()) {
                          var c = $scope.cart.contactData;
                          var sd = $scope.cart.shippingData;
                          str = sd.country + '<br>';
                          str += (sd.settlement.city + " " + sd.settlement.zipCode);
                          if (a.selectedOption) {
                            var o = a.selectedOption;
                            if (o.type === "atelier") {
                              str += o.name;
                            } else if (o.type === "office") {
                              str += o.name;
                              str += ("<br>" + a.office[o.courier]);
                              str += ("<br>услуга: " + o.service);
                            } else if (o.type == "address") {
                              str += o.name;
                              str += ("<br>" + a.streetAddress1);
                              str += ("<br>услуга: " + o.service);
                            }
                            if (a.streetAddress2)
                              str += ('(<small>' + a.streetAddress2 + ')</small><br>');
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
                            console.log($scope.cart);
                            $rootScope.$broadcast(CART_EVENTS.addressChanged, $scope.cart);
                            // TODO do i need this event?
                            CartService.recalcTotals();
                            $rootScope.$broadcast(CART_EVENTS.cartChanged, $scope.cart);

                            $scope.gotoNext(1);
                          }

                          // //////////////////////////
                          // saveAddress
                          // //////////////////////////
                          $scope.saveAddress = function(el) {
                            console.log($scope.cart);
                            $rootScope.$broadcast(CART_EVENTS.addressChanged, $scope.cart);
                            // TODO do i need this event?
                            CartService.recalcTotals();
                            $rootScope.$broadcast(CART_EVENTS.cartChanged, $scope.cart);

                            $scope.gotoNext(2);
                          }

                          $scope.setWantInvoice = function(val) {
                            $scope.cart.shippingData.wantInvoice = val;
                          }

                          //TODO HMMMMMM
                          $scope.showOptions = function(show) {
//                            $scope.cart.address.showOptions = show;
//                            if (show) {
//
//                            } else {
//                              $scope.cart.address.addressOption = "address";
//                              console.log("WHYYYYYYYYYYYYYYY?");
//                            }
                            return true;
                          }

                          $scope.submitOrder = function() {
                            OrderService.submitOrder();
                          }

                          // //////////////////////////
                          // WATCHERS
                          // //////////////////////////
                          $scope.$watch('cart', function(newValue, oldValue) {
                            console.log("CART CHANGED");
                            console.log(oldValue);
                            console.log(newValue);

                            if (newValue.count == 0) {
                              // cart is empty
                              $state.go('shop.cart.edit');
                              return;
                            }
                            $scope.gotoNext(1);

                          });

                          $scope.$on("cart-loaded", function(event, oldCart, newCart) {
                            if (newCart.count == 0) {
                              // cart is empty
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
        } ])
        
        
;
// the end

