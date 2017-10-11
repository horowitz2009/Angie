angular.module('felt.color.service', [])

// A RESTful factory for retrieving contacts from 'contacts.json'
  .factory('Color', ['$http', 'utils', function ($http, utils) {
    var colorPromise = null;
    var factory = {};
    
    factory.getColorInfo = function(hexColor) {
      if (colorPromise == null) {
        console.log("Acquiring info for color " + hexColor + " ...");
        colorPromise = $http.get("http://www.colorhexa.com/" + hexColor).then(function (resp) {
          return resp.data;
        }); 
      }
      return colorPromise;  
    }
    
    return factory;
  }]);
