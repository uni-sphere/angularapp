(function(){

angular
  .module('mainApp', [
    'ngAnimate',
    'templates',
    'ngResource',
    'ui.tree',
    'mainApp.directives',
    'mainApp.controllers',
    'mainApp.filters',
    'mainApp.services',
    'ipCookie',
    'restangular',
    'angularFileUpload',
    'angulartics',
    'pascalprecht.translate',
    'ngDropdowns',
    'ng-token-auth',
    'ng-rails-csrf',
    'ui.router',
    'ngMap',
    'angularSpinner',
    'ui-notification',
    'angularModalService'
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

    configureRoute()
    configureTranslation()
    configureNotifications()
    configureAuth()
    configureRestangular()

    function configureRoute(){
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
              // if(window.location.host == 'localhost:3000' || window.location.host == 'www.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.pathname == '/home' || window.location.host == 'www.sandbox.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.host == 'sandbox.unisphere.eu' || window.location.host == 'sandbox.dev.unisphere.eu'){
              //   return true
              // } else{
                return $auth.validateUser();
              // }
            }
          }
        })

        .state('view', {
          url: '/view',
          abstract: true,
          templateUrl: 'restrainview/restrainview.html',
          controller: 'RestrainCtrl',
        })

        .state('view.chapters', {
          url: '/chapters/{id:int}',
          templateUrl: 'restrainview/chapters.html',
          controller: 'restrainViewChaptersCtrl',
          resolve:{
            chapter_id: ['$stateParams', function($stateParams){
              return $stateParams.id;
            }]
          }
        })

        .state('view.documents', {
          url: '/documents/{id:int}',
          templateUrl: 'restrainview/documents.html',
          controller: 'DocumentsCtrl',
          resolve:{
            document_id: ['$stateParams', function($stateParams){
              return $stateParams.id;
            }]
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


        if(window.location.host == "sandbox.unisphere.eu" || window.location.host == "sandbox.dev.unisphere.eu" || window.location.host == "www.sandbox.unisphere.eu"){
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
    }

    function configureTranslation(){
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
        TIP_CHROME: 'Tip: You can drag & drop files and folders!',
        TIP: 'Tip: You can drag & drop files! (folder on Chrome)',
        LENGTH: 'At least 6 characters',
        SECURITY: 'Security',
        SHORT: 'too short',
        LECTURERS: 'Lecturers',
        SELECT_LEAF: 'Select a leaf node',
        DROP_FILE: "Upload data",
        WHERE_DROP: "Where do you want to drop your data?",
        ROOT: "0. Root",
        CANCEL: "Cancel",
        NODE_LOCKED: "This node is locked. File downloads is protected by a password.",
        NODE_UNLOCKED: "This node is unlocked. Anyone can download its content.",
        POPUP_VIEW_FILE: 'View a file',
        POPUP_VIEW_FILE_CHOICES: 'You can choose to download the file or to preview it.',
        POPUP_VIEW_DL: 'Download the file',
        POPUP_VIEW_PW: 'Preview the file',
        POPUP_DELETE_NODE: 'Delete the node ',
        POPUP_DELETE_CHAPTER: 'Delete the chapter',
        POPUP_DELETE_CHAPTER_CONTENT: 'Delete all its content',
        POPUP_DELETE_CHAPTER_TRANSFER: 'Transfer content to previous node',
        PSW_FORGOTTEN: 'Password forgotten',
        SIGN_UP: 'Sign up',
        SIGN_UP_U: 'Sign up to Unisphere',
        SEND_EMAIL: 'Send',
        LEFT_STATISTICS_MSG: 'Your statistics',
        NEW_NODE_MSG: "You don't have any nodes",
        EDIT_PSW: "Edit password",
        POPUP_DELETE_0: 'Delete ',
        POPUP_DELETE_1: 'Delete the node and all its content.',
        POPUP_DELETE_2: 'You can either completly delete the node or delete it',
        POPUP_DELETE_3: 'and transfer its content to the previous node.',
        POPUP_DELETE_4: 'Delete the node',
        POPUP_DELETE_5: 'Delete & transfer',
        SET_PSW_FOR: 'Set password for ',
        SET_PSW: 'Set password',
        POPUP_LOCK: 'This node is protected. Enter your password to unlock it',
        ACCESS: 'Access',
        RENAME_SPACE: 'Rename ',
        RENAME: 'Rename',
        HINT: 'Hint: Your node name most be less than 20 caracters',
        SHARE: 'Share',
        COPY: 'Hint: Copy ',
        WEB_WELCOME_COMMENT: 'A collaborative workspace for educational institutions',
        WEB_SEPARATION_BANNER: 'Unisphere provides tools for collaborative work and files sharing',
        WEB_FEATURE_1: 'Collaborate',
        WEB_FEATURE_2: 'Navigation between subjects is simple and efficient.',
        WEB_FEATURE_3: 'Everyone and everything is gathered on the subject tree.',
        WEB_FEATURE_4: 'Share',
        WEB_FEATURE_5: 'Upload files. Organise them into chapters. Share your knwoledge.',
        WEB_FEATURE_6: 'Analyse',
        WEB_FEATURE_7: "Keep track of your files usage. Analyse yours students behaviour. Adapt your lessons.",
        WEB_FEATURE_8: 'http://your-university.unisphere.eu',
        WEB_FEATURE_9: 'Deploy',
        WEB_FEATURE_10: 'You want a new learning management system, but you are afraid it might be hard to change.',
        WEB_FEATURE_11: 'Contact us, together we will find a solution to fit your needs.',
        WEB_UNIVERSITY_BANNER_1: 'Hundreds of students and teachers are already using Unisphere.',
        WEB_CONTACT_1: 'Contact us',
        WEB_CONTACT_2: 'Send'
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
        PROFIL: 'Profil',
        NAME: 'Nom Prénom',
        EMAIL: 'Email',
        UPDATE_PROFIL: 'Modifier profil',
        ORGANIZATION: 'Organisation',
        NEW_LECTURER: 'Nouvel enseignant (email)',
        INVITE: 'Inviter un enseignant',
        PASSWORD: 'Mot de passe',
        OLD_PSW: 'Ancien mot de passe',
        NEW_PSW: 'Nouveau mot de passe',
        CONFIRM_PSW: 'Confirmation du mot de passe',
        UPDATE_PSW: 'Modifier mot de passe',
        USERS_INVITED: 'Utilisateurs ajoutés',
        TIP_CHROME: 'Astuce: Cliquez glissez vos documents ou dossiers!',
        TIP: 'Astuce: Cliquez glissez des documents! (dossiers sous Chrome)',
        LENGTH: 'Au minimum 6 charactères',
        SECURITY: 'Sécurité',
        SHORT: 'trop court',
        LECTURERS: 'Enseignants',
        SELECT_LEAF: "Sélectionnez une extrémité de l'arbre",
        DROP_FILE: "Importez vos données",
        WHERE_DROP: "Où souhaitez-vous les importer?",
        ROOT: "0. Racine",
        CANCEL: "Annuler",
        NODE_LOCKED: "Ce noeud est verrouillé. Le téléchargement des fichiers est protégé par un mot de passe.",
        NODE_UNLOCKED: "Ce noeud est déverrouillé. N'importe quel étudiant peut télécharger ses fichiers.",
        POPUP_VIEW_FILE: 'Ouvrir un fichier',
        POPUP_VIEW_FILE_CHOICES: 'Vous pouvez télécharger ou ouvrir un aperçu du fichier',
        POPUP_VIEW_DL: 'Télécharger fichier',
        POPUP_VIEW_PW: 'Aperçu fichier',
        POPUP_DELETE_NODE: 'Détruit le noeud ',
        POPUP_DELETE_CHAPTER: 'Détruit le chapitre',
        POPUP_DELETE_CHAPTER_CONTENT: 'Détruit son contenu',
        POPUP_DELETE_CHAPTER_TRANSFER: 'Transferer son contenu au noeud précédent',
        PSW_FORGOTTEN: 'Mot de passe oublié',
        SIGN_UP: 'Inscription',
        SIGN_UP_U: 'Inscription à Unisphere',
        SEND_EMAIL: 'Envoyer',
        LEFT_STATISTICS_MSG: 'Vos statistiques',
        NEW_NODE_MSG: "Vous n'avez pas de noeuds",
        EDIT_PSW: "Modifier mot de passe",
        POPUP_DELETE_0: 'Supprimer ',
        POPUP_DELETE_1: 'Supprimer le noeud et son contenu.',
        POPUP_DELETE_2: 'Supprimer le noeud et son contenu ou le supprimer',
        POPUP_DELETE_3: 'et transférer son contenu dans le noeud précédent.',
        POPUP_DELETE_4: 'Supprimer le noeud',
        POPUP_DELETE_5: 'Supprimer & transférer',
        SET_PSW_FOR: 'Nouveau mot de passe pour ',
        SET_PSW: 'Nouveau mot de passe',
        POPUP_LOCK: 'Noeud sécurisé. Entrez le mot de passe pour y accéder.',
        ACCESS: 'Accéder',
        RENAME_SPACE: 'Renommer ',
        RENAME: 'Renommer',
        HINT: 'Le nom du noeud doit contenir moins de 20 charactères',
        SHARE: 'Partager ',
        COPY: 'Astuce: Copier ',
        WEB_WELCOME_COMMENT: "Un outil de travail collaboratif pour les établissements d'enseignement supérieur",
        WEB_SEPARATION_BANNER: "Unisphere propose des outils de travail collaboratif et d'échange de documents",
        WEB_FEATURE_1: 'Collaborez',
        WEB_FEATURE_2: 'La navigation entre les classes et les matières est simple et efficace.',
        WEB_FEATURE_3: 'Tous les étudiants et tous les enseignants partagent le même arbre des matières.',
        WEB_FEATURE_4: 'Partagez',
        WEB_FEATURE_5: 'Importez vos documents, organisez-les dans des chapitres, partagez vos connaissances.',
        WEB_FEATURE_6: 'Analysez',
        WEB_FEATURE_7: "Suivez l'utilisation de vos documents par vos étudiants. Analysez et adaptez vos cours.",
        WEB_FEATURE_8: 'http://votre-universite.unisphere.eu',
        WEB_FEATURE_9: 'Installation simple',
        WEB_FEATURE_10: "Vous souhaitez changer de plateforme pédagogique ou avoir plus d'informations?",
        WEB_FEATURE_11: "Contactez-nous, nous trouverons ensemble la solution adaptée à vos besoins.",
        WEB_UNIVERSITY_BANNER_1: "Des centaines d'étudiants et d'enseignants utilisent déjà Unisphere",
        WEB_CONTACT_1: 'Contactez-nous',
        WEB_CONTACT_2: 'Envoyez'
      })
      .preferredLanguage('en')
      .registerAvailableLanguageKeys(['fr'])
      .determinePreferredLanguage()
      .fallbackLanguage('en');
    }

    function configureAuth(){
      $authProvider.configure({
        apiUrl: getEnvironment(),
        passwordResetSuccessUrl: window.location.href
      });
    }

    function configureRestangular(){
      RestangularProvider
        .setBaseUrl(getEnvironment())
        .setDefaultHeaders({ 'Authorization': 'Token token=ce76e09ea8191a3b5410dbf033cf23ad' });
    }

    function configureNotifications(){
      NotificationProvider.setOptions({
        delay: 5000,
        startTop: 100,
        verticalSpacing: 20,
        positionX: 'right',
        positionY: 'top',
        templateUrl: 'main/notification-template.html'
      });
    }

    // Functions

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

  });

  angular.module('mainApp.filters', []);
  angular.module('mainApp.services', []);
  angular.module('mainApp.controllers', []);
  angular.module('mainApp.directives', []);

})();



