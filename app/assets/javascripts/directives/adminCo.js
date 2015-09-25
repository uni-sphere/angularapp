(function () {
  angular.module('mainApp.directives')
    .directive('adminCo', adminCo)

  adminCo.$inject = ['$rootScope', 'Restangular', '$auth', 'Notification', 'ModalService', '$translate'];
  function adminCo($rootScope, Restangular, $auth, Notification, ModalService, $translate){
    var directive = {
      templateUrl: 'webapp/admin-co.html',
      scope: {
        getBasicInfo: '='
      },
      link: link
    };

    return directive;

    function link(scope){
      var request_success,
        reseted,
        password_error,
        email_error,
        signup,
        email_tipo,
        error;

      $translate(['ERROR', 'REQUEST_SUCCESS', 'PSW_RESETED', 'SIGNUP_REQUEST', 'NE_PSW', 'NE_EMAIL', 'EMAIL_ERROR_SIGNIN']).then(function (translations) {
        request_success = translations.REQUEST_SUCCESS;
        error = translations.ERROR;
        reseted = translations.PSW_RESETED;
        signup = translations.SIGNUP_REQUEST;
        password_error = translations.NE_PSW;
        email_error = translations.NE_EMAIL;
        email_tipo = translations.EMAIL_ERROR_SIGNIN;
      });

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
      scope.passwordForgotten = function() {
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

      scope.signupRequest = function(){
        Notification.info(signup);
      }

      scope.adminCoAttempt = function(){

        Restangular.one('organization/is_signed_up').get({email: scope.admincoEmail}).then(function (signup) {
          if(signup.response == true){
            console.log("Ok: Email exist in the organization")
            var credentials = {
              email: scope.admincoEmail,
              password: scope.admincoPassword
            };

            $auth.submitLogin(credentials).then(function(resp) {
              console.log("Ok: Login")

              // if(window.location.host != 'localhost:3000'){
              //   FHChat = {product_id: "6227bca7722d"};
              //   FHChat.properties={};
              //   FHChat.set=function(key,data){this.properties[key]=data};
              //   !function(){
              //     var a,b;
              //     return b=document.createElement("script"),a=document.getElementsByTagName("script")[0],b.src="https://chat-client-js.firehoseapp.com/chat-min.js",b.async=!0,a.parentNode.insertBefore(b,a)
              //   }();
              // }


              scope.getBasicInfo()

            }, function(resp){
              console.log(resp);
              if(resp.reason == "unauthorized"){
                console.log("Error: Admin co | misstyped your password");
                Notification.error(password_error);
                $('#admin-co-password').focus()
              } else{
                console.log("Error: Admin co");
                Notification.error(error);
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
