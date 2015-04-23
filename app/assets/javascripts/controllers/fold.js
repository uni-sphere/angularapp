(function(){
angular
  .module('mainApp.controllers')
  .controller('FoldCtrl', ['$scope', 'Restangular', '$cookies', function ($scope, Restangular, $cookies) {
    
    // Find the chapter that are folded
    var chapterFolded = $cookies.get('chapterFolded');

    if( chapterFolded != undefined ){
      chapterFolded = chapterFolded.split(',');
      if(!isInArray(0,chapterFolded)){
        chapterFolded.push("0");
      }
    }else{
      chapterFolded =["0"];
    }

    // At init collapse items in cookie
    $scope.collapseItems = function(scope) {
      if(chapterFolded == undefined){
        scope.toggle();
      } else{
        // console.log(scope.$modelValue.items);
        // console.log(scope.$modelValue.items.length);

        if(!isInArray(scope.$modelValue.id,chapterFolded)){
          scope.toggle();
        };
      }


    }

    $scope.toggleItems = function(scope) {
      // console.log("hello");
      if(scope.$childNodesScope.$modelValue != undefined){
        scope.toggle();
        addToChapterFolded(scope.$modelValue.id);

        if($scope.lastDeployedPosition != undefined){
          delete $scope.lastDeployedPosition.$modelValue.activeItem;
        }
        scope.$modelValue.activeItem = true;


        // save latest collapse position in case of dropped file
        if(scope.collapsed && scope.$parentNodeScope!= undefined){
          $scope.lastDeployedPosition = scope.$parentNodeScope;
        } else{
          $scope.lastDeployedPosition = scope;
        }
      }
    };

    // Add folded chapters to cookie
    function addToChapterFolded(nb){
      if(chapterFolded == undefined){
        chapterFolded = [nb.toString()];
      } else if(isInArray(nb,chapterFolded)){
        var index = chapterFolded.indexOf(nb.toString());
        chapterFolded.splice(index, 1);
      } else{
        chapterFolded.push(nb.toString());
      };
      $cookies.put('chapterFolded', chapterFolded);
    }

    function isInArray(value, array) {
      return array.indexOf(value.toString()) > -1;
    }

    

  }]);
})();