(function(){
  angular
  .module('mainApp.controllers')
  .controller('WebappCtrl', ['$scope', 'Restangular', 'Notification', 'ipCookie', function ($scope, Restangular, Notification, ipCookie) {

    $scope.makeNested = function(flatData){
      var dataMap = flatData.reduce(function(map, node) {
        map[node.num] = node;
        return map;
      }, {});

      var treeData = [];
      flatData.forEach(function(node) {
        var parent = dataMap[node.parent];
        if (parent) {
          (parent.children || (parent.children = []))
            .push(node);
        } else {
          treeData.push(node);
        }
      });
      return treeData[0];
    }

    // First we get the nodes
    Restangular.one('nodes').get().then(function (nodes) {
      if($scope.home || $scope.sandbox){
        console.log("Ok: node retrieved")
        flatNode = [
          {name: "Sandbox", num: 1, parent: 0},
          {name: "Seconde", num: 2, parent: 1},
          {name: "Première", num: 3, parent: 1},
          {name: "Terminale", num: 4, parent: 1},
          {name: "1", num: 6, parent: 2},
          {name: "2", num: 7, parent: 2},
          {name: "3", num: 8, parent: 2},
          {name: "S", num: 9, parent: 3},
          {name: "ES", num: 10, parent: 3},
          {name: "L", num: 11, parent: 3},
          {name: "S", num: 12, parent: 4},
          {name: "ES", num: 13, parent: 4},
          {name: "L", num: 14, parent: 4},
          {name: "Maths", num: 15, parent: 9},
          {name: "Anglais", num: 16, parent: 9},
          {name: "Histoire", num: 17, parent: 9}
        ]
        $scope.nodes = $scope.makeNested(flatNode)
        $scope.cookieGestion(flatNode, $scope.nodes);
      } else{
        console.log("Ok: node retrieved")
        $scope.flatNode = nodes.plain();
        $scope.nodes = $scope.makeNested($scope.flatNode)
        scope.cookieGestion(nodes.plain(), $scope.nodes);
      }


      // $scope.$watch('help', function(newVals, oldVals){
      //   if($scope.help){
      //     console.log("Ok: First co cookies")
      //     $scope.nodeEnd = [$scope.flatNode[1].num,$scope.flatNode[1].name]
      //     $scope.activeNodes = [[$scope.flatNode[0].num,$scope.flatNode[0].name],[$scope.flatNode[1].num,$scope.flatNode[1].name]]
      //     $scope.breadcrumb = [$scope.flatNode[1].name]
      //     ipCookie('activeNodes', $scope.activeNodes);
      //     ipCookie('nodeEnd', $scope.nodeEnd);
      //   }
      // });

    },
      function(d){
      Notification.error("Error while getting classes and documents informations. Refresh the page please.")
      console.log("Error: Get nodes");
      console.log(d)
    });



    /*==========  Location variable  ==========*/

    // function exploreNode(node, id){

    // }

    $scope.lookForNode = function(id,node){
      if(node == undefined){
        node = $scope.nodes
      }
      if(node.num == id){
      console.log(node)
        return node
      } else{
        angular.forEach(node.children, function(value, key){
          $scope.lookForNode(id, value)
        })
      }
    }



  }]);
})();






