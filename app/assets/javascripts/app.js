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
    'angulartics.google.analytics',
    'pascalprecht.translate',
		'ngDropdowns',
		'Devise'
  ])
  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    RestangularProvider,
    $translateProvider,
		AuthProvider
  ) {
				
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
          DROP_EXPLANATION: 'You can even drop folders containing folders containing folders',
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
					NAME: 'Name Firstname',
					EMAIL: 'Email',
					UPDATE_PROFIL: 'Update profil',
					ORGANIZATION: 'Organization',
					NEW_LECTURER: 'New lecturer (email)',
					INVITE: 'Invite lecturers',
					PASSWORD: 'Password',
					OLD_PSW: 'Old Password',
					NEW_PSW: 'New Password',
					CONFIRME_PSW: 'Confirm',
					UPDATE_PSW: 'Update password',
					USERS_INVITED: 'Users added'
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
					CONFIRME_PSW: 'Confirmation',
					UPDATE_PSW: 'Modifier mot de passe',
					USERS_INVITED: 'Utilisateurs ajoutés'
        })
        .preferredLanguage('en')
				.registerAvailableLanguageKeys(['fr'])
			  .determinePreferredLanguage()
			  .fallbackLanguage('en');
      
      $stateProvider

        .state('main', {
          url: '/',
          abstract: true,
          templateUrl: 'main/main.html',
          controller: 'MainCtrl',
        })

          .state('main.application', {
              url: '',
              templateUrl: 'application/application.html'
          })
          .state('main.dashboard', {
              url: 'dashboard',
              templateUrl: 'dashboard/one.html'
          })
          .state('main.account', {
              url: 'account',
              templateUrl: 'account/account.html'
          })

        .state('home', {
          url: '/home',
          templateUrl: 'main/main.html',
          controller: 'MainCtrl',
          resolve: {
            nodesflat: function(Restangular){
              return Restangular.one('nodes').get();
            }
          }
        })

       // .state('dashboard', {
       //    // abstract: true,
       //    url: '/dashboard',
       //    templateUrl: 'dashboard/layout.html'
       //  })
          
       //    // the default route when someone hits dashboard
       //    .state('dashboard.one', {
       //        url: '',
       //        templateUrl: 'dashboard/one.html'
       //    })
       //    // this is /dashboard/two
       //    .state('dashboard.two', {
       //        url: '/two',
       //        templateUrl: 'dashboard/two.html'
       //    })
       //    // this is /dashboard/three
       //    .state('dashboard.three', {
       //        url: '/three',
       //        templateUrl: 'dashboard/three.html'
       //    });

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
		
		// Customize login
		AuthProvider.loginPath(getEnvironment() + '/users/sign_in.json');

		// Customize logout
		AuthProvider.logoutPath(getEnvironment() + '/users/sign_out.json');

		// Customize register
		AuthProvider.registerPath(getEnvironment() + '/users.json');
		
	  ////

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



