(function () {
  angular.module('mainApp.directives')
  .directive('adminCo', [ 'Restangular', '$auth', 'Notification', function(Restangular, $auth, Notification) {
    return {
      restrict: 'E',
      templateUrl: 'webapp/admin-co.html',
      scope: {
        admin: '=',
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
          Notification.info("This function is not yet available. Ask one of your colleage to invite you!");
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
                scope.admin = true;
                scope.getBasicInfo()
              }, function(resp){
                console.log(resp);
                if(resp.reason == "unauthorized"){
                  console.log("Error: Admin co | misstyped your password");
                  Notification.error("Wrong password");
                  $('#admin-co-password').focus()
                } else{
                  console.log("Error: Admin co");
                  Notification.error("Impossible to log in");
                }
                scope.admincoPassword = "";
              });
            } else {
              console.log("Error: The user doesn't have an account on this organization.")
              Notification.error("Your email is not registered on this organization");
            }

          }, function(d){
            console.log("Error: Admin co | you misstyped your email");
            console.log(d);
            Notification.error("Error in email")
            scope.admincoPassword = "";
            $('#admin-co-email').focus()
          });

        }
      }

    }
  }]);
}());
