(function(){
angular
  .module('mainApp.controllers')
  .controller('DownloadDocModalCtrl', ['$scope', 'close', 'url', '$timeout', 'preview', function ($scope, close, url, $timeout, preview) {

    $scope.documentUrl = url
    $scope.preview = preview

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
    }, 1000);

    $scope.dismissModal = function(result) {
      $('.modal-container').addClass("modal-ready-to-disappear")
      close(result, 300);
    };

  }])
})()
