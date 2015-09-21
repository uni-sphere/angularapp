(function(){
angular
  .module('mainApp.controllers')
  .controller('ChaptersCtrl', ['$scope', 'Restangular','Notification', 'chapter_id', 'makeNested', 'createChap', 'downloadItem', function ($scope, Restangular, Notification, chapter_id, makeNested, createChap, downloadItem) {

    Restangular.one('chapters', chapter_id).get().then(function(flatChapters){
      var rootchapter = flatChapters.tree.shift()
      if(rootchapter.title == 'main'){
        $scope.rootchapter = flatChapters.name
      } else{
        $scope.rootchapter = rootchapter.title;
      }

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
      downloadItem($scope.locked, node.$modelValue.title, node.$modelValue.doc_id, node.$modelValue.parent,$scope.node_id)
    }

  }]);
})();
