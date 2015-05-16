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

    // Add user to the list
    $scope.addUser = function(){
      if($scope.organizationForm.$valid){
        $scope.listUserActive = true;
        $scope.listUser.push($scope.newUser);
        console.log($scope.newUser + " sucessfully addded");
        $scope.newUser = "";
        $('#addAdmin').focus();
      } else{
        console.log("Email invalid");
        $scope.displayError("Enter a valid email!");
      }
    }

    // Really invite user
    $scope.inviteUsers = function(){
      if($scope.organizationForm.$valid || $scope.listUser.length != 0){
        $scope.listUser.push($scope.newUser);
        Restangular.all('users/invite').post({emails: $scope.listUser}).then(function () {
          $scope.listUser = [];
          $scope.listUserActive = false;
          $scope.newUser = "";
          $scope.organizationForm.$setUntouched();
          console.log("New user added");
          $scope.displaySuccess("Your colleages have been invited");
        }, function(d){
          console.log(d);
          console.log("There was an error adding users");
          $scope.displayError("Try again to invite lecturers");
        });
      } else{
        console.log("Email invalid");
        $scope.displayError("Enter a valid email!");
      }
    }
  }]);
})();
