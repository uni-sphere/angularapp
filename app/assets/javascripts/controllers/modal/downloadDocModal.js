(function(){
  angular
    .module('mainApp.controllers')
    .controller('DownloadDocModalCtrl', DownloadDocModalCtrl)

  DownloadDocModalCtrl.$inject = ['$scope', 'close', 'url', '$timeout', 'preview', 'download']
  function DownloadDocModalCtrl($scope, close, url, $timeout, preview, download){

    $scope.documentUrl = url
    $scope.preview = preview
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
