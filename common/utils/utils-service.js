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
});
