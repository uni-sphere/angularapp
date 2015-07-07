(function () {

  angular.module('mainApp.directives')
  .directive('accountGestion', [ '$auth', 'Restangular', 'Notification', function($auth, Restangular, Notification) {

    return {
      restrict: 'E',
      templateUrl: 'main/account-gestion.html',
      scope: {
        admin: '=',
        accountForgotten: '=',
        accountSignup: '=',
        emailInput: '=',
        accountForgottenEmail: '='
      },
      link: function(scope, element) {

        scope.closeAccountSignup = function(){
          scope.accountSignup = false;
        }
        scope.closeAccountForgotten = function(){
          scope.accountForgotten = false;
        }

        // Account forgotten
        scope.resetAccount = function(){
          Restangular.one('organization/is_signed_up').get({email: scope.accountForgottenEmail}).then(function (signup) {
            var credentials = {
              email: scope.accountForgottenEmail
            };

            $auth.requestPasswordReset(credentials).then(function(resp) {
              console.log("Ok: Password reset");
              scope.accountForgotten = false;
              Notification.success("Password reseted - we sent you an email")
            })
            .catch(function(d) {
              console.log("Error: Password reset");
              console.log(d);
              Notification.error("Impossible to reset password")
              $('#account-forgotten-email').focus()
            });
          }, function(d){
            console.log("Error: Password reset | This email doesn't exist");
            console.log(d);
            Notification.error("Error in email")
            $('#account-forgotten-email').focus()
          });
        }

        // Creation of a random password
        var makePassword = function(length){
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

          return text;
        }
      }
    };
  }]);
}());
