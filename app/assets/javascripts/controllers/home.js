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
    $scope.data = nodes;
    $scope.currentNode = nodes;
    // console.log($scope.currentNode.value);

    // console.log(nodes);

    // $scope.currentNode = {node: 'vide'};
    $scope.newNode = "";

    // scope.$watch('nodes', function(newVals, oldVals) {
    //   return scope.render(newVals, iElement);
    // }, true);
     
      // $scope.nodes.splice(1, 0, {
      //   name: 'hello',
      //   children: []
      // });

    // var found = getById($scope.nodes, 5);
    // console.log(found);
    // nodes.post().

    // var arr = Object.keys($scope.nodes).map(function (key) {return $scope.newNode[key]});

    // console.log($scope.currentNode);

    $scope.saveNewNode = function(){
      // $scope.addSiblingItem($scope.nodes,3);
     
      
      // $scope.nodes.
      // $scope.nodes[0].push({name: "yo"});
      // console.log($scope.currentNode.depth);
       // console.log($scope.currentNode);

      console.log($scope.nodes);
    };
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