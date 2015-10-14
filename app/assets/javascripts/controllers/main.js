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
    var initializeCircle = setInterval(function() {
      if($('.full-size-circle-container').height() != null && $('.full-size-circle-container').height() != 0){
        clearInterval(initializeCircle);
        $rootScope.resizeCircle();
      }
    }, 50);

    $rootScope.resizeCircle = function(){
      // console.log("RESIZE CIRCLE")
      // console.log($('.full-size-circle-container').height())
      if($('.full-size-circle-container').height() < 320 || $('.full-size-circle-container').width() < 320){
        var mini = Math.min($('.full-size-circle-container').height(), $('.full-size-circle-container').width()) - 20
        $('.full-size-circle').css("height", mini)
        $('.full-size-circle').css("width", mini)
        $('.full-size-circle').css("border-radius", mini/2)
        $('.full-size-circle').css("margin-left", $('.full-size-circle-container').width()/2 - mini/2)
      }
    }

    angular.element($window).bind('resize', function() {
      if(window.location.pathname == '/' || window.location.pathname == '/home'){
        $rootScope.resizeCircle();
      }
    });

    // We watch every click to un focus some elements
    $scope.looseFocusItem = function(){
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


        olark('api.visitor.updateEmailAddress', {emailAddress: $rootScope.accountEmail});
        olark('api.visitor.updateFullName', {fullName: $rootScope.accountName});
        olark('api.box.show');

        $rootScope.olarkSet = true;

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
