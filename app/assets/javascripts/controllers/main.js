(function(){
  angular
    .module('mainApp.controllers')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$window', '$rootScope', '$scope','$timeout', 'Restangular', '$auth', '$state', 'Notification', '$translate']
  function MainCtrl($window, $rootScope, $scope, $timeout, Restangular, $auth, $state, Notification, $translate){

    var error;

    $translate(['ERROR']).then(function (translations) {
      error = translations.ERROR;
    });

    // We initialise the upload form
    $scope.setForm = function(form){
      $rootScope.uploadForm = form
    }

    // Function to set the help (tutorial) to false
    function setHelp(){
      if(!$rootScope.home && !$rootScope.sandbox){
        $auth.updateAccount({help: false})
        .then(function(resp) {
          console.log('Ok: Help set to false')
        })
        .catch(function(resp) {
          console.log(resp)
        });
      }
    }

    // We initialise the size of the circle
    $rootScope.resizeCircle = function(){
      var initializeCircle = setInterval(function() {
        if($('.full-size-circle-container').height() != null && $('.full-size-circle-container').height() != 0){
          clearInterval(initializeCircle);
          $rootScope.mini = Math.min($('.full-size-circle-container').height(), $('.full-size-circle-container').width()) - 20
          changeCircle()
        }
      }, 50);
    }

    $rootScope.resizeCircle();

    function changeCircle(){
      $rootScope.mini = Math.min($('.full-size-circle-container').height(), $('.full-size-circle-container').width()) * .6
      $('.full-size-circle').each(function(){
        $(this).css("height", $rootScope.mini)
        $(this).css("width", $rootScope.mini)
        $(this).css("border-radius", $rootScope.mini/2)
        $(this).css("margin-left", $('.full-size-circle-container').width()/2 - $rootScope.mini/2)
      });
    }

    angular.element($window).bind('resize', function() {
      if(window.location.pathname == '/' || window.location.pathname == '/home'){
        $rootScope.resizeCircle();
      }
    });

    // We watch every click to un focus some elements
    $rootScope.looseFocusItem = function(){
      if($rootScope.tutorialDashboardOpen){
        $rootScope.tutorialDashboardSeen = true
        setHelp();
      }
      if($rootScope.tutorialPadlockOpen){
        $rootScope.tutorialPadlockSeen = true
        setHelp();
      }
      if($rootScope.tutorialActionButtonOpen){
        $rootScope.tutorialActionButtonSeen = true
        setHelp();
      }
      if($rootScope.tutorialLeftTreeOpen){
        $rootScope.tutorialLeftTreeSeen = true
        setHelp();
      }
      if($rootScope.tutorialRightTreeOpen){
        $rootScope.tutorialRightTreeSeen = true
        setHelp();
      }
      if($rootScope.activeChapter != undefined){
        $rootScope.activeChapter.$modelValue.selectedItem = false;
        $rootScope.activeChapter = undefined
      }
      if($rootScope.activeFile != undefined){
        $rootScope.activeFile.$modelValue.selectedItem = false;
        $rootScope.activeFile = undefined
      }
      $('.dropdown.active').removeClass('active')
    }

    $scope.deconnection = function(){
      $auth.signOut().then(function(resp) {
        console.log("OK: deconnection successful")
        $rootScope.admin = false;
        $state.transitionTo('main.application');

        $rootScope.accountEmail = undefined;
        $rootScope.accountName = undefined;
        $rootScope.userId = undefined;
        $rootScope.superadmin = false;
        $rootScope.university = "My university"
        $rootScope.help = false

        olark('api.box.hide');

      }, function(d){
        console.log(d)
        console.log("Impossible to deco")
        Notification.error(error)
      });
    }

    if(window.location.host == 'www.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.pathname == '/home' || window.location.host == 'www.sandbox.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.host == 'sandbox.unisphere.eu' || window.location.host == 'sandbox.dev.unisphere.eu'){
    // if(window.location.host == 'localhost:3000' || window.location.host == 'www.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.pathname == '/home' || window.location.host == 'www.sandbox.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.host == 'sandbox.unisphere.eu' || window.location.host == 'sandbox.dev.unisphere.eu'){
      if(window.location.host == 'www.unisphere.eu' || window.location.host == 'dev.unisphere.eu' || window.location.pathname == '/home'){
        $rootScope.home = true;
        console.log("HOME")
      } else{
        $rootScope.sandbox = true;
        console.log("SANDBOX")
      }
      $rootScope.help = true

      $rootScope.admin = true
      $rootScope.university = "My university"

      $rootScope.accountEmail = "user@unisphere.eu"
      $rootScope.userId = 1
      $rootScope.superadmin = true
      $rootScope.listUser = ["user@unisphere.eu"]
    } else{
      console.log("NORMAL APP")
      // We get the actual uni
      Restangular.one('organization').get().then(function (university) {
        $rootScope.university = university.organization.name;
        $rootScope.universityId = university.organization.id;
        console.log("Ok: Uni name")
      }, function(d){
        console.log("Error: Get uni name");
        console.log(d)
        Notification.error(error);
      });


      // We authentificated the user
      $auth.validateUser().then(function(){
        console.log("Ok: admin connected")

        $scope.getBasicInfo()
      }, function(d){
        console.log("Ok: Student co")
        $rootScope.admin = false
      })
    }

    if(window.location.host == 'localhost:3000'){
      $rootScope.local = true
    }

    /*==========  Function  ==========*/

    $scope.getBasicInfo = function(){

      // We get the user email and name to display them
      Restangular.one('user').get().then(function (user) {
        $rootScope.accountEmail = user.email
        $rootScope.accountName = user.name
        $rootScope.help = user.help
        $rootScope.superadmin = user.superadmin
        $rootScope.userId = user.id
        $rootScope.admin = true
        console.log("Ok: User info")

        if(!$rootScope.local && !$rootScope.admin){
          olark('api.visitor.updateEmailAddress', {emailAddress: $rootScope.accountEmail});
          olark('api.visitor.updateFullName', {fullName: $rootScope.accountName});
          olark('api.box.show');
        }

        if(user.news){
          $timeout(function() {
            Notification({templateUrl: 'main/new-version-notification.html', delay: 100000})
          }, 1000);

          // update user to remove notification
          Restangular.one('users/news').put().then(function(d) {
            console.log("Ok: set news to false")
          }, function(d){
            console.log("Error: cannot set news to false")
            console.log(d)
          });
        }

        if(!$rootScope.superadmin && !$rootScope.local){
          Restangular.one('users/connection').put({id: $rootScope.universityId, user_id: $rootScope.userId}).then(function(d) {
            console.log("Ok: admin tracked")
          }, function(d){
            console.log("Error: track admin")
            console.log(d)
          });
        }

        // We get the list of user in the organization
        Restangular.one('users').get().then(function (listUser) {
          $rootScope.listUser = listUser.users
          console.log("Ok: List of all user")

          if($rootScope.superadmin){
            Restangular.one('organization/actions').get().then(function (timeline) {
              console.log("Ok: Timeline aquired")
              $rootScope.timeline = timeline.actions;
            }, function(d){
              console.log("Error: Timeline")
            });
          }

        }, function(d){
          console.log("Error: List of all user");
          Notification.error(error)
          console.log(d)
        });

      }, function(d){
        console.log("Error: User info");
        Notification.error(error)
        console.log(d)
      });

    }




  }
})();
