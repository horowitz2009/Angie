// Make sure to include the `ui.router` module as a dependency
angular.module('colorApp', [

    
    'common.utils.service',
	  'ui.bootstrap',
    'ui.router',
	
    'ngAnimate'
])

    .run(function ($rootScope, $state, $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
		

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                console.log('state changed from ' + fromState.name + ' to ' + toState.name);

                $("html, body").animate({ scrollTop: 0 }, 200);
                
                
                console.log("fromState:");
                console.log(fromState);
                console.log("toState:");
                console.log(toState);
                console.log("fromParams:");
                console.log(fromParams);
                console.log("toParams:");
                console.log(toParams);
                console.log("EVENT:");
                console.log(event);
                
                
                if (toState.name === 'home') {


                }

            });


    },
    ['$rootScope', '$state', '$stateParams'
    ]
)

.config(
    ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            /////////////////////////////
            // Redirects and Otherwise //
            /////////////////////////////

            // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider

                // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
                // Here we are just setting up some convenience urls.

                .when('/c?id', '/category/:id')


                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state

                .otherwise('/');


            //////////////////////////
            // State Configurations //
            //////////////////////////

            // Use $stateProvider to configure your states.
            $stateProvider
                //////////
                // Home //
                //////////
                .state("home", {

                    // Use a url of "/" to set a state as the "index".
                    url: "/",

                    data: {
                      displayName: 'Добре дошли!'
                    },

                    views: {
                        'left': {
                            templateUrl: 'app/common/left.html',
                            controller: ['$scope', 
                              function($scope) {
                                var path = "images/wow/";
                                $scope.paths = [];
                                var names = [
                                  'amber',
                                  'amberCopy',
                                  'amethyst',
                                  'antique',
                                  'aqua'
                                ];
                                for(var i = 0; i < names.length; i++) {
                                  $scope.paths.push({ 'id': names[i], 'imagePath': path + names[i] + '.jpg', 'hex': 'wait' });
                                }
                                
                                console.log("left controller executed");
                                
                                $scope.checkColor = function(path, chscope) {
                                  console.log("path: " + path.id);
                                  console.log(chscope);
                                  var el = document.getElementById(path.id);
                                  var hex = getAverageRGB(el);
                                  console.log(hex);
                                  path.hex = hex;
                                  
                                  var par = document.getElementById("par");
                                  //par.style.backgroundColor = '#' + hex;
                                  //document.body.style.backgroundColor = '#' + hex;
                                  chscope.path.urlRight = "http://chir.ag/projects/name-that-color/#" + hex;
                                  chscope.path.link2 = "http://www.perbang.dk/rgb/" + hex + "/";
                                  //$('#myframe').src = $scope.urlRight;
                                  
                                  
                                  var n_match  = ntc.name("#"+hex);
                                  chscope.n_rgb        = n_match[0]; // RGB value of closest match
                                  chscope.n_name       = n_match[1]; // Text string: Color name
                                  chscope.n_exactmatch = n_match[2]; // True if exact color match
                                
                                }
                              }
                            ]
                        },

                        'right': {
                          template: '<iframe name="myframe" ng-src="{{urlRight}}" style="width: 100%; height:100%;"></iframe>'
                        }

                    }
                    

                })
        }
    ]
).controller('MainCtrl', ['$scope', function ($scope) {
		$scope.maxx = 300;

    
    
    
    
    
    console.log("MainCtrl executed");
    }])
    
;


  
  
  
  
  function getAverageRGB(imgEl) {
    
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
        
    if (!context) {
        return defaultRGB;
    }
    
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
    context.drawImage(imgEl, 0, 0);
    
    //try {
        data = context.getImageData(0, 0, width, height);
    //} catch(e) {
        /* security error, img on diff domain */
        //alert('x');
    //    return defaultRGB;
    //}
    
    length = data.data.length;
    
    while ( (i += blockSize * 4) < length ) {
        
        var cr = data.data[i];
        var cg = data.data[i+1];
        var cb = data.data[i+2];
        if (cr < 240 && cg < 240 && cb < 240) {
          ++count;
          rgb.r += cr;
          rgb.g += cg;
          rgb.b += cb;
        }
    }
    
    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    
    
    
    
    var hex = toHex(rgb.r)+toHex(rgb.g)+toHex(rgb.b);
    console.log(hex);
    return hex;
    
  } 
  
  function toHex(number) {
    var res = number.toString(16);
    if (res.length == 1)
      res = '0'+res;
    return res;  
  }
  
