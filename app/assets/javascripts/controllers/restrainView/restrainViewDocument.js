(function(){
  angular
    .module('mainApp.controllers')
    .controller('restrainViewDocumentCtrl', restrainViewDocumentCtrl)

  restrainViewDocumentCtrl.$inject = ['$scope', 'Restangular','Notification', 'document_id', 'downloadService', '$translate'];
  function restrainViewDocumentCtrl($scope, Restangular, Notification, document_id, downloadService, $translate){
    
    var error;
    
    $translate(['ERROR']).then(function (translations) {
      error = translations.ERROR;
    });
    
    Restangular.one('awsdocuments', document_id).get().then(function(myDocument){
      $scope.locked = myDocument.locked
      $scope.node_id = myDocument.node_id
      $scope.docViewName = myDocument.document[0].title
      $scope.myChapter_id = myDocument.document[0].chapter_id
      $scope.myDoc_id = myDocument.document[0].id
    },function(d){
      console.log(d);
      console.log("Error: getting restrained documents")
      Notification.error(error)
    });

    $scope.downloadDoc = function(){
      downloadService.download($scope.locked, $scope.docViewName, $scope.myDoc_id, $scope.myChapter_id, $scope.node_id)
    }

   }
})();
