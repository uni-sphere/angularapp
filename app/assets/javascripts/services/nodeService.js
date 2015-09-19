// storage.js
(function() {
  angular
    .module('mainApp.services')
    .service('nodeService', nodeService);

  nodeService.$inject = ['Restangular', 'Notification']
  function nodeService(Restangular, Notification) {
    var service = {
      setNodeName: setNodeName,
      openNode: openNode,
      addNode: addNode
    };

    return service;

    ////////////
    function addNode(node){
      var newBranch = {parent_id: node.num, name: "new"}

      Restangular.all('nodes').post(newBranch).then(function(newNode) {
        Notification.success("Node created")
        console.log("Ok: node added");
        var a = {name: "new", num: newNode.id, parent: node, user_id: newNode.user_id}

        if( node.children == undefined || node.children == null ){
          node.children = [];
        }

        node.children.push(a);

        // Select the node
        // findActiveNodes(node.children[node.children.length - 1]);
        // findNodeEnd(node.children[node.children.length - 1]);
        // colornodePath(scope.root)

        // update(node);

      }, function(d) {
        if(d.status == 403){
          console.log("Ok: Node creation cancelled. This node doesnt belong to you")
          Notification.warning('You are not allowed to create a node here. ' + node.name + " doesn't belong to you.")
        } else if(d.status == 404) {
          console.log("Ok: Node creation cancelled. Node doesn't exist anymore")
          Notification.warning('This action has been cancelled. One of you colleague deleted this node.')
          scope.reloadNodes()
        } else{
          console.log("Error: New node");
          console.log(d);
          Notification.error("An error occured while creating the node. Please refresh");
        }
      });
    }

    function setNodeName(node, name) {

      var nodeUpdate = {name: name}
      node.name = name;

      Restangular.one('nodes/'+ node.num).put(nodeUpdate).then(function(d) {
        // renameProperly(node)
        Notification.success("Node renamed")
        console.log("Ok: Node renamed");
      }, function(d) {
        if (d.status == 403){
          console.log("Ok: Rename a node forbidden");
          Notification.warning("This node is not yours");
        } else if(d.status == 404) {
          console.log("Ok: Rename cancelled. Node doesn't exist anymore")
          Notification.warning('This action has been cancelled. One of you colleague deleted this node.')
          scope.reloadNodes()
        } else{
          console.log("Error: Rename node");
          console.log(d);
          Notification.error("An error occcured while renaming. Please refresh.")
        }
      });

    }

    function openNode(node){
      if(node.children) {
        node._children = node.children;
        node.children = null;
      } else {
        node.children = node._children;
        node._children = null;
      }

      // scope.foldedNodes = [];

      // findActiveNodes(node);
      // scope.$apply(findNodeEnd(node));
      // findFoldedNodes(scope.root);
      // colornodePath(scope.root);
      // scope.lastSelectedNode = node;

      // update(node);
    }



    function renameProperly(node){
      activeIDs = []
      angular.forEach(scope.activeNodes, function(value,key){
        activeIDs.push(value[0])
      });
      if(activeIDs.indexOf(node.num) > -1){
        renameBreadCrumb(node)
      }
    }

  }
})();
