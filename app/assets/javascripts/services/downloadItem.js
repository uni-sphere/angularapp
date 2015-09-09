(function () {
  'use strict';
  angular.module('mainApp.directives').service('downloadItem', ['usSpinnerService', function(usSpinnerService) {
    return function(nodeProtected, title) {
      if(['png','jpg','pdf'].indexOf(node.$modelValue.title.substr(node.$modelValue.title.lastIndexOf('.') + 1).toLowerCase()) > -1){
        var preview = true
      } else{
        var preview = false
      }

      if(!nodeProtected){
        Restangular.one('awsdocuments', node.$modelValue.doc_id).get({node_id: scope.nodeEnd[0], chapter_id: node.$modelValue.parent}).then(function(mydoc){
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
            node_id: scope.nodeEnd[0],
            chapter_id: node.$modelValue.parent,
            preview: preview,
            demo: scope.sandbox || scope.home,
            doc_id: node.$modelValue.doc_id
          }
        }).then(function(modal) {
          modal.close.then(function(result) {
          });
        });
      }
    }
  }]);
}());
