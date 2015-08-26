(function(){
  angular
  .module('mainApp.controllers')
  .controller('WebappCtrl', ['$scope', 'Restangular', 'Notification', 'ipCookie', function ($scope, Restangular, Notification, ipCookie) {

    function makeNested(flatData){
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
      console.log("Ok: node retrieved. Cookie setup")
      $scope.flatNode = nodes.plain();
      var nodeIDs = []
      angular.forEach($scope.flatNode, function(value,key){
        nodeIDs.push(value.num)
      });

      $scope.nodes = makeNested($scope.flatNode)
      // Cookies gestion
      if($scope.home || $scope.sandbox){
        $scope.foldedNodes = [4];
        $scope.activeNodes = [[17,"Histoire"],[9,"S"],[3,"Premiere"],[1,"Sandbox"]];
        $scope.nodeEnd = [17,"Histoire"];
      } else{

        // We look if the node in the cookies still exist
        if(!ipCookie('nodeEnd') || nodeIDs.indexOf(ipCookie('nodeEnd')[0]) > -1){
          $scope.activeNodes = ipCookie('activeNodes');
          $scope.nodeEnd = ipCookie('nodeEnd');
        } else{
          if(!$scope.nodes.children[0].children && !$scope.nodes.children[0]._children){
            $scope.nodeEnd = [$scope.flatNode[1].num,$scope.flatNode[1].name]
          }
          $scope.activeNodes = [[$scope.flatNode[0].num,$scope.flatNode[0].name],[$scope.flatNode[1].num,$scope.flatNode[1].name]]
          $scope.breadcrumb = [$scope.nodes.children[1].name]
        }

        $scope.foldedNodes = [];
        angular.forEach(ipCookie('foldedNodes'), function(value,key){
          if(nodeIDs.indexOf(value) > -1){
            $scope.foldedNodes.push(value)
          }
        });


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
      Notification.error("Can not display your tree")
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






