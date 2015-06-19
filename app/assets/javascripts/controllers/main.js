(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope', 'browser','$timeout', 'Restangular', '$upload', '$translate', '$auth', '$state', 'usSpinnerService', function ($scope, browser, $timeout, Restangular, $upload, $translate, $auth, $state, usSpinnerService) {

    $scope.sidebarMinified = true;
    $('#first-connection').fadeIn(2000)

    if(window.location.host == 'sandbox.unisphere.eu'){
      $scope.sandbox = true
      $scope.admin = true
    } else{
      $auth.validateUser().then(function(){
        $scope.admin = true;
        $scope.getBasicInfo()


      }, function(){
        $scope.admin = false
      })
    }

    if(window.location.host == 'localhost:3000'){
      $scope.local = true
    }

    $scope.adminDeco = function(){
      if($scope.sandbox){
        $scope.admin = false;
        $state.transitionTo('main.application');
      } else{
        $auth.signOut()
        .then(function(resp) {
          $scope.admin = false;
          $state.transitionTo('main.application');
        })
        .catch(function(resp) {
          console.log(resp)
        });
      }
    }

    // $scope.inviteUser = ["clement@muller.uk.net","gabriel.muller.12@gmail.com"]

    checkLocation = function(){
      var host = window.location.host;
      var pathname = window.location.pathname
      if(pathname == '/home' || host == 'home.unisphere.eu'){
        $scope.home = true
      } else{
        $scope.home = false;
      }

    }();

    // Languages options
    $scope.ddSelectOptions = [
      {
        text: 'Français',
        value: 'fr'
      },
      {
        text: 'English',
        value: 'en'
      }
    ];

    // Set the default language
    if($translate.use().indexOf("fr") > -1){
      $scope.ddSelectSelected = {text: 'French', value: 'fr'};
    } else{
      $scope.ddSelectSelected = {text: 'English', value: 'en'};
    }

    $scope.changeLanguage = function() {
      if ($scope.ddSelectSelected.value == 'fr') {
        $translate.use('fr');
      } else {
        $translate.use('en');
      }
      console.log($translate.use());
    }

    // get university name for navbar
    Restangular.one('organization').get().then(function (university) {
      $scope.university = university.organization.name;
      // console.log(university.plain());
      $scope.universityId = university.organization.id;
    }, function(){
      console.log("There getting the university name");
      $scope.displayError("Sorry there was a mistake, refresh please");
    });

    $scope.displayError = function(errorString){
      if($scope.listError == undefined || $scope.listError.length == 0){
         $scope.listError = [errorString];
      } else{
        $scope.listError.push(errorString);
      }
      $scope.showError = true;
    }

    $scope.displaySuccess = function(message){
      $scope.success = message;
      $('#success-prompt').show();
      setTimeout(function(){
         $('#success-prompt').hide();
      },10000)
    }


    $scope.hideError = function(){
      $scope.listError = [];
      $scope.showError = false;
    }

    $scope.activateSpinner = function(){
      usSpinnerService.spin('spinner-1');
      $scope.greyBackground = true
    }

    $scope.desactivateSpinner = function(){
      usSpinnerService.stop('spinner-1');
      $scope.greyBackground = false
      $scope.$apply()
    }

    $scope.getBasicInfo = function(){
      // We get the user email and name to display them
      Restangular.one('user').get().then(function (d) {
        $scope.accountEmail = d.user.email
        $scope.accountName = d.user.name

        // We get the list of user in the organization
        Restangular.one('users').get().then(function (d) {
          $scope.listUser = d.users
        }, function(d){
          console.log("Impossible to get the user infos");
          console.log(d)
        });

      }, function(d){
        console.log("Impossible to get the user infos");
        console.log(d)
        // $scope.displayError("We temporarly can't display user informations")
      });
    }

    // $scope.displayError("This is just a test version. You can't download files");


  }]);
})();
