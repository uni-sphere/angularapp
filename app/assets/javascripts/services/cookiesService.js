(function () {
  angular
    .module('mainApp.services')
    .service('cookiesService', cookiesService)

  cookiesService.$inject = ['$rootScope', '$window', 'makeNestedService', 'Restangular', 'Notification', 'ipCookie', 'nodeService', '$q', '$translate', 'createIndexChaptersService'];
  function cookiesService($rootScope, $window, makeNestedService, Restangular, Notification, ipCookie, nodeService, $q, $translate, createIndexChaptersService){

    var error;

    $translate(['ERROR']).then(function (translations) {
      error = translations.ERROR;
    });

    service = {
      reload: reload
    }

    return service

    function reload(){
      Restangular.one('nodes').get().then(function (nodes) {
        console.log("Ok: node retrieved")
        var flatNode = nodes.plain();
        $rootScope.flatNode = flatNode
        makeNestedService.node(flatNode).then(function(treeNodes){
          $rootScope.nodes = treeNodes
          cookieGestion(flatNode).then(function(){
            $rootScope.$broadcast('reloadTree');
          })
        })
      }, function(d){
        Notification.error(error)
        console.log("Error: Get nodes");
        console.log(d)
      });
    }

    function cookieGestion(flatNode){
      return $q(function(resolve, reject){
        // We save all ids of the nodes
        var nodeIDs = []
        angular.forEach(flatNode, function(value,key){
          nodeIDs.push(value.num)
        });

        // We look if the node in the cookies still exist
        if((ipCookie('nodeEnd') != undefined && ipCookie('nodeEnd') == false) || (ipCookie('nodeEnd') != undefined && nodeIDs.indexOf(ipCookie('nodeEnd')[0]) > -1)){
          console.log('Ok: cookies - no problem')
          foldedNodesGestion(nodeIDs)
          foldedChaptersGestion(flatNode)
          if(ipCookie('nodeEnd') != false){
            findAndSetNode($rootScope.nodes, ipCookie('nodeEnd')[0])
          }
          $rootScope.activeNodes = ipCookie('activeNodes');
          $rootScope.nodeEnd = ipCookie('nodeEnd');
          resolve();
        } else{
          console.log('Ok: cookies - PROBLEMS')
          foldedNodesGestion(nodeIDs)
          foldedChaptersGestion(flatNode).then(function(){
            setInitialCookies().then(function(){
              resolve();
            })
          })
        }
      })
    }

    // Find the node end with an id and set its chapters, locked and chapters number
    function findAndSetNode(node, id){
      if(node.num == id){
        $rootScope.nodeProtected = node.locked;
        $rootScope.listItems = node.items
        if(node.items != undefined && node.items.length != 0){
          createIndexChaptersService.create($rootScope.listItems)
        }
      } else{
        angular.forEach(node.children, function(value, key){
          findAndSetNode(value, id)
        })
      }
    }

    /*----------  Folded nodes  ----------*/
    function foldedNodesGestion(nodeIDs){
      tempFoldedNodes = []
      angular.forEach(ipCookie('foldedNodes'), function(value,key){
        if(nodeIDs.indexOf(value) > -1){
          tempFoldedNodes.push(value)
        }
      });

      $rootScope.foldedNodes = tempFoldedNodes;
    }

    /*----------  Folded chapters  ----------*/

    function foldedChaptersGestion(){
      return $q(function(resolve, reject){
        tempFoldedchapters = []
        angular.forEach(ipCookie('foldedChapters'), function(value,key){
          if($rootScope.chaptersId.indexOf(value) > -1){
            tempFoldedchapters.push(value)
          }
        });

        $rootScope.foldedChapters = tempFoldedchapters;
        resolve();
      })
    }

    /*----------  Initial cookies  ----------*/
    function setInitialCookies(){
      return $q(function(resolve, reject){
       
        var tempActiveNodes = []
        var nodes = $rootScope.nodes

        // We fold the node year 3 et year 4
        var tempFoldedNodes = []
        if($rootScope.sandbox || $rootScope.local){
          tempFoldedNodes.push(nodes.children[2].num)
          tempFoldedNodes.push(nodes.children[3].num)
        }

        // We find select all the node of the top branch to be active
        while(nodes.children && nodes.children.length != 0){
          tempActiveNodes.unshift([nodes.num, nodes.name])
          nodes = nodes.children[0]
        }
        tempActiveNodes.unshift([nodes.num, nodes.name])

        // We add Assignments, Lecture Notes and Handouts in folded chapters
        if($rootScope.sandbox || $rootScope.local){
          var tempFoldedChapters = []
          if(nodes.node_data[7]){
            tempFoldedChapters.push(nodes.node_data[7].id)
          }
          if(nodes.node_data[3]){
            tempFoldedChapters.push(nodes.node_data[3].id)
          }
          if(nodes.node_data[5]){
            tempFoldedChapters.push(nodes.node_data[5].id)
          }
          $rootScope.foldedChapters = tempFoldedChapters
          ipCookie('foldedChapters', $rootScope.foldedChapters);
        }

        findAndSetNode($rootScope.nodes, nodes.num)

        // We save the active nodes, the nodeEnd and the folded nodes to the rootScope
        $rootScope.activeNodes = tempActiveNodes
        $rootScope.nodeEnd = [nodes.num, nodes.name, nodes.user_id]
        $rootScope.foldedNodes = tempFoldedNodes

        resolve();

        // Cookies
        ipCookie('activeNodes', $rootScope.activeNodes);
        ipCookie('nodeEnd', $rootScope.nodeEnd);
        ipCookie('foldedNodes',  $rootScope.foldedNodes);
      })
    }

  }

}());
