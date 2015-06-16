(function(){
  angular
  .module('mainApp.controllers')
  .controller('AccountCtrl', ['$scope', 'Restangular', '$auth',  function ($scope, Restangular, $auth) {

    var top = $('#panel-orgnanization').offset().top - 50
    $('#panel-user-to-invite').css("top", top);
    $scope.listUser = [];

    $scope.newUser = "";
    $scope.updatedEmail = "";


    // We get the user email and name to display them
    Restangular.one('chapters').get({node_id: scope.nodeEnd[0]}).then(function (document) {
      $scope.accountEmail =
      $scope.accountName =
    }, function(d){
      console.log("Impossible to get the user infos");
      console.log(d)
      displayError("We temporarly can't display user informations")
    });

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
      } else{
        var credentials = {
          password: $scope.newPsw,
          password_confirmation: $scope.confirmPsw
        };

        $auth.updatePassword(credentials)
        .then(function(resp) {
          console.log(resp);
        })
        .catch(function(resp) {
          console.log(resp);
          $scope.displayError("Try again to change your password");
        });
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

    // $scope.listUser = ["gabriel.muller@unisphere.eu"];
    // Really invite user
    $scope.inviteUsers = function(){
      if($scope.organizationForm.$valid || $scope.listUser.length != 0){

        // We check if there is something in the input
        if($scope.newUser != ""){
          $scope.listUser.push($scope.newUser);
        }

        $scope.listUser.forEach(function(newUser) {
          var newPassword = makePassword(8);

          // Sign up
          var credentials = {
            email: newUser,
            password: newPassword,
            password_confirmation: newPassword,
            organization_id: $scope.universityId
          };

          $auth.submitRegistration(credentials)
          .then(function(d) {
            Restangular.all('user/invite').post({email: newUser, password: newPassword}).then(function () {
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
          })
          .catch(function(d) {
            console.log("Impossible to signup the user")
            console.log(d);
            if(d.status = 403){
              console.log(d.data.data.email + " already uses Unisphere. We didn't invite him again");
              $scope.displayError(d.data.data.email + " already uses Unisphere. We didn't invite him again");
              $scope.listUserActive = false;
              $scope.newUser = "";
              $scope.organizationForm.$setUntouched();
            } else{
              $scope.displayError("Impossible to create an account");
            }

          });

        });

      } else{
        console.log("Email invalid");
        $scope.displayError("Enter a valid email!");
      }
    }






    // Creation of a random password
    var makePassword = function(length){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

  }]);
})();
