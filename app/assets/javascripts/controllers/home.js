(function(){
angular
  .module('myApp')
  .controller('HomeCtrl', ['$scope', 'chapters', function ($scope, chapters) {
    $scope.chapters = null;

    chapters.get().then(function(response) {
      $scope.chapters = response.data.chapters;
    });

    $scope.documents = ['polynome 1er', 'polynome 2iem', 'factorisation'];
    $scope.selectedChapter = 'Algèbre';

    // $scope.selectChapter = function(i) {
    //   $scope.selectedChapter = $scope.chapters[i];
    // };

    // $scope.addChapter = function(){
    //   $scope.chapters.push({

    //   })
    // }
  }]);
})();