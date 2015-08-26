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
            if(signup.response){
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
                Notification.error("Error while reseting your password. Please refresh")
                $('#account-forgotten-email').focus()
              });
            } else{
              console.log("Error: Password reset | wrong email");
              console.log(signup);
              Notification.error("This email doesn't have a Unisphere account")
              $('#account-forgotten-email').focus()
            }
          }, function(d){
            console.log("Error: Password reset");
            console.log(d);
            Notification.error("Error while reseting your password. Please refresh")
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
