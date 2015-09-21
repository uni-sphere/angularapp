(function(){
angular
  .module('mainApp.controllers')
  .controller('DocumentsCtrl', ['$scope', 'Restangular','Notification', 'document_id', 'downloadItem', function ($scope, Restangular, Notification, document_id, downloadItem) {

    Restangular.one('awsdocuments', document_id).get().then(function(myDocument){
      console.log(myDocument.plain())
      $scope.locked = myDocument.locked
      $scope.node_id = myDocument.node_id
      $scope.docViewName = myDocument.document[0].title
      $scope.myChapter_id = myDocument.document[0].chapter_id
      $scope.myDoc_id = myDocument.document[0].id
    },function(d){
      console.log(d);
      console.log("Error: getting restrained documents")
      Notification.error("Error while getting the documents")
    });
    
    $scope.downloadDoc = function(){
      downloadItem($scope.locked, $scope.docViewName, false, $scope.myDoc_id, $scope.myChapter_id, $scope.node_id)
    }
    
  }]);
})();
