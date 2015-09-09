(function(){
angular
  .module('mainApp.controllers')
  .controller('ChaptersCtrl', ['$scope', 'Restangular','Notification', 'chapter_id', 'makeNested', 'createChap', function ($scope, Restangular, Notification, chapter_id, makeNested, createChap) {

    Restangular.one('chapters', chapter_id).get().then(function(flatChapters){
      console.log(flatChapters.tree)
      flatChapters.tree.shift()
      // console.log(flatChapters.locked)
      $scope.listItems = makeNested(flatChapters.tree)
      createChap($scope.listItems)
    },function(d){
      console.log(d);
      console.log("Error: getting restrained chapters")
      Notification.error("Error while getting the chapters")
    });



  }]);
})();
