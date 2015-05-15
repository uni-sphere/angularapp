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
        accountSignup: '='
      },
      link: function(scope, element) {

        scope.closeAccountSignup = function(){
          scope.accountSignup = false;
        }
        scope.closeAccountForgotten = function(){
          scope.accountForgotten = false;
        }

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
              })
              .catch(function(resp) { 
                console.log("Unknown error");
                console.log(resp);
                scope.displayError("Unknown error");
              });
            } 

            // This email doesnt correspond to an admin of this orga
            else{
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
        
      }
    };
  }]);
}());