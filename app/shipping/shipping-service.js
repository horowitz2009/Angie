angular.module('felt.shipping.service', [

])

.factory('ShippingService', [ '$http', 'utils', '$q', function($http, utils, $q) {
  
  //private stuff
  var pathZipCodes = 'assets/zipCodes_rich.json';
  var pathSpeedyTables = 'assets/speedy_tables.json';
  var pathEkontTables = 'assets/ekont_tables.json';
  var pathSpeedyOffices = 'assets/speedy_offices.json';
  var pathEkontOffices = 'assets/ekont_offices.json';
  
  
  
  var zipCodesPromise = null;
  var speedyTablesPromise = null;
  var ekontTablesPromise = null;
  var speedyOfficesPromise = null;
  var ekontOfficesPromise = null;
  

  var factory = {};
  
  factory.zipCodesExceptions = [];
  factory.zipCodes = [];
  factory.speedyTables = {};
  factory.ekontTables = {};
  factory.speedyOffices = [];
  factory.ekontOffices = [];

  factory.getZipCodes = function() {
    if (zipCodesPromise == null) {
      zipCodesPromise = $http.get(pathZipCodes).then(function(resp) {
        factory.zipCodes = resp.data;
        return resp.data;
      });
    }
    return zipCodesPromise;
  }

  factory.getSpeedyTables = function() {
    if (speedyTablesPromise == null) {
      speedyTablesPromise = $http.get(pathSpeedyTables).then(function(resp) {
        factory.speedyTables = resp.data;
        return resp.data;
      });
    }
    return speedyTablesPromise;
  }

  factory.getEkontTables = function() {
    if (ekontTablesPromise == null) {
      ekontTablesPromise = $http.get(pathEkontTables).then(function(resp) {
        factory.ekontTables = resp.data;
        return resp.data;
      });
    }
    return ekontTablesPromise;
  }

  factory.getAllSpeedyOffices = function() {
    if (speedyOfficesPromise == null) {
      speedyOfficesPromise = $http.get(pathSpeedyOffices).then(function(resp) {
        factory.speedyOffices = resp.data;
        return resp.data;
      });
    }
    return speedyOfficesPromise;
  }
  
  factory.getAllEkontOffices = function() {
    if (ekontOfficesPromise == null) {
      ekontOfficesPromise = $http.get(pathEkontOffices).then(function(resp) {
        factory.ekontOffices = resp.data;
        return resp.data;
      });
    }
    return ekontOfficesPromise;
  }
  
  factory.getZipCodesExceptions = function() {
    return zipCodesPromise.then(function(zipCodes) {
      console.log("getZipCodesExceptions...");
      var ex = [];
      for (var i = 0; i < zipCodes.length; i++) {
        var zc = zipCodes[i].zipCode;
        if (zc > 1000 && zc < 2000) {
          ex.push(zc);
        }
      }
      factory.zipCodesExceptions = ex;
      // check later!
      console.log("getZipCodesExceptions...done");
      return ex;
    });
  }

  factory.isZipCodeInSofia = function(str, zipCodesExceptions) {
    zipCodesExceptions = zipCodesExceptions ? zipCodesExceptions : factory.zipCodesExceptions;
    console.log("isZipCodeInSofia...");
    if (!isNaN(str) && parseInt(str) < 2000) {
      var s = str;
      while (s.length < 4) {
        s = s + '0';
      }

      if (parseInt(s) < 2000) {
        // it is number < 2000

        // startsWith
        var found = false;
        for (var i = 0; i < zipCodesExceptions.length && !found; i++) {
          if (zipCodesExceptions[i].indexOf(str) == 0) {
            found = true;
          }
        }
        if (!found) {
          found = "1000".indexOf(str) == 0;
        }
        console.log("isZipCodeInSofia...done1");
        return !found;
      }
    }
    console.log("isZipCodeInSofia...done2");
    return false;
  }
  
  factory.calculateSpeedyOptions = function(options, weight, country, zip, city, zipE) {
    // SPEEDY OPTIONS
    var exceptions = [ '1151', '1186' ];
    var tableGK = factory.speedyTables.tableGK;
    var tableECO = factory.speedyTables.tableECO;
    var table358 = factory.speedyTables.table358;
    var tableMac = factory.speedyTables.tableMacedonia;
    var tableEB = factory.speedyTables.tableExpressBalkans;
    
    if (country === 'България') {
      isSofia = false;
      hasOffice = false;
  
      if (!isNaN(zip) && parseInt(zip) < 2000) {
        found = utils.indexOf(factory.zipCodesExceptions, zip) >= 0;
        if (found) {
          // these zips are threated as Sofia
          found = !(utils.indexOf(exceptions, zip) >= 0);
        }
        isSofia = !found;
      }
      
      if (isSofia) {
        //Speedy: Gradski kurier ili 3-5-8 (do 8kg) do ofis na Speedy
        hasOffice = true;
        options.toDoor.service = "Градски куриер";
  
        // first calc GK
        var rate = findTariff(weight, tableGK);
        rate2 = applyReductionsAndTaxes(rate, true, false);
        options.toDoor.amount = rate2;
  
        // NOW to Office options
        rate2 = applyReductionsAndTaxes(rate, true, true);
        options.toOffice.amount = rate2;
        options.toOffice.service = "Градски куриер";
        if (weight - 8.0 <= 0.0000001) {
          // try 358
          rate = findTariff(weight, table358);
          if (rate - rate2 <= 0.0000001) {
            options.toOffice.amount = rate;
            options.toOffice.service = "3-5-8";
          }
        }
        
      } else {
        //NOT SOFIA
        //Speedy: eco
        options.toDoor.service = "Икономична";
        rate = findTariff(weight, tableECO);
        rate2 = applyReductionsAndTaxes(rate, true, false);
        options.toDoor.amount = rate2;
  
        
        if (zipE ? zipE.speedyOffices.length > 0 : factory.hasSpeedyOffice(zip, city)) {
          // try do ofis na Speedy
          rate2 = applyReductionsAndTaxes(rate, true, true);
          options.toOffice.amount = rate2;
          options.toOffice.service = "Икономична";
          if (weight - 8.0 <= 0.0000001) {
            // try 358
            rate = findTariff(weight, table358);
            if (rate - rate2 <= 0.0000001) {
              options.toOffice.amount = rate;
              options.toOffice.service = "3-5-8";
            }
          }
        }
      }
    } else if (country === 'Македония') {
      options.toDoor.service = "Международна";
      rate = findTariff(weight, tableMac);
      //the VAT and fuel tax are already included
      options.toDoor.amount = rate;
      
    } else if (country === 'Гърция' || country === 'Румъния') {
      options.toDoor.service = "ExpressBalkans";
      var rate = findTariff(weight, tableEB);
      //the VAT and fuel tax are already included
      //reduce with 5% if package sent from office
      rate = rate * 0.95;
      options.toDoor.amount = rate;
    }
    
  }

  factory.calculateEkontOptions = function(options, weight, country, zip, city, zipE) {
    var tableGK = factory.ekontTables.tableGK;
    var tableOO = factory.ekontTables.tableOO;
    var tableOD = factory.ekontTables.tableOD;
    var tableDD = factory.ekontTables.tableDD;
    var tablePS = factory.ekontTables.tablePS;
    var tableGR = factory.ekontTables.tableGR;
    var tableRO = factory.ekontTables.tableRO;
    
    var rate, rate2;
    var fuelTaxMultiplier = 1 + parseFloat(factory.ekontTables.fuelTax);

    if (country === 'България') {
      
      hasOffice = zipE ? zipE.ekontOffices.length > 0 : factory.hasEkontOffice(zip, city);
      
      var isSofia = false;
  
      if (!isNaN(zip) && parseInt(zip) < 2000) {
        if (utils.indexOf(factory.zipCodesExceptions, zip) < 0) {
          zip = 1000; 
        }
      }
      
      
      if (hasOffice) {
        //toOffice
        if (weight - 20.0 <= 0.0000001) {
          //1. toOffice - PS
          options.toOffice.service = "Пощенска";
          rate = findTariff(weight, tablePS);
        } else {
          //2. toOffice - OO
          options.toOffice.service = "Офис-Офис";
          rate = findTariff(weight, tableOO);
        }
        rate2 = rate * fuelTaxMultiplier;
        options.toOffice.amount = rate2;
        
        
        //toDoor - GK, OD if less than 2kg
        if (weight - 2.0 <= 0.0000001) {
          options.toDoor.service = "Офис-Врата";
          rate = findTariff(weight, tableOD);
        } else {
          options.toDoor.service = "Градски куриер";
          rate = findTariff(weight, tableGK);
        }
        rate2 = rate * fuelTaxMultiplier;
        options.toDoor.amount = rate2;
        
      } else {
        //no office - DD
        options.toDoor.service = "Офис-Врата";
        rate = findTariff(weight, tableDD);
        rate2 = rate * fuelTaxMultiplier;
        options.toDoor.amount = rate2;
      }
    } else if (country === 'Гърция') {
      var rate = findTariff(weight, tableGR);
      options.toDoor.service = "Международна";
      rate2 = rate * fuelTaxMultiplier;
      options.toDoor.amount = rate2;
      
    } else if (country === 'Румъния') {
      var rate = findTariff(weight, tableRO);
      options.toDoor.service = "Международна";
      rate2 = rate * fuelTaxMultiplier;
      options.toDoor.amount = rate2;
    }     
  }
  
  factory.calculateShippingCosts = function(weight, countryOrObj, zip, city, zipE) {
    var options = [];
    console.log("calculateShippingCosts...");
    var country = countryOrObj;
    if (typeof countryOrObj === 'object') {
      country = countryOrObj.country;
      zip = countryOrObj.zipCode;
      city = countryOrObj.city;
    }

      if (zipE) {
        zip = zipE.zipCode;
        city = zipE.city;
      }
      if (country==='България' && (!zip || !city))
        return options;
        
      weight = weight + 200.0;//TODO tune this later
      weight = weight / 1000;
  
      
  
      var fromAtelier = new ShippingOption("вземане от ателието (София, ул. 488 2Б)", "atelier","");
      fromAtelier.amount = 0.00;
      var toDoorSpeedy = new ShippingOption("до адрес", "address", "Speedy");
      var toDoorEkont = new ShippingOption("до адрес", "address", "Ekont");
      var toOfficeSpeedy = new ShippingOption("до офис на Спиди", "office", "Speedy");
      var toOfficeEkont = new ShippingOption("до офис на Еконт", "office", "Ekont");

      var speedyOptions = { "toDoor": toDoorSpeedy, "toOffice": toOfficeSpeedy};
      var ekontOptions = { "toDoor": toDoorEkont, "toOffice": toOfficeEkont};
      
      factory.calculateSpeedyOptions(speedyOptions, weight, country, zip, city, zipE);
      
      factory.calculateEkontOptions(ekontOptions, weight, country, zip, city, zipE);
      
      
      options.push(fromAtelier);
      var toDoorOptions = [];
      if (toOfficeSpeedy.amount >= 0)
        options.push(toOfficeSpeedy);
      if (toOfficeEkont.amount >= 0)
        options.push(toOfficeEkont);
      
      if (toDoorSpeedy.amount >= 0)
        toDoorOptions.push(toDoorSpeedy);
      if (toDoorEkont.amount >= 0)
        toDoorOptions.push(toDoorEkont);
      
      if (toDoorOptions.length > 1) {
        if (toDoorOptions[0].amount > toDoorOptions[1].amount) {
          options.push(toDoorOptions[1]);
        } else {
          options.push(toDoorOptions[0]);
        }
      } else if (toDoorOptions.length == 1) {
        options.push(toDoorOptions[0]);
      }
    console.log("calculateShippingCosts...done");
    return options;
  }

  factory.getZipEntry = function(zipCode, city) {
    for (var i = 0; i < factory.zipCodes.length; i++) {
      if (factory.zipCodes[i].zipCode === zipCode && factory.zipCodes[i].city.toUpperCase() === city.toUpperCase()) {
        return factory.zipCodes[i];
      }
    }
    return null;
  }

  factory.hasSpeedyOffice = function(zipCode, city) {
    var zipEntry = factory.getZipEntry(zipCode, city);
    if (zipEntry)
      return zipEntry.speedyOffices.length > 0;
    //if (zipCode < 2000)
    //  return factory.zipCodes[0].speedyOffices.length > 0;  
    return false;
  }

  factory.hasEkontOffice = function(zipCode, city) {
    var zipEntry = factory.getZipEntry(zipCode, city);
    if (zipEntry)
      return zipEntry.ekontOffices.length > 0;
    if (zipCode < 2000)
      return factory.zipCodes[0].ekontOffices.length > 0;
    return false;
  }

  factory.getOffices = function(courier, zipCode, city) {
    if (courier == "Speedy")
      return factory.getSpeedyOffices(zipCode, city);
    else if (courier == "Ekont")
      return factory.getEkontOffices(zipCode, city);
    else
      return [];
  }
  
  factory.getSpeedyOffices = function(zipCode, city) {
    var zipEntry = factory.getZipEntry(zipCode, city);
    if (zipEntry)
      return zipEntry.speedyOffices;
    if (zipCode < 2000) 
      return factory.zipCodes[0].speedyOffices;
    return null;
  }
  
  factory.getEkontOffices = function(zipCode, city) {
    var zipEntry = factory.getZipEntry(zipCode, city);
    if (zipEntry)
      return zipEntry.ekontOffices;
    if (zipCode < 2000) 
      return factory.zipCodes[0].ekontOffices;
    return [];
  }

  return factory;
} ])


;


//very private functions

function findTariff(weight, table) {
  for (var i = 0; i < table.length; i++) {
    if (weight - table[i].to <= 0.0000001)
      return table[i].tariff;
  }
  return -1;
}

function applyReductionsAndTaxes(rate, bringToOffice, takeFromOffice) {
  if (bringToOffice) {
    rate *= (1 - 0.15);// -15%
    rate = Math.round(rate * 100) / 100;
  }

  if (takeFromOffice) {
    rate *= (1 - 0.15);// -15%
    rate = Math.round(rate * 100) / 100;
  }

  // fuel
  rate *= (1 + 0.115); // +11.5%
  rate = Math.round(rate * 100) / 100;
  // VAT
  rate *= 1.20;
  rate = Math.round(rate * 100) / 100;

  return rate;
}
