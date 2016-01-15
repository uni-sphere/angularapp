(function () {
  angular.module('mainApp.directives')
    .directive('adminCo', adminCo)

  adminCo.$inject = ['cookiesService', '$state', '$rootScope', 'Restangular', '$auth', 'Notification', 'ModalService', '$translate'];
  function adminCo(cookiesService, $state, $rootScope, Restangular, $auth, Notification, ModalService, $translate){
    var reseted,
      password_error,
      email_error,
      signup,
      email_tipo

    $translate(['PSW_RESETED', 'SIGNUP_REQUEST', 'NE_PSW', 'NE_EMAIL', 'EMAIL_ERROR_SIGNIN']).then(function (translations) {
      reseted = translations.PSW_RESETED;
      signup = translations.SIGNUP_REQUEST;
      password_error = translations.NE_PSW;
      email_error = translations.NE_EMAIL;
      email_tipo = translations.EMAIL_ERROR_SIGNIN;
    });

    var directive = {
      templateUrl: 'webapp/admin-co.html',
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope){

      $rootScope.deconnection = function(){
        $auth.signOut().then(function(resp) {
          console.log("OK: deconnection successful")
          $rootScope.admin = undefined;
          
          $state.transitionTo('main.application');

          $rootScope.accountEmail = undefined;
          $rootScope.accountName = undefined;
          $rootScope.userId = undefined;
          $rootScope.superadmin = false;
          $rootScope.university = "My university"
          $rootScope.help = false

          cookiesService.reload()
          olark('api.box.hide');

          if($rootScope.fullVersion){
            $rootScope.callSignInModal();
          }

        }, function(d){
          console.log(d)
          console.log("Impossible to deco")
          Notification.error($rootScope.errorMessage)
        });
      }

      scope.toggleAdmin = function(){
        if(scope.open == true){
          scope.open = false;
        } else{
          // If we are in sandbox we directly co as admins
          if($rootScope.sandbox || $rootScope.home){
            $rootScope.admin = true
            $rootScope.superadmin = true
          } else{
            scope.open = true;
          }
        }
      }

      // PASSWORD FORGOTTEN
      $rootScope.passwordForgotten = function() {
        ModalService.showModal({
          templateUrl: "webapp/account-forgotten-modal.html",
          controller: "AccountForgottenModalCtrl",
          inputs:{
            email: scope.admincoEmail
          }
        }).then(function(modal) {
          modal.close.then(function(result){
            if(result){
              Notification.success(reseted)
            }
          });
        });
      }

      $rootScope.signupRequest = function(){
        Notification.info(signup);
      }

      $rootScope.adminCoAttempt = function(){
        Restangular.one('organization/is_signed_up').get({email: $rootScope.signInEmail}).then(function (signup) {
          if(signup.response == true){
            console.log("Ok: Email exist in the organization")
            var credentials = {
              email: $rootScope.signInEmail,
              password: $rootScope.signInPassword
            };

            $auth.submitLogin(credentials).then(function(userInfo) {
              console.log("Ok: Login")
              $rootScope.signin(userInfo)
            }, function(resp){
              console.log(resp);
              if(resp.reason == "unauthorized"){
                console.log("Error: Admin co | misstyped your password");
                Notification.error(password_error);
                $('#admin-co-password').focus()
              } else{
                console.log("Error: Admin co");
                Notification.error($rootScope.errorMessage);
              }
              scope.admincoPassword = "";
            });
          } else {
            console.log("Error: The user doesn't have an account on this organization.")
            Notification.error(email_error);
          }

        }, function(d){
          console.log("Error: Admin co | you misstyped your email");
          console.log(d);
          Notification.error(email_tipo)
          scope.admincoPassword = "";
          $('#admin-co-email').focus()
        });

      }

    }
  }

}());
