(function(){
angular
  .module('myApp.controllers')
  .controller('HomeCtrl', ['$scope', 'chapters', 'nodes', function ($scope, chapters, nodes) {
    $scope.chapters = null;

    chapters.get().then(function(response) {
      $scope.chapters = response.data.chapters;
    });

    $scope.documents = ['polynome 1er', 'polynome 2iem', 'factorisation'];
    $scope.currentChapter = 'Algèbre';
    $scope.currentGroup = '1ère S';
    $scope.nodes = nodes;

    // console.log($scope.nodes);
    // console.log($scope.chapters);

    // $scope.selectChapter = function(i) {
    //   $scope.selectedChapter = $scope.chapters[i];
    // };

    // $scope.addChapter = function(){
    //   $scope.chapters.push({

    //   })
    // }
  }]);
})();