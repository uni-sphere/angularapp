(function () {
  angular
    .module('mainApp.services')
    .service('nodeService', nodeService)

  nodeService.$inject = ['$rootScope', 'ipCookie', 'createIndexChaptersService']
  function nodeService($rootScope, ipCookie, createIndexChaptersService){

    service = {
      changeNode: changeNode,
      findFoldedNodes: findFoldedNodes,
      findActiveNodes: findActiveNodes,
      findNodeEnd: findNodeEnd,
      collapseSelectively: collapseSelectively,
      colorActiveNodes: colorActiveNodes,
      findBreadCrumb: findBreadCrumb,
      findNode: findNode
    }

    return service;

    function changeNode(node){
      findNodeEnd(node);
      findActiveNodes(node);
      colorActiveNodes($rootScope.nodes);
      findBreadCrumb();
    }

    function findNode(id){
      res = false
      angular.forEach($rootScope.flatNode, function(value, key) {
        if(value.id == id){
          res = value
        }
      });
      return res
    }

    /*----------  Find nodeEnd  ----------*/

    function findNodeEnd(node){
      if((!node.children || node.children.length == 0 ) && (!node._children || node._children.length == 0)){
        $rootScope.nodeEnd = [node.num, node.name, node.user_id];

        $rootScope.nodeProtected = node.locked;
        $rootScope.listItems = node.items
        if(node.items != undefined && node.items.length != 0){
          createIndexChaptersService.create($rootScope.listItems)
        }

      } else{
        $rootScope.nodeEnd = false;
        $rootScope.listItems = []
      }
      ipCookie('nodeEnd', $rootScope.nodeEnd);

      // The nodeEnd has changed so we change the right Tree
      $rootScope.reloadRightTree()
    }

    /*----------  Active nodes  ----------*/

    function findActiveNodes(node){
      storageTemp = [];
      while(node.parent){
        storageTemp.push([node.num, node.name]);
        node = node.parent
      }
      $rootScope.activeNodes = storageTemp

      ipCookie('activeNodes', $rootScope.activeNodes);
    }

    /*----------  Folded nodes  ----------*/

    function findFoldedNodes(node){
      if(node._children){
        if($rootScope.foldedNodes.indexOf(node.id) == -1){
          $rootScope.foldedNodes.push(node.id)
        }
      } else{
        if($rootScope.foldedNodes.indexOf(node.id) > -1){
          $rootScope.foldedNodes.splice($rootScope.foldedNodes.indexOf(node.id), 1)
        }
      }
      ipCookie('foldedNodes', $rootScope.foldedNodes);
    }

    /*----------  Breadcumb gestion  ----------*/

    function findBreadCrumb(){
      tempBreadcrumb = [];
      for(var i = 0; i < $rootScope.activeNodes.length; i++){
        if(i < 2){
          tempBreadcrumb.unshift($rootScope.activeNodes[i][1]);
        } else if(i == 2){
          tempBreadcrumb.unshift("...");
        }
      }
      $rootScope.breadcrumb = tempBreadcrumb;
    }

    /*----------  Color activeNodes  ----------*/

    function colorActiveNodes(node){
      node.active = false;
      // console.log($rootScope.activeNodes)
      if(isInDoubleArray(node.num, $rootScope.activeNodes)){
        node.active = true;
      }
      if(node.children && node.children.length !=0){
        // console.log(node)
        angular.forEach(node.children, function(value, key){
          colorActiveNodes(value)
        })
      }
    }

    /*----------  Collapse nodes  ----------*/

    function collapseSelectively(node) {
      if(node.children && node.children.length != 0){
        node.children.forEach(collapseSelectively);

        if($rootScope.foldedNodes.indexOf(node.num) > -1){
          node._children = node.children;
          node.children = null;
        }
      }
    }

    /*----------  Array handling  ----------*/

    function isInArray(value, array) {
      return array.indexOf(value) > -1
    }

    function isInDoubleArray(value, doubleArray){
      if(value){
        var array = [];
        for( var i = 0; i < doubleArray.length; i++){
          array.push(doubleArray[i][0]);
        }
        return isInArray(value, array);
      } else{
        return false
      }
    }

  }

}());
