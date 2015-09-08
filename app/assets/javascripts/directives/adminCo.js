(function () {
  angular.module('mainApp.directives')
  .directive('adminCo', [ 'Restangular', '$auth', 'Notification', 'ModalService', function(Restangular, $auth, Notification, ModalService) {
    return {
      restrict: 'E',
      templateUrl: 'webapp/admin-co.html',
      scope: {
        sandbox: '=',
        getBasicInfo: '=',
        admin: '='
      },
      link: function(scope, element, attrs) {

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
          ModalService.showModal({
            templateUrl: "webapp/account-forgotten-modal.html",
            controller: "AccountForgottenModalCtrl",
            inputs:{
              email: scope.admincoEmail
            }
          }).then(function(modal) {
            modal.close.then(function(result){
              if(result){
                Notification.success("Password reseted - we sent you an email")
              }
            });
          });
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

                // if(window.location.host != 'localhost:3000'){
                //   FHChat = {product_id: "6227bca7722d"};
                //   FHChat.properties={};
                //   FHChat.set=function(key,data){this.properties[key]=data};
                //   !function(){
                //     var a,b;
                //     return b=document.createElement("script"),a=document.getElementsByTagName("script")[0],b.src="https://chat-client-js.firehoseapp.com/chat-min.js",b.async=!0,a.parentNode.insertBefore(b,a)
                //   }();
                // }


                scope.getBasicInfo()

                // console.log(scope.admin)
                // scope.$apply()
                // scope.$apply(attrs.getBasicInfo);
                // scope.$apply("getBasicInfo()");
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
