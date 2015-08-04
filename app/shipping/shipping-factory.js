angular.module('felt.shipping.service')

////////////////////////////////////////////////////////////////////////
// shippingCtrl
////////////////////////////////////////////////////////////////////////

.factory('ShippingFactory', [ '$rootScope', 'ShippingService', 'CartService', 'cart', 
                           function($rootScope, ShippingService, CartService, cart) {
  var factory = {};
  
  factory.getInstance = function(name, shippingData) {
    if (!name)
      return new Shipping("unknown");
    if (factory[name])
      return factory[name];
    else {
      var newInstance = new Shipping(name, shippingData);
      factory[name] = newInstance;
      return newInstance;
    }
  }
  
  return factory;
}])
        
        
;
// the end




//////////////////////////////////////
//CLASS SHIPPING
//////////////////////////////////////

function Shipping(name, shippingData) {
  this.name = name;
  if (shippingData)
    this.shippingData = shippingData;
  else
    this.shippingData = new ShippingData();
}

Shipping.prototype.factory = function(ShippingService, $rootScope) {
  this.ShippingService = ShippingService;
  this.$rootScope = $rootScope;
  this.zipCodes = ShippingService.zipCodes;
  this.speedyOffices = ShippingService.speedyOffices;
  this.ekontOffices = ShippingService.ekontOffices;
  return this;
}

//1
Shipping.prototype.customLookup = function(str, data) {
  var res = [];
  if (this.ShippingService.isZipCodeInSofia(str)) {
    var data = angular.copy(data[0]);
    if (str.length == 4) {
      //full zip entered. Replace the original
      data.zipCode = str;
    }
    res.push(data);
  }            
  return res;
}

//1
Shipping.prototype.lookupOffices = function(str, courier) {
  var res = [];
  var data = this.ShippingService.getOffices(courier, 
                 this.shippingData.settlement.zipCode, 
                 this.shippingData.settlement.city);
  
  for(var i = 0; i < data.length; i++) {
    if (data[i].name.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
        data[i].address.toLowerCase().indexOf(str.toLowerCase()) >= 0) {
      res.push(data[i]);
    }
  }
  
  return res;
}

//1
Shipping.prototype.customMatching = function(str, zipEntry) {
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

//1
Shipping.prototype.customSelectZipAndCity = function(result) {
  return result.originalObject.combo;
}

//1
Shipping.prototype.customSelectZipCode = function(result) {
  return result.originalObject.zipCode;
}

//1
Shipping.prototype.customSelectCity = function(result) {
  return (result.originalObject.type ? result.originalObject.type + ' ': '') + result.originalObject.city;
}

//1
Shipping.prototype.setZipCodeAndCity = function(result) {
  if (result) {
    console.log("SELECTED " + result.originalObject.city);
    this.shippingData.propagateSettlement(result.originalObject);
    
    //cart.shippingData.propagateSettlement(result.originalObject);
    //this.refreshCart(cart);
    
    if (this.$rootScope)
      this.$rootScope.$broadcast('settlement-changed', this.shippingData);
  }
}

//1
Shipping.prototype.setOffice = function(result, courier) {
  if (result) {
    console.log("SELECTED " + result.originalObject.name);
    this.shippingData.office[courier] = result.originalObject.name;
    
    if (this.$rootScope)
      this.$rootScope.$broadcast('office-changed', this.shippingData);
  }
}

//1
Shipping.prototype.recalcOptions = function(cart, shippingData) {
  if (shippingData.canShippingBeCalculated()) {
    var weight = cart ? cart.weight : 0.0;
    var newOptions = this.ShippingService.calculateShippingCosts(weight, shippingData.settlement);
    shippingData.updateOptions(newOptions);
  } else {
    shippingData.updateOptions([]);
  }
}

/**
 * @deprecated use setShippingData
 */  
Shipping.prototype.loadCartToCtrl = function(cart) {
  angular.copy(cart.shippingData.settlement, this.shippingData.settlement);
  this.shippingData.selectedOption = cart.shippingData.selectedOption;
  this.refreshCart(cart);
}

//1  
Shipping.prototype.setShippingData = function(shippingData) {
  angular.copy(shippingData.settlement, this.shippingData.settlement);
  this.shippingData.selectedOption = shippingData.selectedOption;
  
  if (this.$rootScope)
    this.$rootScope.$broadcast('settlement-changed', this.shippingData);
}

//1
Shipping.prototype.reset = function() {
  this.contactData = {};
  this.shippingData = new ShippingData();
}

//deprecated - use listeners
Shipping.prototype.refreshCart = function(cart) {
  this.recalcOptions(cart, cart.shippingData);
  this.recalcOptions(cart, this.shippingData);
  this.updateOffices(cart);
}

////////////////////////////
// OUT OUT OUT
//////////////////////////


//refactor - move out
Shipping.prototype.updateOffices = function(cart) {
  var option = cart.shippingData.getOption();
  var options = cart.shippingData.options;
  var s = cart.shippingData.settlement;
  for(var i = 0; i < options.length; i++) {
    if (options[i].type == 'office') {
      var data = this.ShippingService.getOffices(options[i].courier, cart.shippingData.settlement.zipCode, cart.shippingData.settlement.city);
      if (data && data.length == 1) {
        //one office, select it
        cart.shippingData.office[options[i].courier] = data[0].name;
      } else if (data && data.length > 1) {
        //more than one
        //sync currently selected to the list
        var found = false;
        for(var j = 0; !found && j < data.length; j++) {
          found = (data[j].name === cart.shippingData.office[options[i].courier])
        }
        if (!found) {
          cart.shippingData.office[options[i].courier]='';
        }
      }
    }
  }
}

//move out
Shipping.prototype.getSpeedyOffices = function() {
  return this.ShippingOffice.getSpeedyOffices(cart.shippingData.settlement.zipCode, cart.shippingData.settlement.city);
}

//move out
Shipping.prototype.getEkontOffices = function() {
  return this.ShippingOffice.getEkontOffices(cart.shippingData.settlement.zipCode, cart.shippingData.settlement.city);
}

