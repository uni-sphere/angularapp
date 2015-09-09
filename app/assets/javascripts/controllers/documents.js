(function(){
angular
  .module('mainApp.controllers')
  .controller('DocumentsCtrl', ['$scope', 'Restangular','Notification', 'document_id', function ($scope, Restangular, Notification, document_id) {

    Restangular.one('awsdocuments', document_id).get().then(function(flatDocuments){
      console.log(flatDocuments.plain())
    },function(d){
      console.log(d);
      console.log("Error: getting restrained documents")
      Notification.error("Error while getting the documents")
    });


  }]);
})();
