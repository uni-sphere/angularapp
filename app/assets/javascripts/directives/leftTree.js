(function () {

  angular.module('mainApp.directives')
    .directive('leftTree', ['ipCookie', '$timeout', 'Restangular', 'Notification', 'ModalService', function(ipCookie, $timeout, Restangular, Notification, ModalService) {
      return {
        scope: {
          nodeEnd: '=',
          activeNodes: '=',
          admin: '=',
          home: '=',
          sandbox: '=',
          help: '=',
          chapterFolded: '=',
          activeChapter: '=',
          breadcrumb: '=',
          nodes: '=',
          foldedNodes: '=',
          cookieGestion: '=',
          userId: '=',
          reloadNodes: '=',
          viewNews: '='
        },
        link: function(scope, iElement, iAttrs) {

          sandboxFlatNode = [
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

          scope.cookieGestion = function(flatNode, nodes){
            var nodeIDs = []
            angular.forEach(flatNode, function(value,key){
              nodeIDs.push(value.num)
            });

            // Cookies gestion
            if(scope.home || scope.sandbox){
              scope.foldedNodes = [4];
              scope.activeNodes = [[17,"Histoire",1],[9,"S",1],[3,"Premiere",1],[1,"Sandbox",1]];
              scope.nodeEnd = [17,"Histoire",1];
            } else{
              // We look if the node in the cookies still exist
              if(!ipCookie('nodeEnd') || nodeIDs.indexOf(ipCookie('nodeEnd')[0]) > -1){
                console.log('Ok: cookies - no problem')
                scope.activeNodes = ipCookie('activeNodes');
                scope.nodeEnd = ipCookie('nodeEnd');
              } else{
                console.log('Ok: cookies - problems')
                if(nodes.children[0].children || nodes.children[0]._children){
                  scope.nodeEnd = false
                } else{
                  scope.nodeEnd = [flatNode[1].num,flatNode[1].name, flatNode[1].user_id]
                }
                scope.activeNodes = [[flatNode[1].num,flatNode[1].name],[flatNode[0].num,flatNode[0].name]]
                ipCookie('activeNodes', scope.activeNodes);
                ipCookie('nodeEnd', scope.nodeEnd);
                changeBreadcrumb()
              }

              scope.foldedNodes = [];
              angular.forEach(ipCookie('foldedNodes'), function(value,key){
                if(nodeIDs.indexOf(value) > -1){
                  scope.foldedNodes.push(value)
                }
              });

            }
          }


          // if(scope.home || scope.sandbox){
          //   console.log("Ok: node retrieved")
          //   scope.nodes = makeNested(sandboxFlatNode)
          //   scope.cookieGestion(sandboxFlatNode, scope.nodes);
          // } else{
          //   // First we get the nodes
          //   Restangular.one('nodes').get().then(function (nodes) {
          //     console.log("Ok: node retrieved")
          //     scope.flatNode = nodes.plain();
          //     scope.nodes = makeNested(scope.flatNode)
          //     scope.cookieGestion(nodes.plain(), scope.nodes);

          //     // $scope.$watch('help', function(newVals, oldVals){
          //     //   if($scope.help){
          //     //     console.log("Ok: First co cookies")
          //     //     $scope.nodeEnd = [$scope.flatNode[1].num,$scope.flatNode[1].name]
          //     //     $scope.activeNodes = [[$scope.flatNode[0].num,$scope.flatNode[0].name],[$scope.flatNode[1].num,$scope.flatNode[1].name]]
          //     //     $scope.breadcrumb = [$scope.flatNode[1].name]
          //     //     ipCookie('activeNodes', $scope.activeNodes);
          //     //     ipCookie('nodeEnd', $scope.nodeEnd);
          //     //   }
          //     // });

          //   },function(d){
          //     Notification.error("Error while getting classes and documents informations. Refresh the page please.")
          //     console.log("Error: Get nodes");
          //     console.log(d)
          //   });
          // }

          scope.reloadNodes = function(){
            if(scope.home || scope.sandbox){
              console.log("Ok: node retrieved");
              scope.nodes = makeNested(sandboxFlatNode)
              scope.cookieGestion(sandboxFlatNode, scope.nodes);
              render(scope.nodes, iElement);
            } else{
                Restangular.one('nodes').get().then(function (nodes) {
                console.log("Ok: node retrieved")
                scope.flatNode = nodes.plain();
                scope.nodes = makeNested(scope.flatNode)
                scope.cookieGestion(nodes.plain(),scope.nodes);
                render(scope.nodes, iElement);
              },
                function(d){
                Notification.error("Can not display your tree")
                console.log("Error: Get nodes");
                console.log(d)
              });
            }
          }

          scope.$watch('admin', function(newVals, oldVals){
            // if(scope.viewNews){
            //   Notification.warning({
            //     message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">',
            //     title: 'Unisphere as new features',
            //     delay: 10000
            //   }).then(function(){
            //     console.log("done");
            //   })
            // }

            if(newVals != undefined){
              scope.reloadNodes()
            }
          });

          var dummyId = 50
          /*==========  Svg creation  ==========*/
          var margin = {top: 20, right: 20, bottom: 10, left: 30};

          var svg = d3.select(iElement[0])
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // scope.$watch('nodes',function(newVals, oldVals){
          //   if(newVals){
          //     scope.$watch('admin',function(newVals, oldVals){
          //       if(newVals != undefined){
          //         console.log("Ok: Tree rendered")
          //         render(scope.nodes, iElement);
          //       }
          //     });
          //   }
          // });

          function update(source) {
            // console.log(scope.admin)
            maxWidth = scope.width - 200
            var duration = 750;

            // Compute the new tree layout.
            var nodes = scope.tree.nodes(scope.root).reverse();
            var links = scope.tree.links(nodes);

            var maxDepth = 1;
            nodes.forEach(function(d) {
              if(d.depth > maxDepth){
                maxDepth = d.depth
              }
            });

            var lengthLink = Math.floor(maxWidth / maxDepth);

            nodes.forEach(function(d) {
              d.y = d.depth * lengthLink
            });

            // Update the nodes…
            var node = svg.selectAll("g.node")
              .data(nodes, function(d) { return d.id || (d.id = d.num); });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
              })

            nodeEnter.append("circle")
              .attr("class", "circleCollapse")
              .attr("r", 1e-6)
              .style("stroke", "cornflowerblue")
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff" })
              .on("click", openNode)


            if(scope.admin){
              // Label of the node. When clicked it opens the rename
              nodeEnter.append("text")
                .attr("class", function(d){
                  if(typeof d.parent != 'object'){
                    return ""
                  } else if(d.user_id == scope.userId){
                    return "renameNode"
                  } else{
                    return "justDisplayNode"
                  }
                })
                .attr("x", function(d) { return d.children ? 0 : 15; })
                .attr("y", function(d) { return d.children ? 25 : 5; })
                .attr("text-anchor", "start")
                .style("fill-opacity", 1e-6)
                .text(function(d) { return d.name; })
                .on("click", renameNode)

              // Little + to add a node
              nodeEnter.append("text")
                .attr("class", "addNode")
                .attr("x", "-8px")
                .attr("y", "-15px")
                .attr("text-anchor", "end")
                .text("+")
                .style("fill-opacity", 1e-6)
                .style("fill", "cornflowerblue")
                .on("click", addNode)

              // Little - to remove a node
              nodeEnter.append("text")
                .attr("class", "deleteNode")
                .attr("x", "8px")
                .attr("y", "-16px")
                .attr("text-anchor", "start")
                .text("x")
                .style("fill-opacity", 1e-6)
                .style("fill", "#F76565")
                .on("click", deleteNode)
            } else{
               // Label of the node. When clicked it opens the node
              nodeEnter.append("text")
                .attr("class", function(d){return typeof d.parent === 'object' ? "nameNode" : ""})
                .attr("x", function(d) { return d.children ? 0 : 15; })
                .attr("y", function(d) { return d.children ? 25 : 5; })
                .attr("text-anchor", function(d) { return d.children ? "middle" : "start"; })
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1e-6)
                .on("click", openNode)
            }

            // Transition nodes to their new position.
            // We make opace or inccrease the size of all elements

            var nodeUpdate = node.transition()
              .duration(duration)
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

            if(scope.sandbox || scope.home){
              nodeUpdate.select("text.deleteNode")
                .style("fill-opacity", 1 )
            } else{
              nodeUpdate.select("text.deleteNode")
                .style("fill-opacity", function(d){ return scope.userId == d.user_id ? 1 : 1e-6; })
            }

            if(scope.sandbox || scope.home){
              nodeUpdate.select("text.addNode")
                .style("fill-opacity",  function(d){ return d._children ? 1e-6 : 1; })
            } else{
              nodeUpdate.select("text.addNode").style("fill-opacity",  function(d){
                if(d._children){
                  return 1e-6
                } else if(!d.children && scope.userId != d.user_id && !d.superadmin){
                  return 1e-6
                } else{
                  return 1
                }
              })
            }

            nodeUpdate.select("circle.circleCollapse")
              .attr("r", 6)
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff" })

            nodeUpdate.select("text.nameNode, text.justDisplayNode, text.renameNode")
              .style("fill-opacity", 1)
              .attr("x", function(d) {
                if(d.children){
                  return -Math.floor(this.getBBox().width/2)
                } else{
                  return 15
                }
              })
              .attr("y", function(d) { return d.children ? 25 : 5; })
              .attr("text-anchor", "start")
              .text(function(d) { return d.name; });

            // Transition exiting nodes to the parent's new position.
            // We reduce or make transparent all elements

            var nodeExit = node.exit().transition()
              .duration(duration)
              .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
              .remove();

            nodeExit.select("text.deleteNode")
              .style("fill-opacity", 1e-6)

            nodeExit.select("text.addNode")
              .style("fill-opacity", 1e-6)

            nodeExit.select("circle.circleCollapse")
              .attr("r", 1e-6)
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff" })

            nodeExit.select("text.nameNode")
              .style("fill-opacity", 1e-6);


            // Update the links…
            var link = svg.selectAll("path.link")
              .data(links, function(d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
              .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return scope.diagonal({source: o, target: o});
              });

            // Transition links to their new position.
            link.transition()
              .duration(duration)
              .attr("d", scope.diagonal)
              .attr("class", function(d) { return d.target.active ? "link link-active" : "link"; })

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
              .duration(duration)
              .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return scope.diagonal({source: o, target: o});
              })
              .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
              d.x0 = d.x;
              d.y0 = d.y;
            });
          }

          function openNode(node) {
            if (node.children) {
              node._children = node.children;
              node.children = null;
            } else {
              node.children = node._children;
              node._children = null;
            }

            scope.foldedNodes = [];

            findActiveNodes(node);
            scope.$apply(findNodeEnd(node));
            findFoldedNodes(scope.root);
            colornodePath(scope.root);
            scope.activeChapter = undefined;
            scope.lastSelectedNode = node;


            if(!scope.home && !scope.sandbox){
              ipCookie('activeNodes', scope.activeNodes);
              ipCookie('foldedNodes', scope.foldedNodes);
            }

            // scope.$apply();
            // console.log(scope.nodeEnd)
            update(node);
          }

          function findFoldedNodes(node){
            if(node.children){
              node.children.forEach(findFoldedNodes);
            }
            if(node._children){
              node._children.forEach(findFoldedNodes);
              scope.foldedNodes.push(node.num);
            }
          }

          function addToActiveNodes(node){
            scope.storageTemp.push([node.num, node.name]);
            if(node.parent){
              addToActiveNodes(node.parent)
            } else{
              scope.activeNodes = scope.storageTemp
            }
          }

          function changeBreadcrumb(){
            tempBreadcrumb = [];
            for(var i = 0; i < scope.activeNodes.length - 1; i++){
              if(i < 2){
                tempBreadcrumb.unshift(scope.activeNodes[i][1]);
              } else if(i == 2){
                tempBreadcrumb.unshift("...");
              }
            }
            scope.breadcrumb = tempBreadcrumb;
          }

          function renameBreadCrumb(nodeChanged){
            scope.breadcrumb = []
            for(var i = 0; i < scope.activeNodes.length - 1; i++){
              if(scope.activeNodes[i][0] == nodeChanged.num){
                scope.activeNodes[i][1] = nodeChanged.name;
                if(!scope.home && !scope.sandbox){
                  ipCookie('activeNodes', scope.activeNodes);
                }
                if(i < 2){
                  scope.breadcrumb.unshift(nodeChanged.name);
                } else if( i == 2){
                  scope.breadcrumb.unshift("...")
                }
              } else{
                if(i < 2){
                  scope.breadcrumb.unshift(scope.activeNodes[i][1]);
                } else if( i == 2 ){
                  scope.breadcrumb.unshift("...")
                }
              }

            }
          }

          function findActiveNodes(node){
            scope.storageTemp = [];
            addToActiveNodes(node)
            changeBreadcrumb();
          }

          function colornodePath(node) {
            // console.log(scope.activeNodes)
            node.active = false;
            if(intInDoubleArray(node.num,scope.activeNodes)){
              node.active = true;
            }
            if (node.children){
              node.children.forEach(colornodePath);
            }
          }

          function findNodeEnd(node){
            if(!node.children && !node._children){
              scope.nodeEnd = [node.num, node.name, node.user_id];
              // Demo mode
              if(!scope.home && !scope.sandbox){
                ipCookie('nodeEnd', scope.nodeEnd);
              }
            } else{
              scope.nodeEnd = false;
              ipCookie('nodeEnd', false);
            }
            console.log(scope.nodeEnd)
          }

          function realDeleteNode(pullDocs){
            Restangular.all('nodes/' + scope.nodeSelectedToDelete.num).remove({pull: pullDocs}).then(function(res) {

              for( var i = 0; i < res.deleted.length; i ++){
                removeFromArray(scope.chapterFolded, res.deleted[i].toString())
              }

              var nodeToDelete = _.where(scope.nodeSelectedToDelete.parent.children, {id: scope.nodeSelectedToDelete.id});
              if (nodeToDelete){
                scope.nodeSelectedToDelete.parent.children = _.without(scope.nodeSelectedToDelete.parent.children, nodeToDelete[0])
                Notification.warning("Node removed")
              }

              // We check if the node end was in the node deleted.
              // than we need to change the cookies

              function deleteProperly(node, nodeInitial){
                if(node.num == scope.nodeEnd[0]){

                  findFoldedNodes(scope.root);
                  findActiveNodes(nodeInitial.parent)
                  if(scope.activeNodes.length != 0){
                    scope.nodeEnd = scope.activeNodes[0]
                  }
                  ipCookie('activeNodes', scope.activeNodes);
                  ipCookie('foldedNodes', scope.foldedNodes);
                  ipCookie('nodeEnd', scope.nodeEnd);
                  colornodePath(scope.root);
                }
                if(node.children){
                  angular.forEach(node.children, function(value, key){
                    deleteProperly(value, nodeInitial)
                  })
                }
                if(node._children){
                  angular.forEach(node._children, function(value, key){
                    deleteProperly(value, nodeInitial)
                  })
                }
              }

              deleteProperly(scope.nodeSelectedToDelete, scope.nodeSelectedToDelete)
              update(scope.nodeSelectedToDelete);
              console.log("Ok: Node deleted");
              $('#grey-background').fadeOut();
              scope.deleteNodeView = false;
            }, function(d) {
              if(d.status == 403){
                console.log("Ok: Deletion forbidden")
                Notification.warning('This node is not yours');
              } else if(d.status == 404) {
                console.log("Ok: Deletion cancelled node doesn't exist anymore")
                Notification.warning('This action has been cancelled. One of you colleague deleted this node')
                scope.reloadNodes()
              } else{
                console.log(d)
                console.log("Error: Delete node");
                Notification.error("An error occured while deleting. Please refresh.");
              }
              $('#grey-background').fadeOut();
              $('#delete-node').fadeOut();
            });
          }

          function deleteNode(node){

            // Demo app
            if(scope.home || scope.sandbox){
              var nodeToDelete = _.where(node.parent.children, {id: node.id});
              if (nodeToDelete){
                node.parent.children = _.without(node.parent.children, nodeToDelete[0]);
              }

              function deleteProperly(node, nodeInitial){
                if(node.num == scope.nodeEnd[0]){
                  scope.nodeEnd = false

                  findFoldedNodes(scope.root);
                  findActiveNodes(nodeInitial.parent)
                  if(scope.activeNodes.length != 0){
                    scope.nodeEnd = scope.activeNodes[0]
                  }

                  colornodePath(scope.root);
                }
                if(node.children){
                  angular.forEach(node.children, function(value, key){
                    deleteProperly(value, nodeInitial)
                  })
                }
                if(node._children){
                  angular.forEach(node._children, function(value, key){
                    deleteProperly(value, nodeInitial)
                  })
                }
              }

              deleteProperly(node, node)
              update(node);

            }
            // If we are the app
            else{
              Restangular.one('chapters').get({node_id: node.id}).then(function(listChapters) {
                // console.log(listChapters.plain())
                // console.log('----')
                // console.log(listChapters.tree.length > 1)
                // console.log(!node.children && !node._children)
                // console.log(node.parent.children.length == 1)
                // console.log(node.user_id == node.parent.user_id)
                if(listChapters.tree.length > 1 && !node.children && !node._children && node.parent.children.length == 1 && node.user_id == node.parent.user_id){
                  var allowTransfer = true
                } else{
                  var allowTransfer = false
                }

                scope.nodeSelectedToDelete = node;

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
                      realDeleteNode(result)
                    }
                  });
                });

              }, function(d){
                console.log("Error: Delete node | get document");
                console.log(d)
              });

            }
          }


          function addNode(node){
            var newBranch = {parent_id: node.num, name: "new"}

            // Demo app
            if(scope.home || scope.sandbox){
              var a = {name: "new", num: dummyId, parent: node}
              dummyId ++;

              if( node.children === undefined || node.children == null ){
                node.children = [];
              }
              node.children.push(a);

              // Select the node
              findActiveNodes(node.children[node.children.length - 1]);
              findNodeEnd(node.children[node.children.length - 1]);
              colornodePath(scope.root);

              update(node);
            }

            // Normal app
            else{
              Restangular.all('nodes').post(newBranch).then(function(newNode) {
                Notification.success("Node created")
                console.log("Ok: node added");
                var a = {name: "new", num: newNode.id, parent: node, user_id: newNode.user_id}

                if( node.children == undefined || node.children == null ){
                  node.children = [];
                }

                node.children.push(a);

                // Select the node
                findActiveNodes(node.children[node.children.length - 1]);
                findNodeEnd(node.children[node.children.length - 1]);
                colornodePath(scope.root);

                ipCookie('activeNodes', scope.activeNodes);
                ipCookie('nodeEnd', scope.nodeEnd);

                update(node);

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
          }

          function renameNode(node){

            if(node.user_id == scope.userId){
              ModalService.showModal({
                templateUrl: "webapp/rename-item.html",
                controller: "RenameModalCtrl",
                inputs:{
                  name: node.name,
                  length: 10
                }
              }).then(function(modal) {
                modal.close.then(function(result) {
                  if(result) {
                    var nodeUpdate = {name: result}
                    node.name = result;
                    function renameProperly(node){
                      activeIDs = []
                      angular.forEach(scope.activeNodes, function(value,key){
                        activeIDs.push(value[0])
                      });
                      if(activeIDs.indexOf(node.num) > -1){
                        renameBreadCrumb(node)
                      }
                    }

                    if(scope.home || scope.sandbox){
                      renameProperly(node)
                      update(node);
                      Notification.success("Node renamed")
                      console.log("OK: Node renamed");
                    } else{
                      Restangular.one('nodes/'+ node.num).put(nodeUpdate).then(function(d) {
                        renameProperly(node)
                        update(node);
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
                  }
                });
              });
            }

          }

          function render(branch, iElement){
            window.onresize = function() {
              console.log("Ok: Window resize. Render tree")
              render(scope.nodes, iElement);
            };

            svg.selectAll("*").remove();

            scope.i = 0;

            scope.width = d3.select(iElement[0])[0][0].offsetWidth - margin.right - margin.left;
            scope.height = d3.select(iElement[0])[0][0].offsetHeight - margin.top - margin.bottom;

            scope.root = branch;
            scope.root.x0 = scope.height / 2;
            scope.root.y0 = 0;

            scope.tree = d3.layout.tree()
              .separation(function(a,b){
                if(a.parent != b.parent || b.children ){
                  return 2
                } else{
                  return 1
                }
              })
              .size([scope.height, scope.width])

            scope.diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

            // console.log(scope.foldedNodes)
            if(scope.foldedNodes == undefined){
              branch.children.forEach(collapseAll);
            } else{
              branch.children.forEach(collapseSelectively);
            }

            if(scope.activeNodes != undefined){
              branch.children.forEach(colorActiveNodes)
              changeBreadcrumb()
            }

            update(scope.root);
          }

          function collapseSelectively(node) {
            if (node.children){
              node.children.forEach(collapseSelectively);

              if(isInArray(node.num,scope.foldedNodes)){
                node._children = node.children;
                node.children = null;
              }
            }
          }

          function collapseAll(node) {
            if (node.children) {
              node._children = node.children;
              node._children.forEach(collapseAll);
              node.children = null;
            }
          }

          function unCollapse(node){
            if(node._children){
              node.children = node._children;
              node._children = null;
            }
            if(node.children){
              node.children.forEach(unCollapse);
            }
          }

          function colorActiveNodes(node) {
            if(isInDoubleArray(node.num,scope.activeNodes)){
              node.active = true;
            }
            if(node.children){
              node.children.forEach(colorActiveNodes);
            }
          }

          /*========================================
          =            Utility function            =
          ========================================*/

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

          function compareObjects(x, y) {
            var objectId = false;
            for(var propertyName in x) {
              if(y == undefined){
                objectId = x.num;
                break;
              }
              if(x[propertyName] !== y[propertyName]) {
                objectId = x.num;
                break;
              }
            }
            return objectId;
          }

          function isInArray(value, array) {
            return array.indexOf(value) > -1
          }

          function intInArray(value, array) {
            return array.indexOf(value) > -1;
          }

          function intInDoubleArray(value, doubleArray){
            var array = [];
            for( var i = 0; i < doubleArray.length; i++){
              array.push(doubleArray[i][0]);
            }
            return intInArray(value, array);
          }

          function isInDoubleArray(value, doubleArray){
            var array = [];
            for( var i = 0; i < doubleArray.length; i++){
              array.push(doubleArray[i][0]);
            }
            return isInArray(value, array);
          }

          function transformArrayInDouble(array){
            var doubleArray = [];

            function action(myArray){
              doubleArray.push([myArray[0],myArray[1]]);
              myArray.shift();
              myArray.shift();
              if(array.length != 0){
                action(myArray);
              }
            }
            action(array);

            return doubleArray;
          }

          function removeFromArray(arr, what) {
            var found = arr.indexOf(what);

            while (found !== -1) {
              arr.splice(found, 1);
              found = arr.indexOf(what);
            }
          }

          function compareObjectsArray(a,b){
            var objectId = false;

            if(a.length > b.length){
              for (var i=0; i < a.length; i ++){
                var idFound = false
                for(var j=0; j < b.length; j ++){
                  if(a[i].num == b[j].num){
                    idFound = true;
                  }
                }
                if(!idFound){
                  objectId = a[i].num;
                }
              }
              return objectId;
            }

            if(a.length == b.length){
              var objectId = false;
              for (var i=0; i < a.length; i ++){
                for(var j=0; j < b.length; j ++){
                  if(a[i].num == b[j].num){
                    var compare = compareObjects(a[i],b[j]);
                    if(compare){
                      objectId = compareObjects(a[i],b[j]);
                    };
                  }
                }
              }
              return objectId;
            }

            if(a.length < b.length){
              var listObjectsId =[];
              for (var j=0; j < b.length; j ++){
                var idFound = false;
                for(var i=0; i < a.length; i ++){
                  if(a[i].num == b[j].num){
                    idFound = true;
                  }
                }
                if(!idFound){
                  listObjectsId.push(b[j].num);
                }
              }
              return listObjectsId;
            }
          }

          /*==========  Periodical get  ==========*/

          // function retrieveNodes() {
          //   Restangular.one('nodes').get().then(function(response) {

          //     // console.log(scope.copyFlatData.plain())
          //     // console.log(response.plain())
          //     var comparaison = compareObjectsArray(response.plain(),scope.copyFlatData.plain());
          //     console.log(comparaison);
          //     // scope.copyFlatData = response;
          //     // console.log(response);

          //     $timeout(retrieveNodes, 5000);
          //   }, function() {
          //     console.log("There was an error getting");
          //   });
          // }

          // $timeout(retrieveNodes, 5000);


          /*==========  Renders Tree  ==========*/

          // // We change the size of the graphs when the sidebar is oppened
          // scope.$watch('sidebarMinified', function(newVals, oldVals){
          //   if(scope.nodes){
          //     render(makeNested(scope.nodes), iElement)
          //   }
          // });

          // We re-render when the size of the window changes


          // The problem is the nodes might not be here when we look
          // So we keep looking until they are

          // We re-render when we switch admin on/off
          // setTimeout(function(){
          //   scope.$watch('admin',function(newVals, oldVals){
          //     if(newVals){
          //       console.log("admin")
          //       render(makeNested(scope.nodes), iElement);
          //     }
          //   });
          // },1000);

          // // We resize when the data changes
          // scope.$watch('nodes', function(newVals, oldVals) {
          //   if(newVals){
          //     render(makeNested(scope.nodes), iElement);
          //   }
          // });


          // watch for data changes and re-render
          // scope.$watch('copyFlatData', function(newVals, oldVals) {
          //   render(createTreeData(Restangular.copy(newVals)), iElement, getCookieArray);
          //   // scope.dataChanged = true;
          // },true);

          // scope.$watch('dataChanged',function(newVals, oldVals){
          //   if(newVals){
          //     console.log(scope.dataChanged)
          //     render(createTreeData(scope.copyFlatData), iElement, getCookieArray);
          //     // scope.dataChanged = false;
          //   }
          // })

          // scope.changeData = function(data){
          //   // scope.root = data;

          //   // scope.root.x0 = 0;
          //   // scope.root.y0 = scope.height / 2;

          //   update(scope.root);
          // }


        }
      };
    }]);
}());
