angular.module('home.account', [

])

.service('Account', function () {
  console.log("[  6 home.service Account]");
  
  this.reset = function() {
    this.contactData = {"email" : ""};
    this.shippingData = new ShippingData();
    this.orders = [];
  }

  this.setData = function (data) {
    if(data.contactData) {
      angular.copy(data.contactData, this.contactData);
      angular.copy(data.shippingData, this.shippingData);
      angular.copy(data.orders, this.orders);
    } else {
      this.reset();
    }
  };

  this.reset();
  
})

.factory('AccountService', ["$http", "Account", function ($http, Account) {
  console.log("[ 20 home.factory AccountService]");
  var accountService = {};
  
  //LOAD ACCOUNT
  accountService.loadAccount = function(username) {
    console.log("Loading account...");
    return $.ajax({
      type : "POST",
      data : {
        'username' : username
      },
      url : 'php/load_account.php',
      success : function(res) {
        console.log("-------------========================---------------------------");
        if (res) {
          console.log("Account loaded");
          console.log(res);
          Account.setData(res);
          console.log(Account);
        }
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
        if (key === 'orders' || key === 'oldPassword' || key === 'newPassword1' || key === 'newPassword2')
          return undefined;
        return value;  
      });
    
    return $.ajax({
      type : "POST",
      encoding:"UTF-8",
      url : 'php/save_account.php',
      data : {
        'data': jsonStr, 
        'username': account.contactData.email,
        'oldPassword': account.contactData.oldPassword,
        'newPassword': account.contactData.newPassword1
        },
      success : successCallback,
      error : errorCallback
    });

  }
  
  return accountService;
}])

;//end
