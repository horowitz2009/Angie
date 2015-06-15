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
              
              /*,speedyOffices : [ 'ShippingService', function(ShippingService) {
                return ShippingService.getSpeedyOffices();
              } ],
              
              ekontOffices : [ 'ShippingService', function(ShippingService) {
                return ShippingService.getEkontOffices();
              } ]*/
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

          .state('shop.cart.edit', {

            url : '',

            data : {
              displayName : 'Количка'
            },

            views : {
              'cartContent' : {
                templateUrl : 'app/shop/partials/cart.details.html',
                controller : [ '$scope', 'shippingCtrl', function($scope, shippingCtrl) {
                  $scope.shippingCtrl = shippingCtrl;
                  $scope.cart = shippingCtrl.cart;
                  $scope.shippingData = shippingCtrl.shippingData;
                  
                  //TODO ================================
                  if (!$scope.shippingCtrl.shippingData.settlement.city) {
                    shippingCtrl.loadCartToCtrl($scope.cart);
                  }
                  
                  $scope.$on("cart-loaded", function(event, oldCart, newCart) {
                    if (!$scope.shippingCtrl.shippingData.settlement.city) {
                      shippingCtrl.loadCartToCtrl(newCart);
                    }
                  });
                  
                  $scope.$on("cart-changed", function(event, cart) {
                    console.log("CART CHANGED AND I'M GONNA RECALCULATE THE SHIPPING COSTS");
                    console.log(cart);
                    shippingCtrl.refreshCart(cart);
                    
                  });

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
                    controller : [ '$scope', '$rootScope', 'cart', 'shippingCtrl', '$state', 'CartService', 'CART_EVENTS', '$timeout',
                        function($scope, $rootScope, cart, shippingCtrl, $state, CartService, CART_EVENTS, $timeout) {

                          $scope.shippingCtrl = shippingCtrl;
                          $scope.cart = shippingCtrl.cart;

                          if ($scope.cart.count == 0) {
                            // cart is empty
                            $state.go('shop.cart.edit');
                            return;
                          }
                          
                          shippingCtrl.recalcOptions(cart, cart.shippingData);
                          

                          // ///////////////////////
                          // isXXXXXXDataOK
                          // ///////////////////////
                          $scope.isContactDataOK = function() {
                            var a = shippingCtrl.cart.contactData;
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
                            console.log(shippingCtrl.cart);
                            $rootScope.$broadcast(CART_EVENTS.addressChanged, shippingCtrl.cart);
                            // TODO do i need this event?
                            CartService.recalcTotals();
                            $rootScope.$broadcast(CART_EVENTS.cartChanged, shippingCtrl.cart);

                            $scope.gotoNext(1);
                          }

                          // //////////////////////////
                          // saveAddress
                          // //////////////////////////
                          $scope.saveAddress = function(el) {
                            console.log(shippingCtrl.cart);
                            $rootScope.$broadcast(CART_EVENTS.addressChanged, shippingCtrl.cart);
                            // TODO do i need this event?
                            CartService.recalcTotals();
                            $rootScope.$broadcast(CART_EVENTS.cartChanged, shippingCtrl.cart);

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
                            // TODO
                          }

                          // //////////////////////////
                          // WATCHERS
                          // //////////////////////////
                          //TODO HMMMMMM
                          $scope.$watch('cart.shippingData.settlement.country', function(newValue, oldValue) {
                            console.log("country is being watched:");
                            console.log(oldValue);
                            console.log(newValue);
                            if (newValue == "България") {
                              $scope.showOptions(true);
                            }

                            if (oldValue == "България" && newValue !== "България") {
                              $scope.showOptions(false);
                            }

                          });

                          $scope.$watch('cart', function(newValue, oldValue) {
                            console.log("CART CHANGED");
                            console.log(oldValue);
                            console.log(newValue);

//                            if ($scope.cart.address.country == "България") {
//                              $scope.showOptions(true);
//                            }

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
        
        

////////////////////////////////////////////////////////////////////////
// shippingCtrl
////////////////////////////////////////////////////////////////////////

.factory('shippingCtrl', [ '$rootScope', 'ShippingService', 'CartService', 'cart', 
                           function($rootScope, ShippingService, CartService, cart) {
  var factory = {};
  
  factory.shippingData = new ShippingData();

  factory.tempSettlement = factory.shippingData.settlement;//TODO too confusing

  factory.cart = cart;
  
  factory.zipCodes = ShippingService.zipCodes;
  factory.speedyOffices = ShippingService.speedyOffices;
  factory.ekontOffices = ShippingService.ekontOffices;
  
  factory.customLookup = function(str, data) {
    var res = [];
    if (ShippingService.isZipCodeInSofia(str, ShippingService.zipCodesExceptions)) {
      var data = angular.copy(data[0]);
      if (str.length == 4) {
        //full zip entered. Replace the original
        data.zipCode = str;
      }
      res.push(data);
    }            
    return res;
  }

  factory.lookupOffices = function(str, courier) {
    var res = [];
    var sd = factory.cart.shippingData;
    var data = ShippingService.getOffices(courier, sd.settlement.zipCode, sd.settlement.city);
    
    for(var i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
          data[i].address.toLowerCase().indexOf(str.toLowerCase()) >= 0) {
        res.push(data[i]);
      }
    }
    
    return res;
  }
  
  factory.customMatching = function(str, zipEntry) {
    var isCity = false;
    var isVillage = false;
    var isResort = false;
    var type = null;
    if (str.indexOf("гр.") == 0 || str.indexOf("гр ") == 0) {
      type="гр.";
      str = str.substr(3);
    } else if (str.indexOf("град ") == 0) {
      type="гр.";
      str = str.substr("град ".length);
    } else if (str.indexOf("с.") == 0 || str.indexOf("с ") == 0) {
      type="с.";
      str = str.substr(2);
    } else if (str.indexOf("село ") == 0) {
      type="с.";
      str = str.substr("село ".length);
    } else if (str.indexOf("к.") == 0 || str.indexOf("к ") == 0) {
      type="к.";
      str = str.substr(2);
    } else if (str.indexOf("курорт ") == 0) {
      type="к.";
      str = str.substr("курорт ".length);
    } else if (str.indexOf("кур.") == 0) {
      type="к.";
      str = str.substr("кур.".length);
    } else if (str.indexOf("к.к.") == 0) {
      type="к.";
      str = str.substr("к.к.".length);
    }
    str = str.trim();
    var ss = str.split(" ");
    var city = str;
    var zip = null;
    for (var i = 0; i < ss.length; i++) {
      if(!isNaN(ss[i])) {
        zip = ss[i];
        city = str.replace(zip, "").trim();
        break;
      }
    }
    
    var zipOK = true;

    if (zip) {
      zipOK =  zipEntry.zipCode.indexOf(zip) == 0;
    }
    var cityOK = true;
    if (city)
      cityOK = zipEntry.city.toUpperCase().indexOf(city.toUpperCase()) >= 0;

    var typeOK = true;
    if (type)  
      typeOK = zipEntry.type.indexOf(type) >= 0;
    return typeOK && cityOK && zipOK;
  }
  
  factory.customSelectZipAndCity = function(result) {
    return result.originalObject.combo;
  }
  factory.customSelectZipCode = function(result) {
    return result.originalObject.zipCode;
  }
  factory.customSelectCity = function(result) {
    return (result.originalObject.type ? result.originalObject.type + ' ': '') + result.originalObject.city;
  }

  factory.setZipCodeAndCity = function(result) {
    if (result) {
      console.log("SELECTED " + result.originalObject.city);
      
      factory.shippingData.propagateSettlement(result.originalObject); 
      cart.shippingData.propagateSettlement(result.originalObject);
      factory.refreshCart(cart);
    }
  }
  
  factory.setOffice = function(result, courier) {
    if (result) {
      console.log("SELECTED " + result.originalObject.name);
      cart.shippingData.office[courier] = result.originalObject.name;
    }
  }
    
  //OK
  factory.setTempZipCodeAndCity = function(result) {
    if (result) {
      console.log("SELECTED " + result.originalObject.city);
      
      factory.shippingData.propagateSettlement(result.originalObject); 
      
      factory.recalcOptions(cart, factory.shippingData);
    }
  }
  
  //ok
  factory.recalcOptions = function(cart, shippingData) {
    if (shippingData.canShippingBeCalculated()) {
      var newOptions = ShippingService.calculateShippingCosts(cart.weight, shippingData.settlement);
      shippingData.updateOptions(newOptions);
    }
  }
  
  //ok  
  factory.loadCartToCtrl = function(cart) {
    angular.copy(cart.shippingData.settlement, factory.shippingData.settlement);
    factory.shippingData.selectedOption = cart.shippingData.selectedOption;
    factory.refreshCart(cart);
  }
  
  //ok
  factory.refreshCart = function(cart) {
    factory.recalcOptions(cart, cart.shippingData);
    factory.recalcOptions(cart, factory.shippingData);
    factory.updateOffices();
  }

  //not used
  factory.setOption2 = function (option) {
    cart.shippingData.setOption(option);
    factory.shippingData.setOption(option);
  }
  
  //OK
  factory.submitSettlement = function () {
    console.log("submitSettlement...");
    if (factory.shippingData.selectedOption) {
      angular.copy(factory.shippingData.settlement, cart.shippingData.settlement);
      cart.shippingData.selectedOption = factory.shippingData.selectedOption;
      factory.refreshCart(cart);
      $rootScope.$broadcast('cart-changed', cart);
    }  
    
    $("#ModalZip").modal('hide');
  }
  
  factory.updateOffices = function() {
    var option = factory.cart.shippingData.getOption();
    var options = factory.cart.shippingData.options;
    var s = factory.cart.shippingData.settlement;
    for(var i = 0; i < options.length; i++) {
      if (options[i].type == 'office') {
        var data = ShippingService.getOffices(options[i].courier, factory.cart.shippingData.settlement.zipCode, factory.cart.shippingData.settlement.city);
        if (data && data.length == 1) {
          //one office, select it
          factory.cart.shippingData.office[options[i].courier] = data[0].name;
        } else if (data && data.length > 1) {
          //more than one
          //sync currently selected to the list
          var found = false;
          for(var j = 0; !found && j < data.length; j++) {
            found = (data[j].name === factory.cart.shippingData.office[options[i].courier])
          }
          if (!found) {
            factory.cart.shippingData.office[options[i].courier]='';
          }
        }
      }
    }
  }
  
  factory.canShippingBeCalculated = function() {
    return CartService.canShippingBeCalculated();
  }
  
  factory.getSpeedyOffices = function() {
    return ShippingOffice.getSpeedyOffices(cart.shippingData.settlement.zipCode, cart.shippingData.settlement.city);
  }

  factory.getEkontOffices = function() {
    return ShippingOffice.getEkontOffices(cart.shippingData.settlement.zipCode, cart.shippingData.settlement.city);
  }
  
  return factory;
}])
        
        
;
// the end

