(function(){
  angular
    .module('mainApp.controllers')
    .controller('DownloadHandInModalCtrl', DownloadHandInModalCtrl)

  DownloadHandInModalCtrl.$inject = ['$scope', 'close', 'url', '$timeout']
  function DownloadHandInModalCtrl($scope, close, url, $timeout){

    $scope.documentUrl = url
    $scope.download = download

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
    }, 1000);

    $scope.dismissModal = function(result) {
      $('.modal-container').addClass("modal-ready-to-disappear")
      close(result, 300);
    };

  }
})()
