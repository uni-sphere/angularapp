(function(){
  angular.module('homeApp', [
    'ngAnimate',
    'templates',
    'ngResource',
    'ui.tree', 
    'mainApp.directives',
    'mainApp.controllers',
    'mainApp.filters',
    'restangular',
    'angularFileUpload',
    'angulartics', 
    'angulartics.google.analytics',
    'pascalprecht.translate',
    'ngDropdowns',
    'ng-token-auth',
    'ng-rails-csrf',
    'ui.router',
    'ngMap'
  ])
  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    RestangularProvider,
    $translateProvider,
    $authProvider
  ) {
      $translateProvider
        .translations('en', {
          HELP: 'Help',
          
        })
        .translations('fr', {
          HELP: 'Aide',
          DROP: 'Glissez un document',
         
          USERS_INVITED: 'Utilisateurs ajoutés'
        })
        .preferredLanguage('en')
        .registerAvailableLanguageKeys(['fr'])
        .determinePreferredLanguage()
        .fallbackLanguage('en');
      
      $stateProvider


        .state('home', {
          url: '/home',
          templateUrl: 'main/main.html',
          controller: 'MainCtrl'
        })


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
    
    //// AUTHENTICATION DEVISE
    
    $authProvider.configure({
      apiUrl: getEnvironment()
    });
    
    ////

    RestangularProvider.setBaseUrl(getEnvironment());

    // RestangularProvider.setDefaultHeaders({ 'Authorization': 'Token token=6632398822f1d84468ebde3c837338fb' });
    
    
  });

  angular.module('mainApp.filters', []);
  angular.module('mainApp.controllers', []);
  angular.module('mainApp.directives', []);

})();



