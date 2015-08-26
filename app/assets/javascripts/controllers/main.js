(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope','$timeout', 'Restangular', '$translate', '$auth', '$state',
   'usSpinnerService', 'Notification', 'ipCookie', function ($scope, $timeout, Restangular, $translate,
    $auth, $state, usSpinnerService, Notification, ipCookie) {

    if(window.location.host == 'sandbox.unisphere.eu' || window.location.host == 'sandbox.dev.unisphere.eu'){
      console.log("sandbox")
      $scope.sandbox = true
      $scope.admin = true
      Notification.warning({message: 'This is test version. Your actions will not be saved', delay: 20000})
      // $('#first-connection').fadeIn(2000)
      $scope.university = "My university"
    } else if(window.location.host == 'www.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.pathname == '/home'){
      console.log("home")
      $scope.home = true
      if(window.location.host == 'dev.unisphere.eu'){
        $scope.dev = true;
      }
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
      // console.log("Validation attempt: main.js")
      $auth.validateUser().then(function(){
        console.log("Ok: admin co")
        $scope.admin = true;

        // Help Center
        if(window.location.host != 'localhost:3000'){
          FHChat = {product_id: "6227bca7722d"};
          // FHChat.properties={};
          // FHChat.set=function(key,data){this.properties[key]=data};
          !function(){
            var a,b;
            return b=document.createElement("script"),a=document.getElementsByTagName("script")[0],b.src="https://chat-client-js.firehoseapp.com/chat-min.js",b.async=!0,a.parentNode.insertBefore(b,a)
          }();
        }

        $scope.getBasicInfo()
      }, function(){
        console.log("Ok: Student co")
        $scope.admin = false
      })
    }

    $scope.printNodeEnds = function(){
      console.log($scope.nodeEnd)
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

          $scope.accountEmail = undefined;
          $scope.accountName = undefined;

          if(window.location.host != 'localhost:3000'){
            FHChat.transitionTo('closed');
          }
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

    /*==========  Function  ==========*/

    $scope.getBasicInfo = function(){

      // We get the user email and name to display them
      Restangular.one('user').get().then(function (d) {
        $scope.accountEmail = d.email
        $scope.accountName = d.name
        $scope.help = d.help

        console.log("Ok: User info")
        if($scope.help) {
          // $('#first-connection').fadeIn(2000)
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
