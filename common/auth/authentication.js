angular.module('common.authentication', [

])

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  resetPasswordSuccess: 'reset-password-success',
  resetPasswordFailed: 'reset-password-failed',
  loginFromRememberMeFailed: 'auth-login-from-rememberme-failed',
  registrationSuccess: 'auth-register-success',
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
  console.log("[ 23 auth.service Session]");
  this.create = function (sessionId, userId, userRoles) {
    this.id = sessionId;//TODO session id. I don't need it
    this.userId = userId;
    console.log("SESSION CREATE: " + userId);
    this.userRoles = userRoles;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = "guest";
    console.log("SESSION DESTROY: " + this.userId);
    this.userRoles = null;
  };
})

.factory('AuthService', ["$http", "$rootScope", "Session", 'AUTH_EVENTS', function ($http, $rootScope, Session, AUTH_EVENTS) {
  console.log("[ 39 auth.factory AuthService]");
  var authService = {};
  
  Session.create("", "guest", "guest");
  
  //LOGIN
  authService.login = function(credentials) {
    return $.ajax({
      type : "POST",
      url : 'php/login.php',
      data : credentials,
      success : function(res) {
        if (res && res.email) {
          Session.create(res.id, res.email, res.roles);
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, res);
        }
        return res;
      },
      error : function(res) {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed, null);
      }
    });

  }
  
  //RESET PASSWORD
  authService.resetPassword = function(credentials) {
    return $.ajax({
      type : "POST",
      url : 'php/login.php',
      data : {
        'resetPassword' : true,
        'email' : credentials.email
        },
      success : function(res) {
        $rootScope.$broadcast(AUTH_EVENTS.resetPasswordSuccess, null);
        return res;
      },
      error : function(res) {
        $rootScope.$broadcast(AUTH_EVENTS.resetPasswordFailed, null);
      }
    });
    
  }
  
  //REGISTER
  authService.register = function(newUser) {
    return $.ajax({
      type : "POST",
      url : 'php/register.php',
      data : newUser,
      success : function(res) {
        $rootScope.$broadcast(AUTH_EVENTS.registrationSuccess, newUser);
      },
      error : function(res) {
        console.log("Register failed");
        console.log(res);
        $rootScope.$broadcast(AUTH_EVENTS.registrationFailed, res);
      }
    });

  }
  
  //LOGOUT
  authService.logout = function(logoutAll) {
    return $.ajax({
      type : "POST",
      url : 'php/login.php',
      data : {
        'logout' : logoutAll
      },
      success : function(res) {
        Session.destroy();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        return res;
      },
      error : function(res) {
        Session.destroy();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      }
    });

  }
  
  //LOGIN FROM REMEMBER ME
  authService.loginFromRememberMe = function(asynchro) {
    return $.ajax({
      async: asynchro,
      type : "POST",
      data : {
        'loginWithRememberMe' : true
      },
      url : 'php/login.php',
      success : function(res) {
        if (res && res.email) {
          Session.create(res.id, res.email, res.roles);
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, res);
        }
        return res;
      },
      error : function(res) {
        console.log("login from remember me failed");
        Session.create("", "guest", "guest");
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed, res);
        return res;
      }
    });

  }
  
  authService.isAuthenticated = function () {//TODO in my case it's always authenticated: guest or logged
	  console.log("[CHECK SESSION.userID: " + Session.userId);
    return Session.userId != null && Session.userId.length > 0;
  };
  
  authService.isGuest = function () {
    return Session.userId === 'guest';
  };
  
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRoles) !== -1);//TODO user can have more than one role. fix it!
  };
  
  authService.getUsername = function() {
    return Session.userId;
  }
  
  authService.getSession = function() {
    return Session;
  }
  
  return authService;
}])

.config(['$httpProvider', function ($httpProvider) {
  console.log("[160 auth.config]");
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
}])

.factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', 
                             function ($rootScope, $q, AUTH_EVENTS) {
  console.log("[171 auth.factory AuthInterceptor]");
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
  
  console.log("[189 auth.controller LoginController]");
  $scope.result = ' ';
  $scope.initial = true;
  $scope.success = false;
  $scope.send = "Изпрати";
  
  $scope.credentials = {
    email: '',
    password: '',
    rememberme: true
  };
  
  $scope.login = function (credentials) {
    AuthService.login(credentials);
  };
  
  $scope.resetPassword = function (credentials) {
    //$scope.$apply(function(){
      $scope.success = false;
      $scope.result = ' ';
      AuthService.resetPassword(credentials);
    //});
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
	  $scope.send = "Изпрати";
	  $scope.success = false;
	  
  }
  
  $scope.$on(AUTH_EVENTS.loginFailed, function(event, args) {
    $scope.setResult('Incorrect username or password!');
	});
  
  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, args) {
    $scope.setResult(' ');
	  $("#ModalLogin").modal('hide');
  });
  
  $scope.$on(AUTH_EVENTS.logoutSuccess, function(event, args) {
	  $scope.result = '';
	  $scope.credentials.email='';
	  $scope.credentials.password='';
	  $("#ModalLogin").modal('show');
  });
  
  $scope.$on(AUTH_EVENTS.resetPasswordSuccess, function(event, args) {
  	$scope.$apply(function() {
      $scope.success = true;
      $scope.result = 'Новата Ви парола е пратена на указания имейл. ';
      /////След като влезете в профила си, ще можете да я смените с предпочетена от Вас парола.
      
      //$scope.footerSuccess = 'Не сте получили имейл?';
      $scope.send = "Изпрати пак";
  	});
  });
  
  $scope.$on(AUTH_EVENTS.resetPasswordFailed, function(event, args) {
  	$scope.$apply(function() {
  	  $scope.success = false;
      $scope.result = 'Акаунт с този имейл не бе намерен!';
      $scope.send = "Изпрати";
  	});
    
  });
  
  
  
  
  $("#ModalLogin").on('show.bs.modal', function(){
	  $scope.reset();
  });

}])

.controller('RegisterController', ["$scope", "$rootScope", "AUTH_EVENTS", "AuthService", '$timeout',
                                function ($scope, $rootScope, AUTH_EVENTS, AuthService, $timeout) {
  console.log("[231 auth.controller RegisterController]");
	
	$scope.result = ' ';
	
	$scope.newUser = {
			email: '',
			password: '',
			password2: '',
			rememberme: true
	};
	
	$scope.register = function (newUser) {
	  $scope.setResult(' ');
	  AuthService.register(newUser);
	}
//		AuthService.register(newUser).then(function (user) {
//		  console.log("Registration successful. Now login...");
//		  
//	    AuthService.login(newUser);
//
//		}, function () {
//			$rootScope.$broadcast(AUTH_EVENTS.registrationFailed);
//		});
//	};
	
	$scope.$on(AUTH_EVENTS.registrationSuccess, function(event, args) {
	  AuthService.login(args);
	});
	
	$scope.$on(AUTH_EVENTS.registrationFailed, function(event, args) {
      $scope.setResult(args.statusText);
	});


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
