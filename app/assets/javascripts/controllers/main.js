(function(){
  angular
    .module('mainApp.controllers')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$q', 'ModalService', 'cookiesService', '$window', '$rootScope', '$scope','$timeout', 'Restangular', '$auth', '$state', 'Notification', '$translate']
  function MainCtrl($q, ModalService, cookiesService, $window, $rootScope, $scope, $timeout, Restangular, $auth, $state, Notification, $translate){

    $translate(['ERROR']).then(function (translations) {
      $rootScope.errorMessage = translations.ERROR;
    });

    // // We initialise the upload form
    // $scope.setForm = function(form){
    //   $rootScope.uploadForm = form
    // }

    // $rootScope.stopWatch = function(){
    //   console.log("Stop Watch")
    //   $rootScope.watchNodeEnd()
    // }

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
      getUniInfo().then(function(){
        userAuth()
      })
    }

    if(window.location.host == 'localhost:3000'){
      $rootScope.local = true
    }

    /*==========  Function  ==========*/

    function userAuth(){
      $auth.validateUser().then(function(userInfo){
        // Ok we found cookies
        console.log("Ok: user signed in")
        $rootScope.signin(userInfo)
      }, 
      // We didn't find cookies. We will show the signin modal
      function(d){
        console.log("Ok: Signin in progress....")

        // We load the tree
        cookiesService.reload()

        if($rootScope.fullVersion){
          $rootScope.callSignInModal()
        }
      })
    }

    function getUniInfo(){
      return $q(function(resolve, reject){
        Restangular.one('organization').get().then(function (university) {
          // console.log(university.organization)
          $rootScope.fullVersion = university.organization.full_version
          $rootScope.university = university.organization.name
          $rootScope.universityId = university.organization.id
          console.log("Ok: get organization")
          resolve();
        }, function(d){
          reject()
          console.log("Error: get organization");
          console.log(d)
          Notification.error($rootScope.errorMessage);
        });
      })
    }

    $rootScope.callSignInModal = function(){
      ModalService.showModal({
        templateUrl: "modal/signin-modal.html",
        controller: "SigninModalCtrl",
        inputs:{
        }
      }).then(function(modal) {
        modal.close.then(function(result){
          if(result){
          }
        });
      });
    }

    function getUserInfo(user){ 
      $rootScope.accountEmail = user.email
      $rootScope.accountName = user.name
      $rootScope.help = user.help
      $rootScope.superadmin = user.superadmin
      $rootScope.userId = user.id
      $rootScope.admin = user.admin
      $rootScope.news = user.news
    }

    $rootScope.signin = function(userInfo){
      getUserInfo(userInfo)
      olarkConfig()
      handleNews()
      getAllUserFromOrganization()
    }

    function olarkConfig(){
      if(!$rootScope.local && !$rootScope.admin){
        olark('api.visitor.updateEmailAddress', {emailAddress: $rootScope.accountEmail});
        olark('api.visitor.updateFullName', {fullName: $rootScope.accountName});
        olark('api.box.show');
      }
    }

    function handleNews(){
      if($rootScope.news){
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
    }

    function getAllUserFromOrganization(){
      if($rootScope.admin){
        Restangular.one('users').get().then(function (listUser) {
          $rootScope.listUser = listUser.users
          console.log("Ok: get all user")

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
          Notification.error($rootScope.errorMessage)
          console.log(d)
        });
      }
    }

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

  }
})();
