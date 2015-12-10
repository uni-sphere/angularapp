(function(){
angular
  .module('mainApp.controllers')
  .controller('DragNDropModalCtlr', DragNDropModalCtlr)

  DragNDropModalCtlr.$inject = ['uploadService', '$rootScope', '$scope', 'files', 'close', '$timeout', 'Notification', '$translate'];
  function DragNDropModalCtlr(uploadService, $rootScope, $scope, files, close, $timeout, Notification, $translate){

    $translate(['NW_RENAME']).then(function (translations) {
      rename = translations.NW_RENAME;
    });

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
    }, 1000);

    $scope.dismissModal = function(result){
      $('.modal-container').addClass("modal-ready-to-disappear")
      close(result, 300);
    }

    function uploadFile(position){
      if(files.type === "" && !rootScope.isChrome){
        Notification.error(chrome_error)
      }
      else if(files[0].type != "directory" && $rootScope.uploadForm.$error.maxSize){
        Notification.error(size_error)
      }
      else{
        uploadService.upload(files, position, $rootScope.nodeEnd[0], $rootScope.listItems).then(function(){
          files = undefined
        })
      }
      $scope.dismissModal(false)
    }

    $scope.selectDrop = function(position){
      uploadFile(position)
    }

    $scope.rootSelected = function(){
      uploadFile(undefined)
    }

  }
})()
