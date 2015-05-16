(function () {
  'use strict';
  angular.module('mainApp.directives')
  .directive('adminCo', [ 'Restangular', '$cookies', '$auth', function(Restangular, $cookies, $auth) {
    return {
      restrict: 'E',
      templateUrl: 'webapp/admin-co.html',
      scope: {
        admin: '=',
        displayError: '=',
        hideError: '=',
        accountForgotten: '='
      },
      link: function(scope) {

        // SET INITIAL ADMIN
        if ($cookies.get('auth_headers') != undefined) {
          if ($cookies.get('auth_headers').indexOf("access-token") > -1) {
            scope.admin = true;
          }
        } else {
          scope.admin = false;
        }

        scope.toggleAdmin = function(){
          if(scope.open == true){
            scope.open = false;
          } else{
            scope.open = true;
          }
        }
        
        // PASSWORD FORGOTTEN
        scope.passwordForgotten = function() {
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