(function(){
  angular
  .module('mainApp.controllers')
  .controller('AccountCtrl', ['$scope', 'Restangular', '$auth',  function ($scope, Restangular, $auth) {

    var top = $('#panel-orgnanization').offset().top - 50
    $('#panel-user-to-invite').css("top", top);
    $scope.listUser = [];

    $scope.newUser = "";
    $scope.updatedEmail = "";

    // SIGNOUT
    $scope.deconnection = function(){
      $auth.signOut()
      .then(function(resp) { 
        c.classList.add("wrapper__minify");
        scope.admin = false;
      })
      .catch(function(resp) { 
        // handle error response
      });
    }
    
    // UPDATE USER
    $scope.updateAccount = function() {
      if($scope.profileForm.$valid){
        var credentials = {
          name: $scope.updatedName,
          email: $scope.updatedEmail
        };
        console.log(credentials);
        $auth.updateAccount(credentials)
        .then(function(resp) { 
          console.log(resp);
        })
        .catch(function(resp) { 
          console.log(resp);
        });
      } else{
        console.log("Error: profile email invalid");
        $scope.displayError("Enter a valid email!");
      }
    }

    // UPDATE PASSWORD
    $scope.updatePsw = function() {
      
      if($scope.passwordForm.$invalid){
        console.log("ERROR: password rename. Password is too short");
        $scope.displayError("Your new password is too short");
        $scope.newPsw = "";
        $scope.confirmPsw = "";
        $scope.passwordForm.$setUntouched();
        // $('#new-password').focus();
      } else if($scope.newPsw != $scope.confirmPsw){
        console.log("ERROR: password rename. Password different");
        $scope.displayError("The password you typed are not the same");
        $scope.confirmPsw = "";
        $('#confirm-password').focus();
      }else{
        // var credentials = {
        //   password: $scope.newPsw,
        // };

        // $auth.updatePassword(credentials)
        // .then(function(resp) {
        //   console.log(resp);
        // })
        // .catch(function(resp) {
        //   console.log(resp);
        //   $scope.displayError("Try again to change your password");
        // });
      }
    }

    $scope.addUser = function(){
      if($scope.organizationForm.$valid){
        console.log($scope.newUser);
        $scope.listUser.push($scope.newUser);
        console.log($scope.newUser + " sucessfully addded");
        $scope.newUser = "";
        // $scope.organizationForm.$setUntouched();
        $('#addAdmin').focus();
      } else{
        console.log("Email invalid");
        $scope.displayError("Enter a valid email!");
      }
    }

    // Invite users
    $scope.inviteUsers = function(){
      Restangular.all('users/invite').post({emails: $scope.listUser}).then(function () {
        $scope.listUser = [];
        console.log("New user added");
      }, function(d){
        console.log(d);
        console.log("There was an error adding users");
        $scope.displayError("Try again to invite lecturers");
      });;
    }


  }]);
})();
