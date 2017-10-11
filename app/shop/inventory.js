angular.module('felt.shop.inventory', [

'felt.shop.service',
'common.utils.service'

])

// ////////////////////////////////////////////////////////////////////////
// INVENTORY
// ////////////////////////////////////////////////////////////////////////
.factory('InventoryService',
    [ '$log', '$http', '$q', 'ShopService', 'LokiService', function($log, $http, $q, ShopService, LokiService) {

      $log.debug("[felt.shop.inventory Inventory]");
      var packagingsPromise = null;
      var inventoryPromise = null;

      var factory = {};

      factory.getPackagings = function() {
        if (packagingsPromise == null) {
          packagingsPromise = LokiService.createDB("inventory", "packagings", "assets/inventory2.json", null);
        }
        return packagingsPromise;
      }

      factory.getInventory = function() {
        if (inventoryPromise == null) {
          inventoryPromise = LokiService.createDB("inventory", "entries", "assets/inventory2.json", function(entries) {
            // ////////////////////
            var result = [];
            var categories = ShopService.getCategoriesCached();

            categories.forEach(function(cat) {
              cat.products.forEach(function(product) {

                // is there and entry for this product?
                var entry = null;
                for (var i = 0; i < entries.length; i++) {
                  if (entries[i].categoryId === product.categoryId && entries[i].id === product.id) {
                    entry = entries[i];
                    break;
                  }
                }

                if (!entry) {
                  entry = {
                    "categoryId" : product.categoryId,
                    "id" : product.id,
                    "packagings": [{ "id": "p10", "quantity": product.quantity * 100, "onHold":0 }]
                  };
                }
                result.push(entry);

              });
            });
            return result;
          });

          // ////////////////////

        }
        return inventoryPromise;

      }

      return factory;

    } ]);
