(function () {
  'use strict';
  angular.module('mainApp.directives').service('downloadItem', ['Restangular', 'ModalService', 'Notification', function(Restangular, ModalService, Notification) {
    return function(nodeProtected, title, demo, doc_id, chapter_id, node_id) {
      if(['png','jpg','pdf'].indexOf(title.substr(title.lastIndexOf('.') + 1).toLowerCase()) > -1){
        var preview = true
      } else{
        var preview = false
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
          console.log(d);
          console.log("Error: download doc")
          Notification.error("Error while getting download link")
        });
      } else{
        ModalService.showModal({
          templateUrl: "webapp/download-protected-doc-modal.html",
          controller: "DownloadProtectedProtectedDocModal",
          inputs:{
            node_id: node_id,
            chapter_id: chapter_id,
            preview: preview,
            demo: demo,
            doc_id: doc_id
          }
        }).then(function(modal) {
          modal.close.then(function(result) {
          });
        });
      }
    }
  }]);
}());
