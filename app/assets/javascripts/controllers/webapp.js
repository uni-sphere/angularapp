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

    // $scope.$watch('nodeEnd',function(newVals, oldVals){
    //   console.log(newVals)
    // });



    // First we get the nodes
    Restangular.one('nodes').get().then(function (nodes) {
      console.log("Ok: node retrieved")
      $scope.flatNode = nodes.plain();
      $scope.nodes = $scope.makeNested(nodes.plain())
      $scope.cookieGestion(nodes.plain(), $scope.nodes);

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






