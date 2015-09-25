(function(){
angular
  .module('mainApp.controllers')
  .controller('RenameModalCtrl', RenameModalCtrl)

  RenameModalCtrl.$inject = ['$scope', 'close', 'name', '$timeout', 'length', 'Notification', '$translate'];
  function RenameModalCtrl($scope, close, name, $timeout, length, Notification, $translate){

    var rename;

    $translate(['NW_RENAME']).then(function (translations) {
      rename = translations.NW_RENAME;
    });

    Notification.clearAll()
    $scope.length = length
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
      var input = $('.modal-input')
      input.focus();
      input[0].setSelectionRange(input.val().length, input.val().length);
    }, 1000);

    $scope.dismissModal = function(){
      $('.modal-container').addClass("modal-ready-to-disappear")
      close('',300);
    }

    $scope.renameModal = function() {
      if($scope.length > 0 && $scope.renameModalName.length > $scope.length){
        Notification.warning(rename)
        $('.modal-input').focus()
      } else{
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

    }

  }
})()
