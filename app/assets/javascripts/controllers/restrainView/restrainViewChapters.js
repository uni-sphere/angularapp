(function(){
  angular
    .module('mainApp.controllers')
    .controller('restrainViewChaptersCtrl', restrainViewChaptersCtrl)

  restrainViewChaptersCtrl.$inject = ['$scope', 'Restangular','Notification', 'chapter_id', 'makeNestedService', 'downloadService', 'createIndexChaptersService', '$translate'];
  function restrainViewChaptersCtrl($scope, Restangular, Notification, chapter_id, makeNestedService, downloadService, createIndexChaptersService, $translate){

    var error;

    $translate(['ERROR']).then(function (translations) {
      error = translations.ERROR;
    });

    Restangular.one('chapters', chapter_id).get().then(function(flatChapters){
      if(flatChapters.tree[0].title == 'main'){
        $scope.rootchapter = flatChapters.name
      } else{
        $scope.rootchapter = flatChapters.tree[0].title;
      }
      $scope.locked = flatChapters.locked
      $scope.node_id = flatChapters.node_id
      $scope.listItems = makeNestedService.item(flatChapters.tree)
      createIndexChaptersService.create($scope.listItems)
    },function(d){
      console.log(d);
      console.log("Error: getting restrained chapters")
      Notification.error(error)
    });

    $scope.downloadItem = function(node){
      downloadService.download($scope.locked, node.$modelValue.title, node.$modelValue.doc_id, node.$modelValue.parent, $scope.node_id)
    }
  }
})();
