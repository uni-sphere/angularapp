(function(){
angular
  .module('myApp.controllers')
  .controller('HomeCtrl', ['$scope', 'chapters', 'nodes', function ($scope, chapters, nodes) {
    $scope.chapters = null;

    // console.log(nodes);

    // Restangular.one('api/nodes.json').get().then(function(response){
    //   console.log(response);
    //   $scope.nodes = response;
    // })
    chapters.get().then(function(response) {
      $scope.chapters = response.data.chapters;
    });

    $scope.documents = ['polynome 1er', 'polynome 2iem', 'factorisation'];
    $scope.currentChapter = 'Algèbre';
    $scope.currentGroup = '1ère S';
    $scope.nodes = nodes;

    function deleteParentAttribute(d) {
      if (d.children) {
        d.children.forEach(deleteParentAttribute);

        delete d['parent']
      }
      console.log(d);
    }

 

    // function plop(d){
    //   JSON.stringify(d, function( key, value){
    //     return "";
    //     // console.log(d);
    //     // if (d.children) {
    //     //   console.log(d.key);
    //     //   // if (d.key == 'parent') {
    //     //   //   console.log('yo');
    //     //   //   return d.value.id;
    //     //   // } else{
    //     //   //   return d.value;
    //     //   // }
    //     // }
    //   });
    // }

    // console.log(nodes);
    // console.log(JSON.stringify(nodes));

    // JSON.stringify( nodes, function( key, value) {
    //   if( key == 'parent') { return value.id;}
    //   else {return value;}
    // }


    // nodes.forEach(plop);

    // console.log(nodes);
    // nodes.children.forEach(deleteParentAttribute);


    // console.log(nodes);
    $scope.cookies = [
      {
        name: "Lycée Freppel",
        children: 
        [
          {
            name: "2 nd",
            children: [
              {name: "1"},
              {name: "1"},
              {name: "3"}
            ]
          },
          {
            name: "1 ère",
            children: [
              { name: "S",
                children:
                [
                  { name: "1",
                    children: 
                    [
                      {name: "Math"},
                      {name: "Physic"}
                    ]
                  },
                  {name: "2"}
                ]
              },
              {name: "ES"},
              {name: "L"}
            ]
          }
        ]
      }
    ];


    // console.log(JSON.stringify($scope.cookies));
    $scope.currentNode = nodes;
    // console.log($scope.currentNode.value);

    // console.log(nodes);

    // $scope.currentNode = {node: 'vide'};
    // $scope.newNode = "";

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

      // console.log($scope.nodes);
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