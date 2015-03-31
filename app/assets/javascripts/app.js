(function(){
  angular.module('myApp', [
    'ngAnimate',
    'ui.router',
    'templates',
    'ngResource',
    'ui.tree', 
    'myApp.directives',
    'myApp.controllers',
    'myApp.filters',
    'ngCookies',
    'restangular',
    'angularFileUpload',
    'ngDialog'
  ])
  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    RestangularProvider
  ) {


    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home.html',
        controller: 'HomeCtrl',
        resolve: {
          // nodes: ['Nodes', function(Nodes){
          //   return Nodes.get().then(function(response) {
          //     return response.data;
          //     // console.log(response.data);
          //   });
          // }]
          nodesflat: function(Restangular){
            return Restangular.one('nodes').get();
          }//,
          // documents: function(Restangular){
          //   return Restangular.one('awsdocuments').get({client_token: "6632398822f1d84468ebde3c837338fb"});
          // }
        }
      })
      
     .state('dashboard', {
        abstract: true,
        url: '/dashboard',
        templateUrl: 'dashboard/layout.html'
      })
        // the default route when someone hits dashboard
        .state('dashboard.one', {
            url: '',
            templateUrl: 'dashboard/one.html'
        })
        // this is /dashboard/two
        .state('dashboard.two', {
            url: '/two',
            templateUrl: 'dashboard/two.html'
        })
        // this is /dashboard/three
        .state('dashboard.three', {
            url: '/three',
            templateUrl: 'dashboard/three.html'
        });

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    // var _environments = {
    //   local: {
    //     host: 'localhost:3000',
    //     config: {
    //       apiroot: 'http://api.unisphere-dev.com:3000'
    //     }
    //   },
    //   dev: {
    //     host: 'dev.com',
    //     config: {
    //       apiroot: 'http://eventphoto.dev/app_dev.php'
    //     }
    //   },
    //   prod: {
    //     host: 'angularapp.scalingo.eu',
    //     config: {
    //       apiroot: 'http://api.unisphere.eu'
    //     }
    //   }
    // },
    // _environment;

    // getEnvironment = function(){
    //   var host = window.location.host;
    //   // console.log(host);

    //   if(_environment){
    //     return _environment;
    //   }

    //   for(var environment in _environments){
    //     if(typeof _environments[environment].host && _environments[environment].host == host){
    //       _environment = environment;
    //       return _environment;
    //     }
    //   }

    //   return null;
    // }


    getEnvironment = function(){
      var host = window.location.host;
      if(host == 'localhost:3000'){
        return "http://api.unisphere-dev.com:3000"
      } else{
        return "http://api.unisphere.eu"
      }
    }

    // console.log(_environments[this.getEnvironment()]);
    // console.log(_environments[this.getEnvironment()].config.apiroot);
    // console.log(_environments[this.getEnvironment().config]);
    // get: function(property){
    //   return _environments[this.getEnvironment()].config[property];
    // }

    // console.log(getEnvironment());

    // Usage inside controller
    // Config.get('apiroot');

    // RestangularProvider.setDefaultHeaders({
    // 'Content-Type': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest'
    // });
    // RestangularProvider.setDefaultHttpFields({
    //     'withCredentials': true
    // });
    // RestangularProvider.BaseUrl('http://localhost:8080/');
    // RestangularProvider.setBaseUrl(_environments[this.getEnvironment()].config.apiroot);
    RestangularProvider.setBaseUrl(getEnvironment());

    // RestangularProvider.setDefaultHeaders({token: '6632398822f1d84468ebde3c837338fb' });
		
    RestangularProvider.setRequestInterceptor(function(element, operation, route, url) {

      // // SEND WHOLE TREE
      // function deleteAttributes(d){
      //   delete d.x0;
      //   delete d.y0;
      //   delete d.x;
      //   delete d.y;
      //   delete d._children;
      //   delete d.parent;
      //   delete d.depth;
      //   delete d.id;
      //   if(d.children){
      //     d.children.forEach(deleteAttributes);
      //   }
      // }

      // if(operation == "put" || operation == "post"){
      //   deleteAttributes(element);
      // }

      return element;
    });
    // RestangularProvider.setParentless(['api/nodes','nodes']);
  });
  







    // angular.module('d3', []);
  angular.module('myApp.filters', []);
  angular.module('myApp.controllers', []);
  angular.module('myApp.directives', []);






  // var _environments = {
  //   local: {
  //     host: ['l', 'localhost'],
  //     config: {
  //       api_endpoint: '/api/v1',
  //       node_url: 'http://localhost:9998'
  //     }
  //   },
  //   test: {
  //     host: ['test.domain.com', 'beta.domain.com'],
  //     config: {
  //       api_endpoint: '/api/v1',
  //       node_url: 'http://domain.com:9998'
  //     }
  //   },
  //   prod: {
  //     host: 'domain.com',
  //     config: {
  //       api_endpoint: '/api/v1',
  //       node_url: 'http://domain.com:9998'
  //     }
  //   }
  // }, _environment;

  // this.getEnvironment = function (){
  //   var host = window.location.host;
  //   if (_environment) {
  //     return _environment;
  //   }
  //   for (var environment in _environments){
  //     if (typeof(_environments[environment].host) && typeof(_environments[environment].host) == 'object') {
  //       if (_environments[environment].host.indexOf(host) >= 0) {
  //         _environment = environment;
  //         return _environment;
  //       }
  //     } else {
  //       if (typeof(_environments[environment].host) && _environments[environment].host == host) {
  //         _environment = environment;
  //         return _environment;
  //       }
  //     }
  //   }
  //   return null;
  // };
  // this.get = function (property) {
  //   return _environments[this.getEnvironment()].config[property];
  // }; 


})();