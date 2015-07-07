(function(){
angular
  .module('mainApp.controllers')
  .controller('FoldCtrl', ['$scope', 'Restangular', 'ipCookie', function ($scope, Restangular, ipCookie) {


    // At init collapse items in cookie
    $scope.collapseItems = function(scope) {
      if($scope.chapterFolded == undefined){
        scope.toggle();
      } else{
        if(!isInArray(scope.$modelValue.id,$scope.chapterFolded)){
          scope.toggle();
        }
      }
    }

    $scope.toggleItems = function(scope) {
      if(scope.$childNodesScope.$modelValue != undefined){
        scope.toggle();
        addTochapterFolded(scope.$modelValue.id);

        if($scope.lastDeployedPosition != undefined){
          delete $scope.lastDeployedPosition.$modelValue.activeItem;
        }
        scope.$modelValue.activeItem = true;
      }
    };

    // Add folded chapters to cookie
    function addTochapterFolded(nb){
      if($scope.chapterFolded == undefined){
        $scope.chapterFolded = [nb.toString()];
      } else if(isInArray(nb,$scope.chapterFolded)){
        var index = $scope.chapterFolded.indexOf(nb.toString());
        $scope.chapterFolded.splice(index, 1);
      } else{
        $scope.chapterFolded.push(nb.toString());
      };
      ipCookie('chapterFolded', $scope.chapterFolded);
    }

    function isInArray(value, array) {
      return array.indexOf(value.toString()) > -1;
    }

  }]);
})();
