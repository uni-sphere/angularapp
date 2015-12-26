(function () {
  angular
    .module('mainApp.directives')
    .directive('dragndropView', dragndropView)

  dragndropView.$inject = ['ModalService', 'uploadService', '$rootScope', 'Notification', '$translate']
  function dragndropView(ModalService, uploadService, $rootScope, Notification, $translate){

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

          ModalService.showModal({
            templateUrl: "webapp/dragndrop-modal.html",
            controller: "DragNDropModalCtlr",
            inputs:{
              files: newVals
            }
          })
        }
      });

    }
  }
}());
