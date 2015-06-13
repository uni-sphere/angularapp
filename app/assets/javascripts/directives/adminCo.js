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
        accountForgottenInput: '='
      },
      link: function(scope) {

        // Check in cookies if the user is loged in
        $auth.validateUser().then(function(){
          scope.admin = true;
          console.log("Authentificated")
        }, function(){
          if(window.location.host == 'sandbox.unisphere.eu'){
            console.log("Sandbox")
            scope.sandbox = true
            scope.admin = true
          } else{
            scope.admin = false
            console.log("Not authentificated")
          }
        })

        scope.toggleAdmin = function(){
          if(scope.open == true){
            scope.open = false;
          } else{
            scope.open = true;
          }
        }

        // PASSWORD FORGOTTEN
        scope.passwordForgotten = function() {
          scope.accountForgottenInput = scope.emailInput
          console.log(scope.accountForgottenInput)
          scope.accountForgotten = true;
        }

        scope.signupRequest = function(){
          scope.displayError("This function is not yet available. Ask one of your colleage to invite you!");
        }

        scope.adminCoAttempt = function(){

          Restangular.one('organization/is_signed_up').get({email: scope.emailInput}).then(function (signup) {
            if(signup.response == true){
              // LOGIN
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

            }
            // This email doesnt correspond to an admin of this orga
            else{
              console.log("You misstyped your email");
              scope.displayError("You misstyped your email");
              scope.passwordInput = "";
            }
          }, function(d){
            console.log("There was an error, try to login again");
            console.log(d);
            scope.displayError("There was an error, try to login again");
            scope.passwordInput = "";
          });

        }
      }

    }
  }]);
}());
