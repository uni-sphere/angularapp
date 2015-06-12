(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope', 'browser', '$cookies','$timeout', 'Restangular', '$upload', '$translate', '$auth', '$state', function ($scope, browser, $cookies, $timeout, Restangular, $upload, $translate, $auth, $state) {

    $scope.sidebarMinified = true;
    $scope.accountForgoten = false;

		$scope.adminDeco = function(){
      if(window.location.host == 'sandbox.unisphere.eu'){
        $scope.admin = false;
      } else{
        $auth.signOut()
        .then(function(resp) {
          $scope.admin = false;
          console.log(resp);
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

    // $scope.displayError("This is just a test version. You can't download files");


  }]);
})();
