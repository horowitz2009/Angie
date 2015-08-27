function ShippingOption(name, type, courier) {
  if (typeof name === 'object') {
    this.name = name.name;
    this.type = name.type;
    this.amount = name.amount;
    this.service = name.service;
    this.courier = name.courier;
  } else {
    this.name = name;
    this.type = type;
    this.amount = -1.00;
    this.service = "";
    this.courier = courier;
  }
}

ShippingOption.prototype.toString = function() {
  return this.type + "|" + this.service + "|" + this.amount;    
};

ShippingOption.prototype.getNameAndService = function() {
  var s = this.name;
  if (this.service) {
    s += (" - (" + this.service + ")");
  }
  return s;
};
  
function ShippingData(data) {
  if (data) {
    angular.copy(data, this);
  } else {
    this.settlement = { "country": "България" };
    this.options = [];
    this.selectedOption = null;
    this.office = {};
  }
}

ShippingData.prototype.canShippingBeCalculated = function() {
  if (!this.settlement || !this.settlement.country)
    return false;

  if (this.settlement.country == 'България') {
    if (!this.settlement.zipCode || !this.settlement.city)
      return false;
  }
  
  return true;  
}

ShippingData.prototype.getCityPretty = function () {
  var s = this.settlement;
  var res='';
  if (s.type) 
    res += s.type + ' ';
  if (s.city)  
    res += s.city;
  return res;
}

ShippingData.prototype.getCityAndZipPretty = function () {
  var res = this.getCityPretty();
  if (this.settlement.zipCode)
    res += ' ' + this.settlement.zipCode;
  return res;  
}

ShippingData.prototype.getOption = function () {
  if (this.selectedOptionObj == null)
    for (var i = 0; this.options && i < this.options.length; i++) {
      if (this.options[i].toString() === this.selectedOption) {
        this.selectedOptionObj = this.options[i];
        break;
      }
    }
  return this.selectedOptionObj;
}

ShippingData.prototype.setOption = function (optionStrOrObj) {
  if (typeof optionStrOrObj === 'string')
    this.selectedOption = optionStrOrObj;
  else {
    this.selectedOption = optionStrOrObj ? optionStrOrObj.toString() : null;
    this.selectedOptionObj = optionStrOrObj;
  }
}

ShippingData.prototype.updateOptions = function (newOptions) {
  { //if (!angular.equals(this.options, newOptions)){
    this.options = newOptions;
    if (this.selectedOption) {
      var ss = this.selectedOption.split("|");
      var found = false;
      for (var i = 0; !found && i < this.options.length; i++) {
        if (this.options[i].type === ss[0] && this.options[i].service === ss[1]) {
          this.selectedOptionObj = this.options[i];
          this.selectedOption = this.options[i].toString();
          found = true;
          break;
        }
      }
      if (!found) {
        this.selectedOptionObj = null;
        this.selectedOption = null;
      }
    } else {
      this.selectedOptionObj = null;
    }
  }
}

ShippingData.prototype.copyTo = function(obj) {
  angular.copy(this.settlement, obj.settlement);
  angular.copy(this.options, obj.options);
  angular.copy(this.office, obj.office);
  obj.wantInvoice = this.wantInvoice;
  obj.invoiceData = this.invoiceData;
  //obj.selectedOptionObj = null;
  //obj.selectedOption = this.selectedOption;
}

ShippingData.prototype.propagateSettlement = function(obj) {
  this.settlement.type = obj.type;
  this.settlement.city = obj.city;
  this.settlement.zipCode = obj.zipCode;
  this.settlement.combo = obj.combo;
}

ShippingData.prototype.clearAddress = function () {
  this.settlement.type = '';
  this.settlement.city = '';
  this.settlement.zipCode = '';
  this.settlement.combo = '';
  this.office.Ekont = '';
  this.office.Speedy = '';
  this.office.address = '';
  this.streetAddress1 = null;
  this.streetAddress2 = null;
  //TODO clear the streetaddress
}

ShippingData.prototype.reset = function () {
  this.clearAddress();
  this.selectedOption = null;
  this.selectedOptionObj = null;
  this.options = [];  
}

function Order(data) {
  angular.copy(data, this);
  this.option = new ShippingOption(data.option);
  this.shippingData = new ShippingData(data.shippingData);
}
