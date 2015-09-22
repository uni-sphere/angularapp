(function () {
  angular
    .module('mainApp.directives')
    .directive('dragndropView', dragndropView)

  dragndropView.$inject = ['uploadService']
  function dragndropView(uploadService){
    var directive = {
      link: link,
      templateUrl: 'webapp/dragndrop-view.html',
      scope:{
        listItems: '=',
        files: '=',
        nodeEnd: '=',
        myupload: '=',
        isChrome: '=',
        userId: '=',
        chapterFolded: '='
      }
    };

    return directive;

    function link(scope){

      // We watch when someone drag and drops a file / folder
      scope.$watch('files', function (newVals, oldVals) {
        if(newVals){
          uploadService.upload(scope.files, undefined, scope.nodeEnd[0], scope.listItems, scope.chapterFolded);
          // if(!scope.nodeEnd){
          //   Notification.error("Select a lead node to upload files")
          // } else{
          //    console.log("Ok: File Dropped")
          //   $('#grey-background').fadeIn();
          //   $('#fileDropped').fadeIn();
          // }
        }
      });

      scope.selectDrop = function(position){
        uploadService.upload(scope.files, position, scope.nodeEnd[0], scope.listItems, scope.chapterFolded);
        $('#fileDropped').fadeOut(300);
        $('#grey-background').fadeOut();
      }

      scope.rootSelected = function(){
        $('#fileDropped').fadeOut();
        uploadService.upload(scope.files, true, undefined, scope.nodeEnd[0], scope.userId, scope.listItems, scope.chapterFolded);
      }

      scope.cancelDrop = function(){
        $('#grey-background').fadeOut();
        $('#fileDropped').fadeOut();
      }


    }
  }
}());
