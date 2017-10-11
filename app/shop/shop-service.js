angular.module('felt.shop.service', [
    'common.utils.service'
])

.factory('ShopService', [ '$http', 'utils', '$q', 'LokiService', function($http, utils, $q, LokiService) {
  console.log("[  6 shop-service.factory ShopService]");
  var pathCategories = 'assets/categories.json';
  var pathAllColors = 'assets/colorGroups.json';
  var categoriesPromise = null;
  var categoriesPromise2 = null;
  var categories = null;
  var allColorsPromise = null;

  /*
   * var jqAdapter = new jquerySyncAdapter({ ajaxLib : $ });
   */

  var factory = { categories: [] };

  factory.getCategoriesCached = function() {
    return factory.categories;
  }
  
  factory.catalog = LokiService.db;

  factory.loadCatalog = function() {
    if (categoriesPromise2 == null) {
      categoriesPromise2 = LokiService.loadDB(LokiService.db, "categories", "assets/categories.json", function(cats, db) {
        
        var coll = db.getCollection("categories");
        var pcdv = coll.getDynamicView("publishedCategories");
        if (!pcdv) {
          pcdv = coll.addDynamicView("publishedCategories", true);
        }
        pcdv.applyFind({"published": true});
        pcdv.applySimpleSort("position");
        
        var products = [];
        if (cats) {
          cats.forEach(function(cat) {
            var productsCol = db.getCollection("products");
            if (!productsCol) {
              productsCol = db.addCollection("products");
            }
            var ppdv = productsCol.getDynamicView("publishedProducts");
            if (!ppdv) {
              ppdv = productsCol.addDynamicView("publishedProducts", true);
            }
            ppdv.applyFind({"published": true});
            ppdv.applySimpleSort("position");

            var pos = cat.position * 1000;
            cat.products.forEach(function(p) {
              if (!p.categoryId)
                p.categoryId = cat.id;

              if (!p.weight)
                p.weight = p.quantity;
              
              p.position = ++pos;
              productsCol.insert(p);
              
            });
            cat.products = undefined;
          });
        }
        return cats;
      });
    }
    return categoriesPromise2;

  }
  
  factory.getPublishedCategories = function() {
    return factory.catalog.getCollection("categories").getDynamicView("publishedCategories").data();
  }
  
  factory.getPublishedProducts = function(categoryId) {
    return factory.getPublishedProductsRS(categoryId).data();
  }
  
  factory.getPublishedProductsRS = function(categoryId) {
    return factory.catalog.getCollection("products").getDynamicView("publishedProducts").branchResultset().find({"categoryId":categoryId});
  }
  /**
   * @deprecated
   * 
   */
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
                factory.categories = cats;
                
                catCollection = db.getCollection('categories');
                var hmm = catCollection.chain().find( { "published" : true }).simplesort("position").data();
                resolve(hmm);
              },

              function(resp) {
                reject(resp);
              });
            } else {
              // TODO check this later
              // catCollection.setChangesApi(true);
              factory.categories = catCollection.chain().data();
              var hmm = catCollection.chain().find( { "published" : true }).simplesort("position").data();
              resolve(hmm);
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

  factory.extractCatMenuItems = function() {
    var categories = factory.getPublishedCategories();
    var items = [];
    for (var i = 0; i < categories.length; i++) {
      items.push({
        "name" : categories[i].name,
        "id" : categories[i].id,
        "cnt" : factory.getPublishedProducts(categories[i].id).length
      });
    }
    return items;
  }

  factory.extractOrigins = function(categoryId, products) {
    var origins = [];
    if (!products) {
      products = factory.getPublishedProducts(categoryId);
    }
    products.forEach(function(p) {
      var found = false;
      for (var i = 0; i < origins.length; i++) {
        if (origins[i].id === p.origin) {
          found = true;
          origins[i].cnt = origins[i].cnt + 1;
          break;
        }
      }

      if (!found && p.origin)
        origins.push({
          "id" : p.origin,
          'value' : false,
          'cnt' : 1
        });

    });
    return origins;
  }
  
  //TODO refactor this: colorGroups: fix it outside once!
  factory.extractColors = function(categoryId, colorGroups, products) {
    if (!products) {
      products = factory.getPublishedProducts(categoryId);
    }
    var colors = angular.copy(colorGroups);
    for (var i = 0; i < colors.length; i++) {
      colors[i].cnt = 0;
      delete colors[i].colors;
      colors[i].value = false;
    }
    var globalCnt = 0;
    products.forEach(function(p) {
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
