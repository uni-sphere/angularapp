(function () {
  'use strict';
  angular.module('mainApp.directives').service('downloadItem', ['Restangular', 'ModalService', 'Notification', function(Restangular, ModalService, Notification) {
    return function(nodeProtected, title, doc_id, chapter_id, node_id) {

      if(['png','jpg','pdf'].indexOf(title.substr(title.lastIndexOf('.') + 1).toLowerCase()) > -1){
        var preview = true
      } else{
        var preview = false
      }

      function callModalLocked(){
        ModalService.showModal({
          templateUrl: "webapp/download-protected-doc-modal.html",
          controller: "DownloadProtectedProtectedDocModal",
          inputs:{
            node_id: node_id,
            chapter_id: chapter_id,
            preview: preview,
            doc_id: doc_id
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
              preview: preview
            }
          }).then(function(modal) {
            modal.close.then(function(result) {
            });
          });

        },function(d){
          if(d.status == 403){
            callModalLocked()
          } else{
            console.log(d);
            console.log("Error: download doc")
            Notification.error("Error while getting download link")
          }
        });
      } else{
        callModalLocked()
      }
    }
  }]);
}());
