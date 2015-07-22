angular.module('home.account', [

])

.service('Account', function () {
  console.log("[  6 home.service Account]");
  
  this.contactData = {"email" : "guest"};
  this.shippingData = new ShippingData();
  this.orders = [];
  
  this.setData = function (data) {
    //this.data = data;//TODO parse it
    if(data.contactData)
      angular.copy(data, this);
  };
  
})

.factory('AccountService', ["$http", "Account", function ($http, Account) {
  console.log("[ 39 home.factory AccountService]");
  var accountService = {};
  
  //LOAD ACCOUNT
  accountService.loadAccount = function(username) {
    return $.ajax({
      type : "POST",
      data : {
        'username' : username
      },
      url : 'php/load_account.php',
      success : function(res) {
        if (res)
          Account.setData(res);
        return Account;
      },
      error : function(res) {
        console.log("loading account failed");// TODO error. do what? uh?
        return null;
      }
    });

  }
  
  //LOAD ACCOUNT
  accountService.saveAccount = function(account, successCallback, errorCallback) {
    console.log("Saving account " + account);
    var jsonStr = JSON.stringify(account, function(key, value) {
        if (key === 'orders')
          return null;
        return value;  
      });
    
    return $.ajax({
      type : "POST",
      encoding:"UTF-8",
      url : 'php/save_account.php',
      data : { 'data': jsonStr, 'username': account.contactData.email },
      success : successCallback,
      error : errorCallback
    });

  }
  
  return accountService;
}])

;//end
