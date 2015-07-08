(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope', 'browser','$timeout', 'Restangular', '$translate', '$auth', '$state', 'usSpinnerService', 'Notification', function ($scope, browser, $timeout, Restangular, $translate, $auth, $state, usSpinnerService, Notification) {
    $scope.sidebarMinified = true;



    /*==========  Location variable  ==========*/

    if(window.location.host == 'sandbox.unisphere.eu' || window.location.host == 'dev.unisphere.eu'){
      console.log("sandbox")
      $scope.sandbox = true
      $scope.admin = true
      $('#first-connection').fadeIn(2000)
    } else if(window.location.host == 'www.unisphere.eu' || window.location.host == 'home.dev.unisphere.eu' || window.location.pathname == '/home'){
      console.log("home")
      $scope.home = true
    } else{
      console.log("Normal app")

      // We get the actual uni
      Restangular.one('organization').get().then(function (university) {
        $scope.university = university.organization.name;
        $scope.universityId = university.organization.id;
        console.log("Ok: Uni name")
      }, function(d){
        console.log("Error: Get uni name");
        console.log(d)
        Notification.error("Can you please refresh the page, there was an error");
      });

      // We authentificated the user
      console.log("Validation attempt: main.js")
      $auth.validateUser().then(function(){
        console.log("Ok: admin co")
        $scope.admin = true;
        $scope.getBasicInfo()
      }, function(){
        console.log("Ok: Student co")
        $scope.admin = false
      })
    }

    if(window.location.host == 'localhost:3000'){
      $scope.local = true
    }

    /*==========  Admin deco  ==========*/

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

    /*==========  Languages stuff  ==========*/

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

    /*==========  Spinner  ==========*/

    $scope.activateSpinner = function(){
      usSpinnerService.spin('spinner-1');
      $scope.greyBackground = true
    }

    $scope.desactivateSpinner = function(){
      usSpinnerService.stop('spinner-1');
      $scope.greyBackground = false
    }

    /*==========  Function  ==========*/

    $scope.getBasicInfo = function(){

      // We get the user email and name to display them
      Restangular.one('user').get().then(function (d) {
        $scope.accountEmail = d.email
        $scope.accountName = d.name
        $scope.help = d.help

        console.log("Ok: User info")
        if($scope.help) {
          $('#first-connection').fadeIn(2000)


        }

        // We get the list of user in the organization
        Restangular.one('users').get().then(function (d) {
          $scope.listUser = d.users
          console.log("Ok: Organization info")
        }, function(d){
          console.log("Error: Organization info");
          console.log(d)
        });

      }, function(d){
        console.log("Error: User info");
        console.log(d)
      });
    }


  }]);
})();
