(function(){
angular
  .module('mainApp.controllers')
  .controller('ChaptersCtrl', ['$scope', 'Restangular','Notification', 'chapter_id', 'makeNested', 'createChap', 'downloadItem', function ($scope, Restangular, Notification, chapter_id, makeNested, createChap, downloadItem) {

    Restangular.one('chapters', chapter_id).get().then(function(flatChapters){
      flatChapters.tree.shift()
      $scope.locked = flatChapters.locked
      $scope.node_id = flatChapters.node_id
      $scope.listItems = makeNested(flatChapters.tree)
      createChap($scope.listItems)
    },function(d){
      console.log(d);
      console.log("Error: getting restrained chapters")
      Notification.error("Error while getting the chapters")
    });

    $scope.downloadItem = function(node){
      // console.log(node.$modelValue)
      downloadItem($scope.locked, node.$modelValue.title, false, node.$modelValue.doc_id, node.$modelValue.parent,$scope.node_id)
    }



  }]);
})();
