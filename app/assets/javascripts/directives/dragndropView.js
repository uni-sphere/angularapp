(function () {
  angular
    .module('mainApp.directives')
    .directive('dragndropView', dragndropView)

  dragndropView.$inject = ['uploadService', '$rootScope', 'Notification', '$translate']
  function dragndropView(uploadService, $rootScope, Notification, $translate){

    var directive = {
      link: link,
      templateUrl: 'webapp/dragndrop-view.html',
      scope:{
        files: '=',
        myupload: '=',
      }
    };

    return directive;

    function link(scope){

      var chrome_error,
        size_error;

      $translate(['CHROME_ERROR', 'NE_SIZE']).then(function (translations) {
        chrome_error = translations.CHROME_ERROR;
        size_error = translations.NE_SIZE;
      });

      // We watch when someone drag and drops a file / folder
      scope.$watch('files', function (newVals, oldVals) {
        if(newVals){
          console.log("Ok: File Dropped")
          $('#grey-background').fadeIn();
          $('#fileDropped').fadeIn();
        }
      });

      function uploadFile(position){
        if(scope.files[0].type === "" && !rootScope.isChrome){
          Notification.error(chrome_error)
        }
        else if(scope.files[0].type != "directory" && $rootScope.uploadForm.$error.maxSize){
          Notification.error(size_error)
        }
        else{
          uploadService.upload(scope.files, position, $rootScope.nodeEnd[0], $rootScope.listItems);
        }
        $('#fileDropped').fadeOut(300);
      }

      scope.selectDrop = function(position){
        uploadFile(position)
      }

      scope.rootSelected = function(){
        uploadFile(undefined)
      }

      scope.cancelDrop = function(){
        $('#grey-background').fadeOut();
        $('#fileDropped').fadeOut();
      }
    }
  }
}());
