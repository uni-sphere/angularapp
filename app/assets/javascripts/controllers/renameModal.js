(function(){
angular
  .module('mainApp.controllers')
  .controller('RenameModalCtrl', ['$scope', 'close', 'name', '$timeout', function ($scope, close, name, $timeout) {

    if(name.indexOf('.') > -1){
      var fileName = name.split('.')[0];
      var fileExtension = name.split('.')[1];
    } else{
      var fileName = name
    }

    $scope.renameModalName = fileName
    $scope.renameModalToDisplay = fileName

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
      $('.modal-input').focus()
    }, 1000);

    $scope.dismissModal = function(){
      $('.modal-container').addClass("modal-ready-to-disappear")
      close('',300);
    }

    $scope.renameModal = function() {
      $('.modal-container').addClass("modal-ready-to-disappear")
      if(fileExtension){
        if($scope.renameModalName.indexOf('.') > -1){
          var result = $scope.renameModalName.split('.')[0] + '.' + fileExtension;
        } else{
          var result = $scope.renameModalName + '.' + fileExtension
        }
      } else{
        var result = $scope.renameModalName
      }
      close(result, 300);
    }

  }])
})()
