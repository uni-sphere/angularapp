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

    $scope.deleteNodeAll = function(){
      $scope.realDeleteNode(false)
    }

    $scope.deleteNodeTransfer = function(){
      $scope.realDeleteNode(true)
    }

    $scope.deleteNodeCancel = function(){
      $scope.deleteNodeView = false;
      $('#grey-background').fadeOut();
    }


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






