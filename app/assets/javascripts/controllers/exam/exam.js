(function(){
  angular
    .module('mainApp.controllers')
    .controller('examCtrl', examCtrl)

  examCtrl.$digest = ['cookiesService', '$rootScope', '$scope', 'Restangular', 'Notification', 'spinnerService', '$translate'];
  function examCtrl(cookiesService, $rootScope, $scope, Restangular, Notification, spinnerService, $translate){

    var success,
      error;

    $translate(['SUCCESS', 'ERROR']).then(function (translations) {
      success = translations.SUCCESS;
      error = translations.ERROR;
    });

    $rootScope.contentLoaded = true;
    cookiesService.reload()
    

  }
})();




