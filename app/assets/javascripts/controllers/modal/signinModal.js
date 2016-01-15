(function(){
  angular
    .module('mainApp.controllers')
    .controller('SigninModalCtrl', SigninModalCtrl)

  SigninModalCtrl.$inject = ['$auth', '$translate', '$rootScope', '$scope', 'close', '$timeout', 'Restangular', 'Notification']
  function SigninModalCtrl($auth, $translate, $rootScope, $scope, close, $timeout, Restangular, Notification){

    // We watch when admin changes to know when to remove the signin
    var watchAdmin = $rootScope.$watch('admin', function (newVals, oldVals) {
      if(newVals != undefined){
        watchAdmin()
        $scope.dismissModal()
      }
    });

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
    }, 1000);

    $scope.dismissModal = function(result) {
      $('.modal-container').addClass("modal-ready-to-disappear")
      close(result, 300);
    };

  }
})()
