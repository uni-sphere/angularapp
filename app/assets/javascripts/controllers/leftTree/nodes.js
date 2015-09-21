(function(){
  angular
    .module('mainApp.controllers')
    .controller('nodesCtrl', nodesCtrl)

  nodesCtrl.$inject = ['$scope', 'Restangular'];
  function nodesCtrl($scope, Restangular){

    // scope.cookieGestion = function(flatNode, nodes){
    //   var nodeIDs = []
    //   angular.forEach(flatNode, function(value,key){
    //     nodeIDs.push(value.num)
    //   });

    //   // We look if the node in the cookies still exist
    //   if(ipCookie('nodeEnd') && nodeIDs.indexOf(ipCookie('nodeEnd')[0]) > -1){
    //     console.log('Ok: cookies - no problem')
    //     scope.activeNodes = ipCookie('activeNodes');
    //     scope.nodeEnd = ipCookie('nodeEnd');
    //   } else{
    //     console.log('Ok: cookies - problems')
    //     scope.activeNodes = []
    //     setInitialCookies(nodes)
    //     changeBreadcrumb()
    //     ipCookie('activeNodes', scope.activeNodes);
    //     ipCookie('nodeEnd', scope.nodeEnd);
    //   }


    //   scope.foldedNodes = [];
    //   angular.forEach(ipCookie('foldedNodes'), function(value,key){
    //     if(nodeIDs.indexOf(value) > -1){
    //       scope.foldedNodes.push(value)
    //     }
    //   });
    // }

    // function setInitialCookies(node){
    //   if(node.children){
    //     scope.activeNodes.unshift([node.num, node.name])
    //     return setInitialCookies(node.children[0])
    //   } else{
    //     scope.activeNodes.unshift([node.num, node.name])
    //     scope.nodeEnd = [node.num, node.name, node.user_id]
    //   }
    // }

    // scope.reloadNodes = function(){
    //   Restangular.one('nodes').get().then(function (nodes) {
    //     console.log("Ok: node retrieved")
    //     scope.flatNode = nodes.plain();
    //     scope.nodes = makeNested(scope.flatNode)
    //     scope.cookieGestion(scope.flatNode, scope.nodes);

    //     render(scope.nodes, iElement);
    //   }, function(d){
    //     Notification.error("Can not display your tree")
    //     console.log("Error: Get nodes");
    //     console.log(d)
    //   });
    // }

    // scope.$watch('admin', function(newVals, oldVals){
    //   if(newVals != undefined){
    //     scope.reloadNodes()
    //   }
    // });

  }
})()
