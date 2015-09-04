(function(){
angular
  .module('mainApp.controllers')
  .controller('ModalCtrl', ['$scope', 'close', 'url', '$timeout', function ($scope, close, url, $timeout) {

    $scope.documentUrl = url

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
    }, 1000);

    $scope.dismissModal = function(result) {
      $('.modal-container').addClass("modal-ready-to-disappear")
      close(result, 300);
    };

  }])
})()
