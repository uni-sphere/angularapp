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
          Notification.success("This function is not yet available. Ask one of your colleage to invite you!");
        }

        scope.adminCoAttempt = function(){

          Restangular.one('organization/is_signed_up').get({email: scope.admincoEmail}).then(function (signup) {
            console.log("Ok: Email exist in the organization")
            var credentials = {
              email: scope.admincoEmail,
              password: scope.admincoPassword
            };

            $auth.submitLogin(credentials)
            .then(function(resp) {
              console.log("Ok: Login")
              scope.admin = true;
              scope.getBasicInfo()
            })
            .catch(function(resp) {
              console.log(resp);
              if(resp.reason == "unauthorized"){
                console.log("Error: Admin co | misstyped your password");
                Notification.error("You misstyped your password");
                $('#admin-co-password').focus()
              } else{
                console.log("Error: Admin co");
                Notification.error("We can't temporarily login you");
              }
              scope.admincoPassword = "";
            });

          }, function(d){
            console.log("Error: Admin co | you misstyped your email");
            console.log(d);
            Notification.error("You misstyped your email")
            scope.admincoPassword = "";
            $('#admin-co-email').focus()
          });

        }
      }

    }
  }]);
}());
