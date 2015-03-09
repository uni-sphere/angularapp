angular
  .module('myApp')
  .controller('HomeCtrl', ['$scope', function ($scope) {
    $scope.chapters =  ['Algèbre', 'Equation', 'Matrice'];
    $scope.documents = ['polynome 1er', 'polynome 2iem', 'factorisation'];
    $scope.selectedChapter = 'Algèbre';

    $scope.selectChapter = function(i) {
      $scope.selectedChapter = $scope.chapters[i];
    }
  }]);