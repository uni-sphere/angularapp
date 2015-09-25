(function(){
  angular
    .module('mainApp.controllers')
    .controller('accountCtrl', accountCtrl)

  accountCtrl.$digest = ['$scope', 'Restangular', '$auth', 'Notification', 'spinnerService', '$translate'];
  function accountCtrl($scope, Restangular, $auth, Notification, spinnerService, $translate){

    var success,
      error,
      valid_both,
      valid_email,
      valid_name,
      registered_user,
      psw_short,
      psw_inputs_error;

    $translate(['SUCCESS', 'ERROR', 'VALID_BOTH', 'VALID_EMAIL', 'VALID_NAME', 'REGISTERED_USER', 'PSW_UPDATE', 'PSW_INPUTS_ERROR']).then(function (translations) {
      success = translations.SUCCESS;
      error = translations.ERROR;
      valid_both = translations.VALID_BOTH;
      valid_email = translations.VALID_EMAIL;
      valid_name = translations.VALID_NAME;
      registered_user = translations.REGISTERED_USER;
      psw_short = translations.PSW_UPDATE;
      psw_inputs_error = translations.PSW_INPUTS_ERROR;
    });

    /*======================================
    =            Update profile            =
    ======================================*/
    $scope.updateAccount = function() {

      if($scope.updatedName == ""){
        $scope.updatedName = undefined
      }
      if($scope.updatedEmail == ""){
        $scope.updatedEmail = undefined
      }

      if($scope.updatedName == undefined && $scope.updatedEmail == undefined){
        Notification.error(valid_both);
      } else if(!$scope.profileForm.updatedEmailValid.$valid){
        Notification.error(valid_email);
      } else if($scope.profileForm.updatedNameValid.$error.minlength){
        Notification.error(valid_name);
      } else {

        var credentials = {
          name: $scope.updatedName,
          email: $scope.updatedEmail
        };

        $auth.updateAccount(credentials)
        .then(function(resp) {
          console.log("Profil updated")
          Notification.success(success);
          $rootScope.accountEmail = resp.data.data.email
          $rootScope.accountName = resp.data.data.name
          $scope.updatedName = ""
          $scope.updatedEmail = ""
          $('#user-name').css('display', 'none')
          $('#user-name').css('display', '')
          // $scope.profileForm.$setUntouched();
        })
        .catch(function(resp) {
          Notification.error(error);
          console.log("Error: Update profil")
          console.log(resp);
          $('updatedName').focus()
        });
      }
    }

    /*===================================
    =            Invite User            =
    ===================================*/

    $scope.inviteUsers = function(){
      if($scope.organizationForm.$valid){
        spinnerService.begin()
        var newPassword = makePassword(8);

        // Sign up
        var credentials = {
          email: $scope.newUser,
          password: newPassword,
          password_confirmation: newPassword
        };

        // We check if the email is already used
        Restangular.one('organization/is_signed_up').get({email: $scope.newUser}).then(function (signup) {
          // If the email is already taken
          if(signup.response == true){
            console.log("Error: Invite colleague | he already uses unisphere");
            Notification.error($scope.newUser + registered_user)
            $scope.newUser = "";
            $scope.organizationForm.$setUntouched();
          } else if (signup.response == false) {
            console.log("Ok:Invite colleague | Email free")
            // We signup the guy
            Restangular.all('user/invite').post({email: $scope.newUser, password: newPassword}).then(function (response) {
              $scope.listUser.push(response.user);
              $scope.newUser = "";
              spinnerService.stop()
              $scope.organizationForm.$setUntouched();
              console.log("New user added");
              Notification.success(success);
            }, function(d){
              spinnerService.stop()
              console.log("Error: Invite colleague");
              console.log(d);
              Notification.error(error);
            });
          } else {
            Restangular.all('users').post({user_id: signup.response, organization_id: $scope.universityId}).then(function (d) {
              $scope.listUser.push(signup.response.user);
              $scope.newUser = "";
              spinnerService.stop()
              $scope.organizationForm.$setUntouched();
              console.log("link created")
              Notification.success(success);
            }, function(d) {
              spinnerService.stop()
              console.log("Error: link not created")
              console.log(d)
              Notification.error(error)
            });
          }
        }, function(d){
          spinnerService.stop()
          console.log("Error: Invite colleague");
          console.log(d);
          Notification.error(error)
        });


      } else{
        console.log("Error: Invite colleague | Email invalid");
        Notification.error(valid_email)
        $('#addAdmin').focus()
      }
    }

    /*================================
    =            Password            =
    ================================*/

    $scope.updatePsw = function() {
      if(!$scope.newPasswordValid){
        Notification.error(psw_short);
        console.log("Error: Change password | Password is too short");
        $('#new-password').focus();
      } else if(!$scope.newPasswordConfirmed){
        Notification.error(psw_inputs_error);
        console.log("Error: Change password | Password different");
        $scope.confirmPsw = "";
        $('#confirm-password').focus();
      } else{
        var credentials = {
          password: $scope.newPsw,
          password_confirmation: $scope.confirmPsw
        };

        $auth.updatePassword(credentials).then(function(resp) {
          Notification.success(success);

          // We remove all what was displayed
          $scope.newPsw = "";
          $scope.confirmPsw = "";
          $('#password-strength').fadeOut(400);
          $('.password-notif').fadeOut(400);
          $scope.newPasswordValid = false
          $('.password-check-notif-ok').fadeOut(400)
          $scope.newPasswordConfirmed = false
        }).catch(function(resp) {
          console.log("Error: Change password")
          console.log(resp);
          Notification.error(error);

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


    /*=================================
    =            Functions            =
    =================================*/


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

    var tid=setInterval(function(){
      if("complete"===document.readyState){
        clearInterval(tid);
        mainLayout();
      }
    },100);

  }
})();




