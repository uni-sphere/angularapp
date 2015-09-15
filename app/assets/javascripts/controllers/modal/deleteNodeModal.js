(function(){
angular
  .module('mainApp.controllers')
  .controller('DeleteNodeModalCtrl', ['$scope', 'close', 'allowTransfer', '$timeout', 'name', 'Notification', function ($scope, close, allowTransfer, $timeout, name, Notification) {

    Notification.clearAll()
    $scope.allowTransfer = allowTransfer
    $scope.nodeToDeleteName = name

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
    }, 1000);

    $scope.deleteNode = function(){
      $scope.dismissModal(false)
    }

    $scope.dismissModal = function(result){
      $('.modal-container').addClass("modal-ready-to-disappear")
      close(result, 300);
    }

    $scope.deleteTransferNode = function(result) {
      $scope.dismissModal(true)
    };

  }])
})()
