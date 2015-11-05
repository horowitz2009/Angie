angular.module('common.utils.service', [

])

.factory('utils', function () {
  return {
    // Util for finding an object by its 'id' property among an array
    findById: function findById(a, id) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return a[i];
      }
      return null;
    },

    getIndexOf: function getIndexOf(a, id) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return i;
      }
      return -1;
    },

    indexOf : function(arr, needle) {
      if(typeof arr.indexOf === 'function') {
        return arr.indexOf(needle);
      } else {
        var i = -1, index = -1;

        for(i = 0; i < arr.length; i++) {
          if(arr[i] === needle) {
            index = i;
            break;
          }
        }

        return index;
      }
    },
    
    // Util for returning a random key from a collection that also isn't the current key
    newRandomKey: function newRandomKey(coll, key, currentKey){
      var randKey;
      do {
        randKey = coll[Math.floor(coll.length * Math.random())][key];
      } while (randKey == currentKey);
      return randKey;
    }
  };
})


// ////////////////////////////////////////////////////////////////////////
// LokiService
// ////////////////////////////////////////////////////////////////////////
.factory('LokiService', [ '$log', '$http', '$q', function($log, $http, $q) {
  var factory = {};

  factory.createDB = function(dbName, collectionName, jsonFilename, propageteCallback) {
    var promise = $q(function(resolve, reject) {

      var db = new loki(dbName, {
        autosave : false,
        persistenceMethod : 'adapter',
        adapter : new jquerySyncAdapter({
          ajaxLib : $
        })
      });

      db.loadDatabase({}, function() {
        var data = null;
        var collection = db.getCollection(collectionName);
        if (!collection) {
          collection = db.addCollection(collectionName);
        }

        if (collection.data.length == 0) {
          // no collection found. Try to load the data from json file
          $http.get(jsonFilename).then(function(resp) {
            data = resp.data[collectionName];
            if (propageteCallback)
              data = propageteCallback(data, db);

            for (var i = 0; i < data.length; i++) {
              collection.insert(data[i]);
            }
            data = collection.chain().data();

            db.saveDatabase();
            resolve(data);

          },

          function(resp) {
            reject(resp);
          });

        } else {
          data = collection.chain().data();
          resolve(data);
        }
      });

    });

    return promise;
  }

  return factory;
} ])

;
