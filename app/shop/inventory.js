angular.module('felt.shop.inventory', [

])

// ////////////////////////////////////////////////////////////////////////
// INVENTORY
// ////////////////////////////////////////////////////////////////////////
.factory('Inventory', [ '$log', '$http', '$q', function($log, $http, $q) {

  $log.debug("[felt.shop.inventory Inventory]");
  var inventoryPromise = null;

  var factory = {};

  factory.getInventory = function() {
    // TODO make this to expire in a moment and take fresh data from
    // server
    if (inventoryPromise == null) {

      // DB WAY HERE
      var db = new loki('inventory', {
        persistenceMethod : 'adapter',
        adapter : new jquerySyncAdapter({
          ajaxLib : $
        })
      });

      inventoryPromise = $q(function(resolve, reject) {
        db.loadDatabase({}, function(db) {
          if (db != null && typeof (db) === "object") {
            var collection = db.getCollection('entries');

            if (collection == null) {
              $http.get("assets/inventory.json").then(function(resp) {
                var entries = resp.data.entries;
                resolve(entries);
                saveToLoki(entries);
              },

              function(resp) {
                reject(resp);
              });
            } else {
              // TODO check this later
              // catCollection.setChangesApi(true);

              resolve(collection.chain().data());
            }
            // hmm
          } else {
            reject(db);
          }
        });
      });

    }
    return inventoryPromise;
  }

  function saveToLoki(entries) {
    new loki('inventory', {
      autoload : true,
      autoloadCallback : function(db) {
        var collection = db.getCollection('entries');
        if (!collection) {
          $log.warn("inventory entries collection not found. Adding...")
          collection = db.addCollection('entries');
        }
        collection.setChangesApi(false);

        // removes all entries if any
        collection.chain().remove();

        // adds the entries
        entries.forEach(function(entry) {
          collection.insert(entry);
        });

        db.save();
        $log.debug("DONE.");
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
