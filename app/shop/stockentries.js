angular.module('felt.shop.stockentries', [

'felt.shop.service'

])

// ////////////////////////////////////////////////////////////////////////
// INVENTORY
// ////////////////////////////////////////////////////////////////////////
.factory('StockEntries', [ '$log', '$http', '$q', function($log, $http, $q) {
  var factory = {};

  factory.insert = function(params) {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/stockentries.php',
      data : {
        'c' : "insert",
        'categoryId' : params.categoryId,
        'productId' : params.productId,
        'packagingId' : params.packagingId,
        'quantity' : params.quantity,
        'onHold' : params.onHold
      }
    });
  }
  
  factory.change = function(params) {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/stockentries.php',
      data : {
        'c' : "change",
        'categoryId' : params.categoryId,
        'productId' : params.productId,
        'packagingId' : params.packagingId,
        'quantity' : params.quantity,
        'onHold' : params.onHold
      }
    });
  }
  
  factory.del = function(params) {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/stockentries.php',
      data : {
        'c' : "del",
        'categoryId' : params.categoryId,
        'productId' : params.productId,
        'packagingId' : params.packagingId
      }
    });
  }

  factory.get = function(params) {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/stockentries.php',
      data : {
        'c' : "get",
        'categoryId' : params.categoryId,
        'productId' : params.productId,
        'packagingId' : params.packagingId
      }
    });
  }
  
  factory.getAll = function() {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/stockentries.php',
      data : {
        'c' : "getAll"
      }
    });
  }

  factory.getSome = function(params) {
    return $.ajax({
      type : "POST",
      encoding : "UTF-8",
      url : 'php/stockentries.php',
      data : {
        'c' : "getSome",
        'categoryId' : params.categoryId,
        'productId' : params.productId,
        'packagingId' : params.packagingId
      }
    });
  }
  
  return factory;

} ]);
