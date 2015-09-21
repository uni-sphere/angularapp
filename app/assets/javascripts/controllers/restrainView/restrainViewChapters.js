(function(){
  angular
    .module('mainApp.controllers')
    .controller('restrainViewChaptersCtrl', restrainViewChaptersCtrl)

  restrainViewChaptersCtrl.$inject = ['$scope', 'Restangular','Notification', 'chapter_id', 'makeNestedItemService', 'downloadService', 'createIndexChaptersService'];
  function restrainViewChaptersCtrl($scope, Restangular, Notification, chapter_id, makeNestedItemService, downloadService, createIndexChaptersService){
    Restangular.one('chapters', chapter_id).get().then(function(flatChapters){
      var rootchapter = flatChapters.tree.shift()
      if(rootchapter.title == 'main'){
        $scope.rootchapter = flatChapters.name
      } else{
        $scope.rootchapter = rootchapter.title;
      }

      $scope.locked = flatChapters.locked
      $scope.node_id = flatChapters.node_id
      $scope.listItems = makeNestedItemService.create(flatChapters.tree)
      createIndexChaptersService.create($scope.listItems)
    },function(d){
      console.log(d);
      console.log("Error: getting restrained chapters")
      Notification.error("Error while getting the chapters")
    });

    $scope.downloadItem = function(node){
      downloadService.download($scope.locked, node.$modelValue.title, node.$modelValue.doc_id, node.$modelValue.parent,$scope.node_id)
    }
  }
})();
