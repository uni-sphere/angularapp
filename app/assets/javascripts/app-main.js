(function(){
  angular.module('mainApp', [
    'ngAnimate',
    'ui.router',
    'templates',
    'ngResource',
    'ui.tree', 
    'mainApp.directives',
    'mainApp.controllers',
    'mainApp.filters',
    'ngCookies',
    'restangular',
    'angularFileUpload',
    'ngDialog',
    'angulartics', 
    'angulartics.google.analytics'
  ])
  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    RestangularProvider
  ) {
    
      $stateProvider

        .state('main', {
          url: '/',
          templateUrl: 'main/layout.html',
          controller: 'MainCtrl',
          resolve: {
            nodesflat: function(Restangular){
              return Restangular.one('nodes').get();
            }
          }
        })

        .state('home', {
          url: '/home',
          templateUrl: 'main/layout.html',
          controller: 'MainCtrl',
          resolve: {
            nodesflat: function(Restangular){
              return Restangular.one('nodes').get();
            }
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

    getEnvironment = function(){
      var host = window.location.host;
      if(host == 'localhost:3000'){
        return "http://api.unisphere-dev.com:3000"
      } else{
        return "http://api.unisphere.eu"
      }
    }

    RestangularProvider.setBaseUrl(getEnvironment());

    RestangularProvider.setDefaultHeaders({ 'Authorization': 'Token token=6632398822f1d84468ebde3c837338fb' });
    
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
  });

  angular.module('mainApp.filters', []);
  angular.module('mainApp.controllers', []);
  angular.module('mainApp.directives', []);

})();



