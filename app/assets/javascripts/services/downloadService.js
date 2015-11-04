(function () {
  angular
    .module('mainApp.services')
    .service('downloadService', downloadService)

  downloadService.$inject = ['Restangular', 'ModalService', 'Notification', '$translate']
  function downloadService(Restangular, ModalService, Notification, $translate){

    var service = {
      download: download
    };

    var error;

    $translate(['ERROR']).then(function (translations) {
      error = translations.error;
    });

    return service;

    function download(nodeProtected, title, doc_id, chapter_id, node_id){

      if(['png','jpg','pdf'].indexOf(title.substr(title.lastIndexOf('.') + 1).toLowerCase()) > -1){
        var preview = true
      } else{
        var preview = false
      }

      // if(['pdf'].indexOf(title.substr(title.lastIndexOf('.') + 1).toLowerCase()) > -1){
      //   var download = false
      // } else{
      //   var download = true
      // }

      var download = true


      function callModalLocked(){
        ModalService.showModal({
          templateUrl: "webapp/download-protected-doc-modal.html",
          controller: "DownloadProtectedProtectedDocModal",
          inputs:{
            node_id: node_id,
            chapter_id: chapter_id,
            preview: preview,
            doc_id: doc_id,
            download: download
          }
        }).then(function(modal) {
          modal.close.then(function(result) {
          });
        });
      }

      if(!nodeProtected){
        Restangular.one('awsdocuments', doc_id).get({node_id: node_id, chapter_id: chapter_id}).then(function(mydoc){
          ModalService.showModal({
            templateUrl: "webapp/download-doc-modal.html",
            controller: "DownloadDocModalCtrl",
            inputs:{
              url: mydoc,
              preview: preview,
              download: download
            }
          }).then(function(modal) {
            modal.close.then(function(result) {
            });
          });

        },function(d){
          if(d.status == 403){
            // If we receive a 403 it means the node has been locked by the admin, while the user didnt refresh
            callModalLocked()
          } else{
            console.log(d);
            console.log("Error: download link")
            Notification.error(error)
          }
        });
      } else{
        callModalLocked()
      }
    }

  }
})();
