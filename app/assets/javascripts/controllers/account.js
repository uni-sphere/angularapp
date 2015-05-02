(function(){
angular
  .module('mainApp.controllers')
  .controller('AccountCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {

    // // Get the profile
    // Restangular.one('user').get().then(function (user) {
    //   $scope.accountEmail = user.name;
    // }, function(d){
    //   console.log(d);
    //   console.log("Cannot get user profile");
    // });

    var top = $('#panel-orgnanization').offset().top - 50
    console.log(top);
    $('#panel-user-to-invite').css("top", top);

    // Change the profile 
    $scope.updateProfile = function(){
      Restangular.one('user').put({name:$scope.accountName, email: $scope.accountEmail}).then(function () {
        $scope.accountName = "";
        $scope.accountEmail = "";
        console.log("Account updated succesfully");
      }, function(d){
        console.log(d);
        console.log("There was an error updating your profile");
        $scope.displayError("Try again to change your profile");
      });;
    }

    $scope.listUser = ["gabriel.muller.12@gmail.com","clement@muller.uk.net"]
    $scope.addUser = function(){
      if(organizationForm.$valid){
        $scope.listUser.push($scope.newUser);
        console.log($scope.newUser + " sucessfully addded");
        $scope.newUser = "";
      } else{
        console.log("There was an error adding this user");
        $scope.displayError($scope.newUser + " is not a valid email");
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
