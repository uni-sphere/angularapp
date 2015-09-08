(function(){
angular
  .module('mainApp.controllers')
  .controller('AccountForgottenModalCtrl', ['$scope', 'close', 'email', '$timeout', 'Notification', 'Restangular', '$auth', function ($scope, close, email, $timeout, Notification, Restangular, $auth) {

    $scope.email = email

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
      $('.modal-input').focus()
    }, 1000);

    $scope.dismissModal = function(result){
      $('.modal-container').addClass("modal-ready-to-disappear")
      close(result, 300);
    }

    $scope.resetAccount = function(){
      Restangular.one('organization/is_signed_up').get({email: $scope.email}).then(function (signup) {
        if(signup.response){
          var credentials = {
            email: $scope.email
          };
          $auth.requestPasswordReset(credentials).then(function(resp) {
            console.log("Ok: Password reset");
            $scope.dismissModal(true);
          }, function(d){
            console.log("Error: Password reset");
            console.log(d);
            Notification.error("Error while reseting your password. Please refresh")
            $('#account-forgotten-email').focus()
          });
        } else{
          console.log("Error: Password reset | wrong email");
          console.log(signup);
          Notification.error("This email doesn't have a Unisphere account")
          $('.modal-input').focus()
        }
      }, function(d){
        console.log("Error: Password reset");
        console.log(d);
        Notification.error("Error while reseting your password. Please refresh")
       $('.modal-input').focus()
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

  }])
})()
