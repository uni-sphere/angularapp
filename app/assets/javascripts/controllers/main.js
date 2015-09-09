(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope','$timeout', 'Restangular', '$translate', '$auth', '$state',
   'usSpinnerService', 'Notification', 'ipCookie', '$q', function ($scope, $timeout, Restangular, $translate,
    $auth, $state, usSpinnerService, Notification, ipCookie, $q) {


    $scope.deconnection = function(){
      if($scope.sandbox){
        $scope.admin = false;
        $state.transitionTo('main.application');
      } else{
        $auth.signOut().then(function(resp) {
          console.log("OK: deconnection successful")
          $scope.admin = false;
          $state.transitionTo('main.application');

          $scope.accountEmail = undefined;
          $scope.accountName = undefined;
          $scope.userId = undefined;

          // if(window.location.host != 'localhost:3000'){
          //   FHChat.transitionTo('closed');
          // }
        }, function(d){
          console.log(d)
          console.log("Impossible to deco")
          Notification.error('Error during deconnection. Please refresh.')
        });
      }
    }


    if(window.location.host == 'sandbox.unisphere.eu' || window.location.host == 'sandbox.dev.unisphere.eu'){
      console.log("SANDBOX")
      $scope.sandbox = true
      $scope.admin = true
      Notification.warning({message: 'This is a test version. Your actions will not be saved.', delay: 20000})
      // $('#first-connection').fadeIn(2000)
      $scope.university = "My university"
    } else if(window.location.host == 'www.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.pathname == '/home'){
      console.log("HOME")
      $scope.home = true
    } else{
      console.log("NORMAL APP")

      // $('#first-connection').fadeIn()
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

      if(window.location.pathname.indexOf("/view") > -1){
        $scope.restrainView = true
      } else{
        // We authentificated the user
        // console.log("Validation attempt: main.js")
        $auth.validateUser().then(function(){
          console.log("Ok: admin connected")


          // Help Center
          // if(window.location.host != 'localhost:3000'){
          //   FHChat = {product_id: "6227bca7722d"};
          //   FHChat.properties={};
          //   FHChat.set=function(key,data){this.properties[key]=data};
          //   !function(){
          //     var a,b;
          //     return b=document.createElement("script"),a=document.getElementsByTagName("script")[0],b.src="https://chat-client-js.firehoseapp.com/chat-min.js",b.async=!0,a.parentNode.insertBefore(b,a)
          //   }();
          // }

          $scope.getBasicInfo()
        }, function(d){
          console.log("Ok: Student co")
          $scope.admin = false
        })
      }


    }

    if(window.location.host == 'localhost:3000'){
      $scope.local = true
    }

    /*==========  Function  ==========*/

    $scope.getBasicInfo = function(){

      // We get the user email and name to display them
      Restangular.one('user').get().then(function (user) {
        // console.log(user.plain());
        $scope.accountEmail = user.email
        $scope.accountName = user.name
        $scope.help = user.help
        $scope.superadmin = user.superadmin
        $scope.userId = user.id
        $scope.viewNews = true
        $scope.admin = true
        console.log("Ok: User info")
        if($scope.help) {
          // $('#first-connection').fadeIn(2000)
        }

        if(!$scope.superadmin && !$scope.local){
          Restangular.one('users/connection').put({id: $scope.universityId, user_id: $scope.userId}).then(function(d) {
            console.log("Ok: admin tracked")
          }, function(d){
            console.log("Error: track admin")
            console.log(d)
          });
        }

        // We get the list of user in the organization
        Restangular.one('users').get().then(function (listUser) {
          $scope.listUser = listUser.users
          console.log("Ok: List of all user")

          if($scope.superadmin){
            Restangular.one('organization/actions').get().then(function (timeline) {
              console.log("Ok: Timeline aquired")
              $scope.timeline = timeline.actions;
            }, function(d){
              console.log("Error: Timeline")
            });
          }

        }, function(d){
          console.log("Error: List of all user");
          Notification.error('Error while getting institution infos. Please refresh')
          console.log(d)
        });

      }, function(d){
        console.log("Error: User info");
        Notification.error('Error while getting user infos. Please refresh')
        console.log(d)
      });

    }

  }]);
})();
