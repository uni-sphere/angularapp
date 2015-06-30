(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope', 'browser','$timeout', 'Restangular', '$translate', '$auth', '$state', 'usSpinnerService', 'Notification', function ($scope, browser, $timeout, Restangular, $translate, $auth, $state, usSpinnerService, Notification) {
    $scope.sidebarMinified = true;

    if(window.location.host == 'sandbox.unisphere.eu' || window.location.host == 'dev.unisphere.eu'){
      $scope.sandbox = true
      $scope.admin = true
      $('#first-connection').fadeIn(1000)
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
      if(pathname == '/home' || host == 'unisphere.eu' || host == 'home.dev.unisphere.eu'){
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
      $scope.universityId = university.organization.id;
    }, function(){
      console.log("Error: Get uni name");
      Notification.error("Can you please refresh the page, there was an error");
    });

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
        $scope.help = d.user.help
        if($scope.help) {
          $('#first-connection').fadeIn(1000)
        }

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
      });
    }


  }]);
})();
