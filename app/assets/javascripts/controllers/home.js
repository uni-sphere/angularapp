angular
  .module('myApp')
  .controller('HomeCtrl', ['$scope', function ($scope) {
    // $scope.chapters =  chapters;
    $scope.documents = ['polynome 1er', 'polynome 2iem', 'factorisation'];
    $scope.selectedChapter = 'Algèbre';

    $scope.selectChapter = function(i) {
      $scope.selectedChapter = $scope.chapters[i];
    };

    $scope.addChapter = function(){
      $scope.chapters.push({

      })
    }
  }]);