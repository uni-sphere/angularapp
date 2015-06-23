(function(){
  var app = angular.module('mainApp', [
    'ngAnimate',
    'templates',
    'ngResource',
    'ui.tree',
    'mainApp.directives',
    'mainApp.controllers',
    'mainApp.filters',
    'ipCookie',
    'restangular',
    'angularFileUpload',
    'angulartics',
    'angulartics.google.analytics',
    'pascalprecht.translate',
    'ngDropdowns',
    'ng-token-auth',
    'ng-rails-csrf',
    'ui.router',
    'ngMap',
    'angularSpinner',
    'ui-notification',
    'formly',
  ])
  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    RestangularProvider,
    $translateProvider,
    $authProvider,
    NotificationProvider
  ) {

    $stateProvider
    .state('main', {
      url: '/',
      abstract: true,
      templateUrl: 'main/main.html',
      controller: 'MainCtrl',
    })

      .state('main.application', {
        url: '',
        templateUrl: 'webapp/webapp.html'
      })

      // if(window.location.host == 'sandbox.unisphere.eu'){
      //   $stateProvider
      //   .state('main.dashboard', {
      //     url: 'dashboard',
      //     templateUrl: 'dashboard/one.html'
      //   })
      //   .state('main.account', {
      //     url: 'account',
      //     templateUrl: 'account/account.html'
      //   })
      // } else{
        $stateProvider
        .state('main.dashboard', {
          url: 'dashboard',
          templateUrl: 'dashboard/one.html',
          resolve: {
            auth: function($auth){
              return $auth.validateUser();
            }
          }
        })
        .state('main.account', {
          url: 'account',
          templateUrl: 'account/account.html',
          resolve: {
            auth: function($auth){
              return $auth.validateUser();
            }

          }
        })
      // }


    if(window.location.host == 'localhost:3000'){
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'main/main.html',
          controller: 'MainCtrl'
        })
    }

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    NotificationProvider.setOptions({
      delay: 10000,
      startTop: 100,
      startRight: 40,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'top'
    });

    getEnvironment = function(){
      var host = window.location.host;
      if(host == 'localhost:3000'){
        return "http://api.unisphere-dev.com:3000"
      } else{
        return "http://api.unisphere.eu"
      }
    }

    // AUTHENTICATION DEVISE
    $authProvider.configure({
      apiUrl: getEnvironment()
    });

    // Restangular
    RestangularProvider.setBaseUrl(getEnvironment());

    $translateProvider
    .translations('en', {
      HELP: 'Help',
      DROP: 'Drop a file',
      ERROR: 'Error',
      ADMINISTRATOR: 'Administrator',
      VALIDATE: 'Validate',
      ADMIN_LOGIN: 'Log in as administrator',
      NEW_SUBJECT: 'New subject',
      LEFT_TREE_EXPLANATION: 'You can directy upload your files and organise them into chapters',
      UPLOAD: 'New file',
      CHAPTER: 'New chapter',
      DROP_ZONE: 'DROP ZONE',
      DROP_EXPLANATION: 'You can even drop folders containing folders containing folders.. ',
      COLLAPSE: 'Collapse',
      DASHBOARD: 'Dashboard',
      HOME: 'Home',
      ACCOUNT: 'Account',
      SIGNOUT: 'Sign out',
      LEFT_STATISTICS: 'Your statistics: downloads in',
      RIGHT_STATISTICS: 'statistics:',
      NEW_NODE: 'This is a new node',
      NO_DOWNLOADS: 'There is no download yet',
      NEW_ORGA: 'is a new organization',
      WAIT: 'Wait one week for statistics',
      PROFIL: 'Profil',
      NAME: 'Name',
      EMAIL: 'Email',
      UPDATE_PROFIL: 'Update profil',
      ORGANIZATION: 'Organization',
      NEW_LECTURER: 'New lecturer',
      INVITE: 'Invite',
      PASSWORD: 'Password',
      OLD_PSW: 'Old Password',
      NEW_PSW: 'New Password',
      CONFIRM_PSW: 'Confirm password',
      UPDATE_PSW: 'Update password',
      USERS_INVITED: 'List of lecturers to add'
    })
    .translations('fr', {
      HELP: 'Aide',
      DROP: 'Glissez un document',
      ERROR: 'Erreur',
      ADMINISTRATOR: 'Administrateur',
      VALIDATE: 'Valider',
      ADMIN_LOGIN: 'Connection administrateur',
      NEW_SUBJECT: "Nouvelle matière",
      LEFT_TREE_EXPLANATION: 'Vous pouvez importer directement vos fichiers et les organiser dans des chapitres',
      UPLOAD: 'Nouveau fichier',
      CHAPTER: 'Nouveau chapitre',
      DROP_ZONE: 'DROP ZONE',
      DROP_EXPLANATION: "Vous pouvez importer des dossiers contenants d'autres dossiers",
      COLLAPSE: 'Réduire',
      DASHBOARD: 'Statistiques',
      HOME: 'Home',
      ACCOUNT: 'Compte',
      SIGNOUT: 'Déconnexion',
      LEFT_STATISTICS: 'Vos statistiques: consultations dans',
      RIGHT_STATISTICS: 'statistiques:',
      NEW_NODE: "C'est un nouveau new",
      NO_DOWNLOADS: "Il n'y a pas encore de document",
      NEW_ORGA: 'est une nouvelle organisation',
      WAIT: 'Attendez une semaine pour visualiser des données',
      PROFIL: 'Profile',
      NAME: 'Nom Prénom',
      EMAIL: 'Email',
      UPDATE_PROFIL: 'Modifier profile',
      ORGANIZATION: 'Organisation',
      NEW_LECTURER: 'Nouvel enseignant (email)',
      INVITE: 'Inviter un enseignant',
      PASSWORD: 'Mot de passe',
      OLD_PSW: 'Ancien mot de passe',
      NEW_PSW: 'Nouveau mot de passe',
      CONFIRM_PSW: 'Confirmation du mot de passe',
      UPDATE_PSW: 'Modifier mot de passe',
      USERS_INVITED: 'Utilisateurs ajoutés'
    })
    .preferredLanguage('en')
    .registerAvailableLanguageKeys(['fr'])
    .determinePreferredLanguage()
    .fallbackLanguage('en');

  });


  angular.module('mainApp.filters', []);
  angular.module('mainApp.controllers', []);
  angular.module('mainApp.directives', []);

  app.run(function(formlyConfig){
    formlyConfig.setType({
      name: 'default-input',
      templateUrl: 'formly/default-input.html'
    })
    formlyConfig.setType({
      name: 'email-input',
      templateUrl: 'formly/email-input.hmtl'
    })
  })

})();



