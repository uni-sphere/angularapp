(function(){
  angular
  .module('mainApp.controllers')
  .controller('AccountCtrl', ['$scope', 'Restangular', '$auth', function ($scope, Restangular, $auth) {

    /*======================================
    =            Update profile            =
    ======================================*/

    $scope.formData = {
    };
    $scope.formFields= [{
      type: "input",
      key: "updatedProfileName",
      templateOptions:{
        label: 'Name'
      }
    },
    {
      type: "input",
      key: "updatedProfileEmail",
      templateOptions:{
        label: 'Email address',
        type: 'email'
      }
    }];

    $scope.updateAccount = function() {
      // console.log($scope.updatedName)
      // console.log($scope.updatedEmail)
      // console.log($scope.profileForm.updatedNameValid.$error.minlength)
      // console.log($scope.profileForm.updatedEmailValid.$valid)

      if($scope.updatedName == ""){
        $scope.updatedName = undefined
      }
      if($scope.updatedEmail == ""){
        $scope.updatedEmail = undefined
      }



      if($scope.updatedName == undefined && $scope.updatedEmail == undefined){
        $scope.displayError("Enter either a valid new name or email")
      }else if(!$scope.profileForm.updatedEmailValid.$valid){
        $scope.displayError("Enter a valid mail")
      } else if($scope.profileForm.updatedNameValid.$error.minlength){
        $scope.displayError("Enter a valid name")
      } else {

        var credentials = {
          name: $scope.updatedName,
          email: $scope.updatedEmail
        };

        $auth.updateAccount(credentials)
        .then(function(resp) {
          console.log("Profil updated")
          $scope.displaySuccess("Profile updated")
          $scope.accountEmail = resp.data.data.email
          $scope.accountName = resp.data.data.name
          $scope.updatedName = ""
          $scope.updatedEmail = ""
          // $scope.profileForm.$setUntouched();
        })
        .catch(function(resp) {
          $scope.displayError("Unable to update the profile")
          console.log("Unable to update the profile")
          console.log(resp);
          $('updatedName').focus()
        });
      }
    }

    /*================================
    =            Password            =
    ================================*/

    $scope.updatePsw = function() {
      if(!$scope.newPasswordValid){
        console.log("ERROR: your password is too short");
        $scope.displayError("Your password is too short");
        $('#new-password').focus();
      } else if(!$scope.newPasswordConfirmed){
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
          console.log("Password changed")
          $scope.displaySuccess("Password Changed")

          // We remove all what was displayed
          $scope.newPsw = "";
          $scope.confirmPsw = "";
          $('#password-strength').fadeOut(400);
          $('.password-notif').fadeOut(400);
          $scope.newPasswordValid = false
          $('.password-check-notif-ok').fadeOut(400)
          $scope.newPasswordConfirmed = false
        })
        .catch(function(resp) {
          console.log(resp);
          $scope.displayError("Try again to change your password");

          // We remove all what was displayed
          $scope.newPsw = "";
          $scope.confirmPsw = "";
          $('#password-strength').fadeOut(400);
          $('.password-notif').fadeOut(400);
          $scope.newPasswordValid = false
          $('.password-check-notif-ok').fadeOut(400)
          $scope.newPasswordConfirmed = false

          $('#new-password').focus();
        });
      }
    }


    /*===================================
    =            Invite User            =
    ===================================*/

    $scope.inviteUsers = function(){
      if($scope.organizationForm.$valid){
        var newPassword = makePassword(8);

        // Sign up
        var credentials = {
          email: $scope.newUser,
          password: newPassword,
          password_confirmation: newPassword,
          organization_id: $scope.universityId
        };

        $auth.submitRegistration(credentials)
        .then(function(userInfo) {
          Restangular.all('user/invite').post({email: $scope.newUser, password: newPassword}).then(function (d) {
            $scope.listUser.push(userInfo.data.data);
            $scope.newUser = "";
            console.log("New user added");
            $scope.displaySuccess("Your colleages have been invited");
          }, function(d){
            console.log(d);
            console.log("There was an error adding users");
            $scope.displayError("Try again to invite lecturers");
            $('#addAdmin').focus()
          });
        })
        .catch(function(d) {
          console.log("Impossible to signup the user")
          console.log(d);
          if(d.status = 403){
            console.log(d.data.data.email + " already uses Unisphere. We didn't invite him again");
            $scope.displayError(d.data.data.email + " already uses Unisphere. We didn't invite him again");
            $scope.newUser = "";
            $scope.organizationForm.$setUntouched();
          } else{
            $scope.displayError("Impossible to create an account");
            $('#addAdmin').focus()
          }

        });

      } else{
        console.log("Email invalid");
        $scope.displayError("Enter a valid email!");
        $('#addAdmin').focus()
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

    // Check if both password are similar
    var passwordSimilarity={
      compare: function(){
        if($('#new-password').val() == $('#confirm-password').val() && $scope.newPasswordValid){
          $scope.newPasswordConfirmed = true
          $('.password-check-notif-ok').fadeIn(400)
        }
        else{
          $scope.newPasswordConfirmed = false
          $('.password-check-notif-ok').fadeOut(400)
        }
      },
      init: function(){
        $('#confirm-password').keyup(function(){
          passwordSimilarity.compare()
        })
        $('#new-password').keyup(function(){
          passwordSimilarity.compare()
        })
      }
    }


    // Password security
    var passwordCheck ={
      checkStrength: function(password){
        // console.log(password)
        var strength = 0
        if(password.length == 0){
          $('#password-strength').fadeOut(400);

        }
        if (password.length < 8) {
          $scope.newPasswordValid = false
          $('#password-strength').removeClass()
          $('#password-strength').addClass('short')
          $('.strength-text').text('Too short')
          $('.password-notif').fadeOut(400)
          return
        }
        else{
          $('.password-notif').fadeIn(400);
          $scope.newPasswordValid = true
        }
        if (password.length > 10) strength += 1

        // If password contains both lower and uppercase characters, increase strength value.
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1

        // If it has numbers and characters, increase strength value.
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1

        // If it has one special character, increase strength value.
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1

        // If it has two special characters, increase strength value.
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1

        // Calculated strength value, we can return messages
        // If value is less than 2
        if (strength < 2) {
          $('#password-strength').removeClass()
          $('#password-strength').addClass('weak')
          $('.strength-text').text('Weak')
        } else if (strength == 2) {
          $('#password-strength').removeClass()
          $('#password-strength').addClass('good')
          $('.strength-text').text('Good')
        } else {
          $('#password-strength').removeClass()
          $('#password-strength').addClass('strong')
          $('.strength-text').text('Strong')
        }
      },
      init: function(){
        $('#new-password').keyup(function() {
          $('#password-strength').fadeIn(400);
          $('.form-container').html(passwordCheck.checkStrength($('#new-password').val()));
        })
      }
    }

    mainLayout = function() {
      passwordCheck.init()
      passwordSimilarity.init()
    };

    $(document).on('ready page:load', function() {
      mainLayout();
    });


  }]);
})();






