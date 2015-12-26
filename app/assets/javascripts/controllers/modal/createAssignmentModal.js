(function(){
  angular
    .module('mainApp.controllers')
    .controller('createAssignmentModalCtrl', createAssignmentModalCtrl)

  createAssignmentModalCtrl.$inject = ['$scope', 'close', 'url', '$timeout']
  function createAssignmentModalCtrl($scope, close, url, $timeout){

    console.log($rootScope.nodeEnd)
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
