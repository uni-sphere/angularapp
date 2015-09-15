(function(){
angular
  .module('mainApp.controllers')
  .controller('SetNodePswCtrl', ['$scope', 'close', 'name', '$timeout', 'Notification', function ($scope, close, name, $timeout, Notification) {

    Notification.clearAll()
    $scope.nameNode = name

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
      $('.modal-input').focus()
    }, 1000);

    $scope.dismissModal = function(){
      $('.modal-container').addClass("modal-ready-to-disappear")
      close('',300);
    }

    $scope.setPassword = function() {
      $('.modal-container').addClass("modal-ready-to-disappear")

      close($scope.nodePassword, 300);
    }

  }])
})()
