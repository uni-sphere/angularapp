(function () {
  'use strict';
  angular.module('mainApp.directives')
  .directive('adminCo', [ 'Restangular', '$auth', function(Restangular, $auth) {
    return {
      restrict: 'E',
      templateUrl: 'webapp/admin-co.html',
      scope: {
        admin: '=',
        displayError: '=',
        hideError: '=',
        accountForgotten: '=',
        accountForgottenInput: '=',
        sandbox: '='
      },
      link: function(scope) {


        scope.toggleAdmin = function(){
          if(scope.open == true){
            scope.open = false;
          } else{
            // If we are in sandbox we directly co as admins
            if(scope.sandbox){
              scope.admin = true
            } else{
              scope.open = true;
            }
          }
        }

        // PASSWORD FORGOTTEN
        scope.passwordForgotten = function() {
          scope.accountForgottenInput = scope.emailInput
          scope.accountForgotten = true;
          $('#account-forgotten-email').focus();
        }

        scope.signupRequest = function(){
          scope.displayError("This function is not yet available. Ask one of your colleage to invite you!");
        }

        scope.adminCoAttempt = function(){

          Restangular.one('organization/is_signed_up').get({email: scope.emailInput}).then(function (signup) {
              var credentials = {
                email: scope.emailInput,
                password: scope.passwordInput
              };

              $auth.submitLogin(credentials)
              .then(function(resp) {
                scope.admin = true;
                console.log(resp);
                console.log("You have been authentificated")
              })
              .catch(function(resp) {
                console.log(resp);
                if(resp.reason == "unauthorized"){
                  console.log("You misstyped your password");
                  scope.displayError("You misstyped your password");
                } else{
                  console.log("Unknown error");
                  scope.displayError("Unknown error");
                }
                scope.passwordInput = "";
              });

          }, function(d){
            console.log(d);
            scope.displayError("You misstyped your email");
            scope.passwordInput = "";
          });

        }
      }

    }
  }]);
}());
