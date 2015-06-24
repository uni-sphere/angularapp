(function () {
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
        accountForgottenEmail: '=',
        sandbox: '=',
        getBasicInfo: '='
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
          scope.accountForgottenEmail = scope.admincoEmail
          scope.accountForgotten = true;
          $('#account-forgotten-email').focus();
        }

        scope.signupRequest = function(){
          scope.displayError("This function is not yet available. Ask one of your colleage to invite you!");
        }

        scope.adminCoAttempt = function(){

          Restangular.one('organization/is_signed_up').get({email: scope.admincoEmail}).then(function (signup) {
              var credentials = {
                email: scope.admincoEmail,
                password: scope.admincoPassword
              };

              $auth.submitLogin(credentials)
              .then(function(resp) {
                scope.admin = true;
                scope.getBasicInfo()
                // console.log(resp);
                console.log("You have been authentificated")
              })
              .catch(function(resp) {
                console.log(resp);
                if(resp.reason == "unauthorized"){
                  console.log("You misstyped your password");
                  scope.displayError("You misstyped your password");
                  $('#admin-co-password').focus()
                } else{
                  console.log("Unknown error");
                  scope.displayError("Unknown error");
                }
                scope.admincoPassword = "";
              });

          }, function(d){
            console.log(d);
            scope.displayError("You misstyped your email");
            scope.admincoPassword = "";
            $('#admin-co-email').focus()
          });

        }
      }

    }
  }]);
}());
