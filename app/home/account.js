angular.module('home.account', [

])

.service('Account', function () {
  console.log("[  6 home.service Account]");
  
  this.contactData = {"email" : ""};
  this.shippingData = new ShippingData();
  this.orders = [];

  this.reset = function() {
    this.contactData = {"email" : ""};
    this.shippingData.reset();
    this.orders = [];
  }

  this.setEmail = function(email) {
    this.contactData.email = email;
  }

  this.getEmail = function() {
    return this.contactData.email;
  }

  this.setData = function (data, username) {
    if(data.contactData) {
      angular.copy(data.contactData, this.contactData);
      angular.copy(data.shippingData, this.shippingData);
      angular.copy(data.orders, this.orders);
    } else {
      this.reset();
      this.setEmail(username);
    }
  };
  
})

.factory('AccountService', ["$http", "Account", 'Session', function ($http, Account, Session) {
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
          Account.setData(res, username);
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
  
  //SAVE ACCOUNT
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
        'oldUsername': Session.userId,
        'oldPassword': account.contactData.oldPassword,
        'newPassword': account.contactData.newPassword1
        },
      success : successCallback,
      error : errorCallback
    });

  }
  
  //SAVE ACCOUNT
  accountService.saveNewAccount = function(account, successCallback, errorCallback) {
    console.log("Saving new account " + account);
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
        'newAccount': true,
        'newPassword': account.contactData.newPassword1
      },
      success : successCallback,
      error : errorCallback
    });
    
  }
  
  accountService.reset = function() {
    Account.reset();
  }
  
  return accountService;
}])

;//end
