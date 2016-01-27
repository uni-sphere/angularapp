(function () {
  angular
    .module('mainApp.services')
    .service('nodeCrudService', nodeCrudService)

  nodeCrudService.$inject = ['nodeService', '$rootScope', 'Restangular', 'Notification', '$q', 'ModalService', 'ipCookie', '$translate']
  function nodeCrudService(nodeService, $rootScope, Restangular, Notification, $q, ModalService, ipCookie, $translate){

    var cancel_warning,
      error,
      forbidden,
      newNodeLabel,
      success;

    $translate(['SUCCESS', 'ERROR', 'NW_CANCEL', 'FORBIDDEN', 'NEW_NODE_LABEL']).then(function (translations) {
      cancel_warning = translations.NW_CANCEL;
      error = translations.ERROR;
      forbidden = translations.FORBIDDEN;
      success = translations.SUCCESS;
      newNodeLabel = translations.NEW_NODE_LABEL;
    });

    service = {
      toggle: toggle,
      add: add,
      rename: rename,
      deleteNode: deleteNode
    }

    return service;

    function realDeleteNode(pullDocs, node){
      return $q(function(resolve, reject){
        Restangular.all('nodes/' + node.num).remove({pull: pullDocs}).then(function(res) {

          // In case the node we erase had some nodes in $rootScope.nodeFolded, we erase it.
          for(var i=0; i<$rootScope.foldedNodes.length; i++){
            if(res.node_sons.indexOf($rootScope.foldedNodes[i]) > -1){
              $rootScope.foldedNodes.splice(i,1)
              ipCookie('foldedNodes', $rootScope.foldedNodes);
            }
          }

          // In case the node we erase had some chapters in $rootScope.chapterFolded, we erase it.
          for(var i=0; i<$rootScope.foldedChapters.length; i++){
            if(res.chapter_sons.indexOf($rootScope.foldedChapters[i]) > -1){
              $rootScope.foldedChapters.splice(i,1)
              ipCookie('foldedChapters', $rootScope.foldedChapters);
            }
          }

          // Remove the node from $rootScope.nodes
          for(var i=0; i<node.parent.children.length; i++){
            if(node.parent.children[i].id == node.id){
              node.parent.children.splice(i,1)
              if(node.parent.children == null){
                node.parent.children = []
              }
            }
          }

          // Notification.success(success)
          console.log("Ok: Node deleted");

          if(node.active){
            nodeService.changeNode(node.parent)
          }

          resolve();

        }, function(d) {
          if(d.status == 403){
            console.log("Ok: Deletion forbidden")
            Notification.warning(node_warning);
          } else if(d.status == 404) {
            console.log("Ok: Deletion cancelled node doesn't exist anymore")
            Notification.warning(cancel_warning)
            nodeCookiesService.reload()
          } else{
            console.log(d)
            console.log("Error: Delete node");
            Notification.error(error);
          }
        });
      })
    }


    function deleteNode(node, superadmin){
      return $q(function(resolve, reject){

        // We check if there are chapters to transfer
        Restangular.one('chapters').get({node_id: node.id}).then(function(listChapters) {

          // We allow the transfer if there are chapters, if the the node is a leaf,
          //if the parent will become a leaf once this node is deleted,
          //if the parent node and the current node belong to the same user
          if(listChapters.tree.length > 1 && !node.children && !node._children && node.parent.children.length == 1 && (node.user_id == node.parent.user_id || superadmin)){
            var allowTransfer = true
          } else{
            var allowTransfer = false
          }

          ModalService.showModal({
            templateUrl: "webapp/delete-node-modal.html",
            controller: "DeleteNodeModalCtrl",
            inputs:{
              allowTransfer: allowTransfer,
              name: node.name
            }
          }).then(function(modal) {
            modal.close.then(function(result) {
              if(result != undefined){
                // From the modal we know if the user wants to delete items or transfer them
                realDeleteNode(result, node).then(function(){
                  resolve();
                })
              }
            });
          });

        }, function(d){
          console.log("Error: Delete node | get document");
          console.log(d)
        });
      })
    }

    /*----------  Toggle the node  ----------*/

    function toggle(node){
      return $q(function(resolve, reject){

        // We toggle the node
        if (node.children) {
          node._children = node.children;
          node.children = null;
        } else {
          node.children = node._children;
          node._children = null;
        }

        // We select the node
        nodeService.changeNode(node)
        nodeService.findFoldedNodes(node);

        resolve();
      })
    }

    /*----------  Rename   ----------*/

    function rename(node){
      return $q(function(resolve, reject){
        ModalService.showModal({
          templateUrl: "webapp/rename-item.html",
          controller: "RenameModalCtrl",
          inputs:{
            name: node.name,
            length: 20,
            file: false
          }
        }).then(function(modal) {
          modal.close.then(function(result) {

            if(result) {
              Restangular.one('nodes/'+ node.num).put({name: result}).then(function(d) {

                // We rename the node and the breadcrumb if necessary
                node.name = result;

                // If the node renamed is currently active
                if(node.active){
                  nodeService.changeNode(node)
                }

                resolve();
                // Notification.success(success)
                console.log("Ok: Node renamed");

              }, function(d) {
                reject()

                if(d.status == 403){
                  console.log("Ok: Rename a node forbidden");
                  Notification.warning(forbidden);
                }

                else if(d.status == 404) {
                  console.log("Ok: Rename cancelled. Node doesn't exist anymore")
                  Notification.warning(cancel_warning)
                  nodeCookiesService.reload()
                }

                else{
                  console.log("Error: Rename node");
                  console.log(d);
                  Notification.error(error)
                }
              });
            }
          });
        });
      })
    }

    /*----------  Add  ----------*/

    function add(node){
      return $q(function(resolve, reject){

        Restangular.all('nodes').post({parent_id: node.num, name: "Nouveau"}).then(function(newNode) {

          var nodeToCreate = {name: newNodeLabel, num: newNode.id, parent: node, user_id: newNode.user_id}

          // We create the node
          if(node.children == undefined){
            node.children = [nodeToCreate]
          } else{
            node.children.push(nodeToCreate);
          }

          // Select the node
          if(node.children.length){
            var childNode = node.children[node.children.length - 1]
          } else{
            var childNode = node.children
          }

          nodeService.changeNode(childNode)

          resolve();
          // Notification.success(success)
          console.log("Ok: node added");

        }, function(d) {
          reject()

          if(d.status == 403){
            console.log("Ok: Node creation cancelled. This node doesnt belong to you")
            Notification.warning(forbidden)
          }

          else if(d.status == 404) {
            console.log("Ok: Node creation cancelled. Node doesn't exist anymore")
            Notification.warning(cancel_warning)
            nodeCookiesService.reload()
          }

          else{
            console.log("Error: New node");
            console.log(d);
            Notification.error(error);
          }
        });
      })

    }

  }

}());
