(function(){
  angular
    .module('mainApp.controllers')
    .controller('assignmentCtrl', assignmentCtrl)

  assignmentCtrl.$digest = ['$rootScope', '$scope', 'Restangular', 'Notification', 'spinnerService', '$translate'];
  function assignmentCtrl($rootScope, $scope, Restangular, Notification, spinnerService, $translate){

    var success,
      error;

    $translate(['SUCCESS', 'ERROR']).then(function (translations) {
      success = translations.SUCCESS;
      error = translations.ERROR;
    });

    $rootScope.contentLoaded = true;

  }
})();




