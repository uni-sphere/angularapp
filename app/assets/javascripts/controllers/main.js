(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope', 'browser', '$cookies','$timeout', 'Restangular', '$upload', 'ngDialog', '$translate', function ($scope, browser, $cookies, $timeout, Restangular, $upload, ngDialog, $translate) {

    $scope.sidebarMinified = true;

    //Check if the user is admin
    var admin = $cookies.get('unisphere_api_admin');
   
    if(admin != undefined){
      $scope.admin = true;
    }

    $scope.adminDeco = function(){
      $scope.admin = false;
    }

    $scope.inviteUser = ["clement@muller.uk.net","gabriel.muller.12@gmail.com"]


    checkLocation = function(){
      var host = window.location.host;
      var pathname = window.location.pathname
      if(pathname == '/home' || host == 'unisphere.eu'){
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
      $scope.university = university['name'];
    }, function(){
      console.log("There getting the university name");
      $scope.displayError("Sorry there was a mistake, refresh please");
    });


  }]);
})();