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
    'ui-notification'
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
    (function initRoute(){
      if(window.location.host == "admin.unisphere.eu" || window.location.host == "admin.dev.unisphere.eu"){
        $stateProvider
        .state('admin', {
          url: '/',
          templateUrl: 'admin/admin.html',
        })
      } else {
        $stateProvider
        .state('main', {
          url: '/',
          abstract: true,
          templateUrl: 'main/main.html',
          controller: 'MainCtrl',
        })

        .state('admin', {
          url: '/admin',
          templateUrl: 'admin/admin.html',
        })

        .state('main.application', {
          url: '',
          templateUrl: 'webapp/webapp.html'
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

        .state('main.superadmin', {
          url: 'superadmin',
          templateUrl: 'superadmin/superadmin.html',
          resolve: {
            auth: function($auth){
              return $auth.validateUser();
            }
          }
        })


        if(window.location.host == "sandbox.unisphere.eu"){
          $stateProvider.state('main.dashboard', {
            url: 'dashboard',
            templateUrl: 'dashboard/one.html',
          })
        } else{
          $stateProvider.state('main.dashboard', {
            url: 'dashboard',
            templateUrl: 'dashboard/one.html',
            resolve: {
              auth: function($auth){
                return $auth.validateUser();
              }
            }
          })
        }
      }

      if(window.location.host == 'localhost:3000'){
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'main/main.html',
            controller: 'MainCtrl'
          })
      }

      $urlRouterProvider.otherwise('/');

      $locationProvider.html5Mode(true);
    })();

    NotificationProvider.setOptions({
      delay: 5000,
      startTop: 100,
      startRight: 40,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'top'
    });

    function getEnvironment(){
      var host = window.location.host;
      if(host == 'localhost:3000'){
        return "http://api.unisphere-dev.com:3000"
      } else if(host.indexOf('dev.') > -1){
        return "http://apidev.unisphere.eu"
      } else{
        return "http://api.unisphere.eu"
      }
    }

    $authProvider.configure({
      apiUrl: getEnvironment()
    });

    RestangularProvider
      .setBaseUrl(getEnvironment())
      .setDefaultHeaders({ 'Authorization': 'Token token=ce76e09ea8191a3b5410dbf033cf23ad' });

    (function initTranslation(){
      $translateProvider
      .useSanitizeValueStrategy(null)
      .translations('en', {
        HELP: 'Help',
        DROP: 'Drop zone',
        ERROR: 'Error',
        ADMINISTRATOR: 'Administrator',
        VALIDATE: 'Validate',
        ADMIN_LOGIN: 'Log in as administrator',
        NEW_SUBJECT: 'No document has been uploaded',
        LEFT_TREE_EXPLANATION: 'You can directy upload your files and organise them into chapters.',
        UPLOAD: 'Upload a file',
        CHAPTER: 'New chapter',
        DROP_ZONE: 'DROP ZONE',
        DROP_EXPLANATION: 'Tip:  You can even drop folders containing folders',
        DROP_COMMENT: "You can drag & drop files ",
        COLLAPSE: 'Collapse',
        DASHBOARD: 'Dashboard',
        HOME: 'Home',
        ACCOUNT: 'Account',
        SIGNOUT: 'Sign out',
        LEFT_STATISTICS: 'Your statistics: downloads in',
        RIGHT_STATISTICS: 'statistics',
        NEW_NODE: ' is a new node',
        NO_DOWNLOADS: 'There is no downloads yet',
        NEW_ORGA: ' is a new organization',
        WAIT: 'Wait one week for statistics',
        PROFIL: 'Profile',
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
        USERS_INVITED: 'Lecturers to add',
        TIP_CHROME: 'Tip: You can drag & drop folders!',
        TIP: 'Tip: You can drag & drop files (folders only on Google Chrome!)',
        LENGTH: 'At least 6 characters',
        SECURITY: 'Security',
        SHORT: 'too short',
        LECTURERS: 'Lecturers',
        SELECT_LEAF: 'Select a leaf node',
        DROP_FILE: "Upload data",
        WHERE_DROP: "Where do you want to drop your data?",
        ROOT: "0. Root",
        CANCEL: "Cancel"
      })
      .translations('fr', {
        HELP: 'Aide',
        DROP: 'Glissez un document',
        ERROR: 'Erreur',
        ADMINISTRATOR: 'Administrateur',
        VALIDATE: 'Valider',
        ADMIN_LOGIN: 'Connection administrateur',
        NEW_SUBJECT: "Ajouter des dossiers et des documents",
        LEFT_TREE_EXPLANATION: 'Vous pouvez importer directement vos fichiers et les organiser dans des chapitres.',
        UPLOAD: 'Nouveau fichier',
        CHAPTER: 'Nouveau chapitre',
        DROP_ZONE: 'DROP ZONE',
        DROP_EXPLANATION: "Vous pouvez importer des dossiers contenants d'autres dossiers.",
        DROP_COMMENT: "Vous pouvez glisser des fichiers dans cette zone ",
        COLLAPSE: 'Réduire',
        DASHBOARD: 'Statistiques',
        HOME: 'Home',
        ACCOUNT: 'Compte',
        SIGNOUT: 'Déconnexion',
        LEFT_STATISTICS: 'Vos statistiques: consultations dans',
        RIGHT_STATISTICS: 'statistiques',
        NEW_NODE: " est un nouveau noeud",
        NO_DOWNLOADS: "Il n'y a pas encore de documents",
        NEW_ORGA: ' est une nouvelle organisation',
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
        USERS_INVITED: 'Utilisateurs ajoutés',
        TIP_CHROME: 'Astuce: Vous pouvez clicker glisser des documents',
        TIP: 'Astuce: Vous pouvez clicker glisser des documents (et des dossiers avec Google Chrome!)',
        LENGTH: 'Au minimum 6 charactères',
        SECURITY: 'Sécurité',
        SHORT: 'trop court',
        LECTURERS: 'Enseignants',
        NO_DOC: "Sélectionnez une extrémité de l'arbre",
        DROP_FILE: "Importez vos données",
        WHERE_DROP: "Où souhaitez vous les importer?",
        ROOT: "0. Racine",
        CANCEL: "Annuler"

      })
      .preferredLanguage('en')
      .registerAvailableLanguageKeys(['fr'])
      .determinePreferredLanguage()
      .fallbackLanguage('en');
    })();

  });

  angular.module('mainApp.filters', []);
  angular.module('mainApp.controllers', []);
  angular.module('mainApp.directives', []);
  angular.module('mainApp.services', []);

})();



