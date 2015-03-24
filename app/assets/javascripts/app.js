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
    'ngWebsocket'
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
          nodes: function(Restangular){
            // console.log(Restangular.one('nodes').get())
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

    RestangularProvider.setBaseUrl('api');
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
  

  angular.module('d3', []);
  angular.module('myApp.filters', []);
  angular.module('myApp.controllers', []);
  angular.module('myApp.directives', ['d3']);
})();