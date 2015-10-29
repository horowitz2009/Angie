angular.module('felt.shop.service', [

])

.factory('ShopService', [ '$http', 'utils', '$q', function($http, utils, $q) {
  console.log("[  6 shop-service.factory ShopService]");
  var pathCategories = 'assets/categories.json';
  var pathAllColors = 'assets/allColors.json';
  var categoriesPromise = null;
  var categories = null;
  var allColorsPromise = null;

  /*
   * var jqAdapter = new jquerySyncAdapter({ ajaxLib : $ });
   */

  var factory = {};

  // I think this is never used
  function initializeDB(db) {
    if (db != null && typeof (db) === "object") {
      var promise = $http.get("assets/categories.json").then(function(resp) {
        var res = resp.data.categories;

        enrich(res);
        saveToLoki(res);

        return res;
      });

    }
  }

  factory.getCategories = function() {
    //TODO make this to expire in a moment and take fresh data from server
    if (categoriesPromise == null) {

      // DB WAY HERE
      var db = new loki('catalog', {
        persistenceMethod : 'adapter',
        adapter : new jquerySyncAdapter({
          ajaxLib : $
        })
      });

      categoriesPromise = $q(function(resolve, reject) {
        db.loadDatabase({}, function(db) {
          if (db != null && typeof (db) === "object") {
            var catCollection = db.getCollection('categories');

            if (catCollection == null) {
              $http.get("assets/categories.json").then(function(resp) {
                var cats = resp.data.categories;
                enrich(cats);
                saveToLoki(cats);
                resolve(cats);
              },

              function(resp) {
                reject(resp);
              });
            } else {
              // TODO check this later
              // catCollection.setChangesApi(true);

              resolve(catCollection.chain().data());
            }
            // hmm
          } else {
            reject(db);
          }
        });
      });

    }
    return categoriesPromise;
  }

  factory.getAllColors = function() {
    if (allColorsPromise == null) {
      // console.log("READING " + pathAllColors + " ...");
      allColorsPromise = $http.get(pathAllColors).then(function(resp) {
        return resp.data;
      });
    }
    return allColorsPromise;
  }

  factory.clearCache = function() {
    dataPromise = null;
  }

  factory.extractCatMenuItems = function(categories) {
    var items = [];
    for (var i = 0; i < categories.length; i++) {
      items.push({
        "name" : categories[i].name,
        "id" : categories[i].id,
        "cnt" : categories[i].products.length
      });
    }
    return items;
  }

  factory.extractOrigins = function(category) {
    var origins = [];
    if (category !== null) {
      category.products.forEach(function(p) {
        var found = false;
        for (var i = 0; i < origins.length; i++) {
          if (origins[i].name === p.origin) {
            found = true;
            origins[i].cnt = origins[i].cnt + 1;
            break;
          }
        }

        if (!found && p.origin)
          origins.push({
            "name" : p.origin,
            'value' : false,
            'cnt' : 1
          });

      });
    }
    return origins;
  }

  factory.extractColors = function(category, colorGroups) {
    var colors = angular.copy(colorGroups);
    for (var i = 0; i < colors.length; i++) {
      colors[i].cnt = 0;
      delete colors[i].colors;
      colors[i].value = false;
    }
    var globalCnt = 0;
    if (category !== null)
      category.products.forEach(function(p) {
        for (var i = 0; i < colors.length; i++) {
          if (p.colorGroups && p.colorGroups.indexOf('' + colors[i].id) >= 0) {
            colors[i].cnt++;
            globalCnt++;
          }
        }
      });

    if (globalCnt == 0)
      return [];

    return colors;
  }

  // PSEUDO-PRIVATE METHODS
  function enrich(categories) {
    if (categories) {
      categories.forEach(function(cat) {
        for (var i = 0; i < cat.products.length; i++) {
          var p = cat.products[i];
          if (!p.categoryId)
            p.categoryId = cat.id;

          if (!p.weight)
            p.weight = p.quantity;
        }
      });
    }
  }

  function saveToLoki(categories) {
    new loki('catalog', {
      autoload : true,
      autoloadCallback : function(db) {
        var catCollection = db.getCollection('categories');
        if (!catCollection) {
          console.log("categories collection not found. Adding...")
          catCollection = db.addCollection('categories');
        }
        catCollection.setChangesApi(false);

        // removes all categories if any
        catCollection.chain().remove();

        // adds the categories
        categories.forEach(function(cat) {
          catCollection.insert(cat);
        });

        db.save();
        console.log("DONE.");
      },
      autosave : false,
      autosaveInterval : 10000,
      persistenceMethod : 'adapter',
      adapter : new jquerySyncAdapter({
        ajaxLib : $
      })
    });

  }

  return factory;
} ]);
