(function () {
  'use strict';

  angular.module('mainApp.directives')
  .directive('accountGestion', [ '$auth', 'Restangular', function($auth, Restangular) {
    
    return {
      restrict: 'E',
      templateUrl: 'main/account-gestion.html',
      scope: {
        admin: '=',
        displayError: '=',
        hideError: '=',
        accountForgotten: '=',
        accountSignup: '=',
        displaySuccess: '='
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
          Restangular.one('organization/is_signed_up').get({email: scope.accountForgottenInput}).then(function (signup) {
            if(signup.response == true){
              var credentials = {
                email: scope.accountForgottenInput
              };

              $auth.requestPasswordReset(credentials)
              .then(function(resp) {
                console.log("Password has been reset");
                scope.accountForgotten = false;
                scope.displaySuccess("We sent you an email");
              })
              .catch(function(resp) {
                console.log("Unknown error");
                console.log(resp);
                scope.displayError("Unknown error");
              });
			    	} else {
              console.log("You misstyped your email");
              scope.displayError("You misstyped your email");
              scope.passwordInput = "";
            }
          }, function(d){
            console.log("Error while trying to reset the account");
            console.log(d);
            scope.displayError("There was an error, try again");
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