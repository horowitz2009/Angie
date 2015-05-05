angular.module('felt.shop.service', [    
    
])

  .factory('ShopService', ['$http', 'utils', '$q', function ($http, utils, $q) {
    var pathCategories = 'assets/categories.json';
    var pathAllColors = 'assets/allColors.json';
    var categoriesPromise = null;
    var categories = null;
    var allColorsPromise = null;
    
    /*var jqAdapter = new jquerySyncAdapter({
      ajaxLib : $
    });*/
    
    var factory = {};
    
	
	function initializeDB(db) {
    if (db != null && typeof (db) === "object") {
		  var promise = $http.get("assets/categories.json").then(function (resp) {
          var res = resp.data.categories;
          
          saveToLoki(res);
          
          enrich(res);
          return res;
        });

      
		}		
	}

	
	
    factory.getCategories = function() {
      if (categoriesPromise == null) {
        
        //DB WAY HERE
        var db = new loki('catalog', {
          persistenceMethod : 'adapter',
          adapter : new jquerySyncAdapter({ ajaxLib : $ })
        });
        
        categoriesPromise = $q(function(resolve, reject) {
          db.loadDatabase({}, function(db) {
            if (db != null && typeof (db) === "object") {
              var categories = null;
			  if (db.listCollections().length < 2) {
		        var promise = $http.get("assets/categories.json").then(function (resp) {
                  var res = resp.data.categories;
                  saveToLoki(res);
                  enrich(res);
                  resolve(res);
                  return res;
                });

              } else {
                var catCollection = db.getCollection('categories');
                catCollection.setChangesApi(true);
                
                var productsCollection = db.getCollection('products');
                productsCollection.setChangesApi(true);
                
                var categories = catCollection.chain().data();
                for (var i = 0; i < categories.length; i++) {
                  var cat = categories[i];
                  var products = productsCollection.find({"categoryId": cat.id});
                  cat.products = products;
                }
              }
              resolve(categories);
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
        //console.log("READING " + pathAllColors + " ...");
        allColorsPromise = $http.get(pathAllColors).then(function (resp) {
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
      for(var i = 0; i < categories.length; i++) {
        items.push(
            { "name": categories[i].name,
              "id": categories[i].id,
              "cnt": categories[i].products.length
            });  
      }
      return items;
    }
    
    factory.extractOrigins = function(category) {
      var origins = [];
      if (category !== null) {
        category.products.forEach(function(p){
          var found = false;
          for (var i = 0; i < origins.length; i++) {
            if (origins[i].name === p.origin) {
              found = true;
              origins[i].cnt = origins[i].cnt + 1;
              break;
            }
          }
          
          if (!found) 
            origins.push({ "name": p.origin, 'value': false, 'cnt': 1 });
          
        });
      }
      return origins;
    }
    
    factory.extractColors = function(category) {
      var colors = [];
      
      if(category !== null)
        category.products.forEach(function(p){
          var found = false;
          for (var i = 0; i < colors.length; i++) {
            if (colors[i].name === p.color) {
              found = true;
              colors[i].cnt = colors[i].cnt + 1;
              break;
            }
          }
          
          if (!found) 
            colors.push({ "name": p.color, 'value': false, 'cnt': 1 });
        });
      
      return colors;
    }
    
    //PSEUDO-PRIVATE METHODS
    function enrich(categories) {
      if (categories) {
        categories.forEach(function (cat) {
          for(var i = 0; i < cat.products.length; i++) {
            var p = cat.products[i];
            if (!p.categoryId)
              p.categoryId = cat.id;
            if (!p.fullId) 
              p.fullId = p.categoryId + '-' + p.id;
          }
        });
      }
    }

	
    function saveToLoki(categories) {
      new loki('catalog', {
        autoload : true,
        autoloadCallback : function(db) {
          
          console.log('collections: ');
          console.log(db.listCollections());
          
          var catCollection = db.getCollection('categories');
          if (!catCollection) {
            console.log("categories collection not found. Adding...")
            catCollection = db.addCollection('categories');
          }
          catCollection.setChangesApi(false);
          
          var productsCollection = db.getCollection('products');
          if (!productsCollection) {
            console.log("products collection not found. Adding...")
            productsCollection = db.addCollection('products');
          }
          productsCollection.setChangesApi(true);
          
          for (var i = 0; i < categories.length; i++) {
            var cat = categories[i];
            
            var newCat = JSON.parse(JSON.stringify(cat, 
                function(key, value) {
                  if (key == "products")
                    return undefined;
                  return value;
                }));
            console.log(newCat)
            catCollection.insert(newCat);
            
            //now the products
            for (var j = 0; j < cat.products.length; j++) {
              var product = cat.products[j];
              product.categoryId = cat.id;
              productsCollection.insert(product);
            }
            
          }
          
          db.save();
          console.log("DONE.");
        },
        autosave : false,
        autosaveInterval : 10000,
        persistenceMethod : 'adapter',
        adapter : jqAdapter
      });


    }

    
    
    return factory;
  }]);
  
  
  

  