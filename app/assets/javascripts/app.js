(function(){
  angular.module('myApp', ['ngAnimate','ui.router','templates']).config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
   
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home.html',
        controller: 'HomeCtrl',
        resolve: {
          chapters: ['$http', function($http){
            return $http.get('api/chapters.json').then(function(response){
              return response.data;
            })
          }]
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
  });
})();