angular.module('common.authentication', [

])

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  registrationFailed: 'auth-register-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  shopper: 'shopper',
  guest: 'guest'
})

.service('Session', function () {
  this.create = function (sessionId, userId, userRoles) {
    this.id = sessionId;//TODO session id. I don't need it
    this.userId = userId;
    console.log("SESSION CREATE: " + userId);
    this.userRoles = userRoles;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    console.log("SESSION DESTROY: " + this.userId);
    this.userRoles = null;
  };
})

.factory('AuthService', ["$http", "Session", function ($http, Session) {
  var authService = {};
 
  authService.login = function (credentials) {
    return $.ajax({
    	type : "POST",
		url : 'php/login.php',
		data: credentials,
		success: function (res) {
	               Session.create(res.id, res.email, res.roles);
                   return res;
                 },
        error: function (res) {
        	     console.log("DAMN");//TODO error. do what?
        	     console.log(res);
               }
    });
    		
  }
  
  authService.register = function (newUser) {
	  return $.ajax({
		  type : "POST",
		  url : 'php/register.php',
		  data: newUser,
		  success: function (res) {
			  //Session.create(res.id, res.email, res.roles);
			  //return res;
			  authService.login(newUser);
		  },
		  error: function (res) {
			  console.log("DAMN");//TODO error. do what?
			  console.log(res);
		  }
	  });
	  
  }
  
  authService.logout = function (logoutAll) {
    return $.ajax({
    	type : "POST",
		url : 'php/login.php',
		data: { 'logout': logoutAll },
		success: function (res) {
	               Session.destroy();
                   return res;
                 },
        error: function (res) {
        	     Session.destroy();
               }
    });
    		
  }
  
  authService.loginFromRememberMe = function () {
	  return $.ajax({
		  type : "POST",
		  data : { 'loginWithRememberMe': true },
		  url : 'php/login.php',//TODO make login.php with no credentials trying cookie way
		  success: function (res) {
              Session.create(res.id, res.email, res.roles);
			  return res;
		  },
		  error: function (res) {
			  //console.log("DAMN");//TODO error. do what? uh?
			  //console.log(res);
			  //DO NOTHING FOR NOW
		  }
	  });
	  
  }
  
  authService.isAuthenticated = function () {
	console.log("[CHECK SESSION.userID: " + Session.userId);
    return Session.userId != null && Session.userId.length > 0;
  };
  
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRoles) !== -1);//TODO user can have more than one role. fix it!
  };
  
  return authService;
}])

.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
}])

.factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', 
                             function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
}])


.controller('LoginController', ["$scope", "$rootScope", "AUTH_EVENTS", "AuthService", '$timeout',
                                function ($scope, $rootScope, AUTH_EVENTS, AuthService, $timeout) {
  
  console.log("[LOGINCTRL] start");
  
  $scope.result = ' ';
  
  $scope.credentials = {
    email: '',
    password: '',
    rememberme: true
  };
  
  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };

  //TODO do you need this in scope?
  $scope.loginFromRememberMe = function () {
    AuthService.loginFromRememberMe().then(function (user) {
  	  if (user) {
  		$scope.setCurrentUser(user);
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
  	  }
    }, function () {
         $scope.setCurrentUser(null);
         //$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
       });
  };
  
  $scope.setResult = function(msg) {
	  $scope.result = msg;
      $timeout(function(){
   	   $scope.$apply();
      }, 1);
  }
  
  $scope.reset = function () {
	  console.log(">>>reset1");
	  $scope.credentials.email = '';
	  $scope.credentials.password = '';
	  $scope.setResult(" ");
  }
  
  $scope.$on(AUTH_EVENTS.loginFailed, function(event, args) {
       console.log("LOGIN FAILED");
       //TODO what now?
       $scope.setResult('Incorrect username or password!');
	});
  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
	  console.log("LOGIN SUCCESS");
      $scope.setResult(' ');
	  $("#ModalLogin").modal('hide');
  });
  $scope.$on(AUTH_EVENTS.logoutSuccess, function(event, args) {
	  console.log("LOGOUT SUCCESS");
	  $scope.result = '';
	  $scope.credentials.email='';
	  $scope.credentials.password='';
	  $("#ModalLogin").modal('show');
  });
  
  $("#ModalLogin").on('show.bs.modal', function(){
	  $scope.reset();
  });

  
  console.log(">>>login from remember me...");
  $scope.loginFromRememberMe();
  
}])

.controller('RegisterController', ["$scope", "$rootScope", "AUTH_EVENTS", "AuthService", '$timeout',
                                function ($scope, $rootScope, AUTH_EVENTS, AuthService, $timeout) {
	
	console.log("[REGISTERCTRL] start");
	
	$scope.result = ' ';
	
	$scope.newUser = {
			email: '',
			password: '',
			password2: '',
			rememberme: true
	};
	
	$scope.register = function (newUser) {
		AuthService.register(newUser).then(function (user) {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			console.log(">>>register good. set user...");
			$scope.setCurrentUser(user);
		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.registrationFailed);
		});
	};
	
	$scope.setResult = function(msg) {
		$scope.result = msg;
		$timeout(function(){
			$scope.$apply();
		}, 1);
	}
	
	$scope.reset = function () {
		console.log(">>>reset2");
		$scope.newUser.email = '';
		console.log("USER3: " + $scope.newUser.email);
		$scope.newUser.password = '';
		$scope.newUser.password2 = '';
		$scope.setResult(" ");
	}
	
	$scope.$on(AUTH_EVENTS.registrationFailed, function(event, args) {
		console.log("Registration FAILED");
		//TODO what now?
		$scope.setResult('Registration failed!');
	});
	$scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
		console.log("LOGIN SUCCESS");
		$scope.setResult(' ');
		$("#ModalSignup").modal('hide');
	});
	
	$("#ModalSignup").on('show.bs.modal', function() {
		$scope.reset();
	});
	
}])


.directive('loginDialog', ['AUTH_EVENTS', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    template: '<div ng-if="visible" ng-include="\'common/auth/partials/login-form.html\'">',
    link: function (scope) {
      var showDialog = function () {
        scope.visible = true;
      };
  
      scope.visible = false;
      scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
      scope.$on(AUTH_EVENTS.sessionTimeout, showDialog)
    }
  };
}])


.directive('formAutofillFix', ['$timeout', function ($timeout) {
  return function (scope, element, attrs) {
    element.prop('method', 'post');
    if (attrs.ngSubmit) {//TODO check this
      $timeout(function () {
        element
          .unbind('submit')
          .bind('submit', function (event) {
            event.preventDefault();
            element
              .find('input, textarea, select')
              .trigger('input')
              .trigger('change')
              .trigger('keydown');
            scope.$apply(attrs.ngSubmit);
          });
      });
    }
  };
}])

;
