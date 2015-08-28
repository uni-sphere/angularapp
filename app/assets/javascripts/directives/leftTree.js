(function () {

  angular.module('mainApp.directives')
    .directive('leftTree', ['ipCookie', '$timeout', 'Restangular', 'Notification', function(ipCookie, $timeout, Restangular, Notification) {
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
          makeNested: '=',
          reloadNodes: '=',
          cookieGestion: '=',
        },
        link: function(scope, iElement, iAttrs) {

          scope.cookieGestion = function(flatNode, nodes){
            var nodeIDs = []
            angular.forEach(flatNode, function(value,key){
              nodeIDs.push(value.num)
            });

            // Cookies gestion
            if(scope.home || scope.sandbox){
              scope.foldedNodes = [4];
              scope.activeNodes = [[17,"Histoire"],[9,"S"],[3,"Premiere"],[1,"Sandbox"]];
              scope.nodeEnd = [17,"Histoire"];
            } else{

              // We look if the node in the cookies still exist
              if(!ipCookie('nodeEnd') || nodeIDs.indexOf(ipCookie('nodeEnd')[0]) > -1){
                console.log('Ok: No problem in cookies')
                scope.activeNodes = ipCookie('activeNodes');
                scope.nodeEnd = ipCookie('nodeEnd');
              } else{
                console.log('Ok: problems in the cookies')
                if(nodes.children[0].children || nodes.children[0]._children){
                  scope.nodeEnd = false
                } else{
                  scope.nodeEnd = [flatNode[1].num,flatNode[1].name]
                }
                scope.activeNodes = [[flatNode[1].num,flatNode[1].name],[flatNode[0].num,flatNode[0].name]]
                changeBreadcrumb()
              }

              scope.foldedNodes = [];
              angular.forEach(ipCookie('foldedNodes'), function(value,key){
                if(nodeIDs.indexOf(value) > -1){
                  scope.foldedNodes.push(value)
                }
              });

              // console.log(scope.nodeEnd)
              // console.log(scope.breadcrumb)
              ipCookie('activeNodes', scope.activeNodes);
              ipCookie('foldedNodes', scope.foldedNodes);
              ipCookie('nodeEnd', scope.nodeEnd);
              console.log("Ok: Cookie")
            }
          }

          scope.reloadNodes = function(){
            Restangular.one('nodes').get().then(function (nodes) {
              console.log("Ok: node retrieved")
              scope.flatNode = nodes.plain();
              // console.log(scope.flatNode)
              scope.nodes = scope.makeNested(scope.flatNode)
              scope.cookieGestion(nodes.plain(),scope.nodes);
              render(scope.nodes, iElement);
            },
              function(d){
              Notification.error("Can not display your tree")
              console.log("Error: Get nodes");
              console.log(d)
            });
          }

          var dummyId = 50
          /*==========  Svg creation  ==========*/
          var margin = {top: 0, right: 20, bottom: 0, left: 30};

          var svg = d3.select(iElement[0])
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          scope.$watch('nodes',function(newVals, oldVals){
            if(newVals){
              scope.$watch('admin',function(newVals, oldVals){
                if(newVals != undefined){
                  console.log("Ok: Tree rendered")
                  render(scope.nodes, iElement);
                }
              });
            }
          });

          function update(source) {
            var duration = 750;

            // Compute the new tree layout.
            var nodes = scope.tree.nodes(scope.root).reverse();
            var links = scope.tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 140});

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
                .attr("class", function(d){return typeof d.parent === 'object' ? "nameNode" : ""})
                .attr("x", function(d) { return d.children || d._children ? -15 : 10; })
                .attr("dy", ".275em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .style("fill-opacity", 1e-6)
                .text(function(d) { return d.name; })
                .on("click", renameNode)

              // Little + to add a node
              nodeEnter.append("text")
                .attr("class", "addNode")
                .attr("x", "-16px")
                .attr("y", "-20px")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text("+")
                .style("fill-opacity", 1e-6)
                .style("fill", "cornflowerblue")
                .on("click", addNode)

              // Little - to remove a node
              nodeEnter.append("text")
                .attr("class", "deleteNode")
                .attr("x", "10px")
                .attr("y", "-20px")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text("x")
                .style("fill-opacity", 1e-6)
                .style("fill", "#F76565")
                .on("click", deleteNode)
            } else{
               // Label of the node. When clicked it opens the node
              nodeEnter.append("text")
              .attr("class", function(d){return typeof d.parent === 'object' ? "nameNode" : ""})
              .attr("x", function(d) { return d.children || d._children ? -15 : 10; })
              .attr("dy", ".275em")
              .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              .text(function(d) { return d.name; })
              .style("fill-opacity", 1e-6)
              .on("click", openNode)
            }

            // Transition nodes to their new position.
            // We make opace or inccrease the size of all elements

            var nodeUpdate = node.transition()
              .duration(duration)
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("text.deleteNode")
              .style("fill-opacity", 1)

            nodeUpdate.select("text.addNode")
              .style("fill-opacity", 1)
              .style("fill-opacity",  function(d){ return d._children ? 1e-6 : 1; })

            nodeUpdate.select("circle.circleCollapse")
              .attr("r", 6)
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff" })

            nodeUpdate.select("text.nameNode")
              .style("fill-opacity", 1)
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
            for(var i = scope.activeNodes.length - 2; i >= 0; i--){
              tempBreadcrumb.push(scope.activeNodes[i][1]);
            }
            scope.breadcrumb = tempBreadcrumb;
          }

          function renameBreadCrumb(nodeChanged){
            scope.breadcrumb = []
            for(var i = scope.activeNodes.length - 2; i >= 0; i--){
              if(scope.activeNodes[i][0] == nodeChanged.num){
                scope.breadcrumb.push(nodeChanged.name);
                scope.activeNodes[i][1] = nodeChanged.name;
                if(!scope.home && !scope.sandbox){
                  console.log(scope.activeNodes)
                  ipCookie('activeNodes', scope.activeNodes);
                }
              } else{
                scope.breadcrumb.push(scope.activeNodes[i][1]);
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
              scope.nodeEnd = [node.num, node.name];
              // Demo mode
              if(!scope.home && !scope.sandbox){
                ipCookie('nodeEnd', [node.num, node.name]);
              }
            } else{
              scope.nodeEnd = false;
              ipCookie('nodeEnd', false);
            }
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
              Restangular.all('nodes/' + node.num).remove().then(function(res) {

                for( var i = 0; i < res.deleted.length; i ++){
                  removeFromArray(scope.chapterFolded, res.deleted[i].toString())
                }

                var nodeToDelete = _.where(node.parent.children, {id: node.id});
                if (nodeToDelete){
                  node.parent.children = _.without(node.parent.children, nodeToDelete[0]);
                  Notification.warning("Node removed")
                }

                // We check if the node end was in the node deleted.
                // than we need to change the cookies

                function deleteProperly(node, nodeInitial){
                  if(node.num == scope.nodeEnd[0]){
                    scope.nodeEnd = false;

                    findFoldedNodes(scope.root);
                    findActiveNodes(nodeInitial.parent)

                    ipCookie('activeNodes', scope.activeNodes);
                    ipCookie('nodeEnd', scope.nodeEnd);
                    ipCookie('foldedNodes', scope.foldedNodes);
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
                console.log("Ok: Node deleted");
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
              Restangular.all('nodes').post(newBranch).then(function(d) {
                Notification.success("Node created")
                console.log("Ok: node added");
                var a = {name: "new", num: d.id, parent: node}

                if( node.children == undefined || node.children == null ){
                  node.children = [];
                }

                node.children.push(a);

                // Select the node
                findActiveNodes(node.children[node.children.length - 1]);
                findNodeEnd(node.children[node.children.length - 1]);
                colornodePath(scope.root);

                console.log(scope.activeNodes)
                ipCookie('activeNodes', scope.activeNodes);
                ipCookie('nodeEnd', scope.nodeEnd);

                update(node);


              }, function(d) {

                if(d.status == 404) {
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

            var result = prompt('Change the name of the node',node.name);
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
              .size([scope.height, scope.width]);

            scope.diagonal = d3.svg.diagonal()
              .projection(function(d) { return [d.y, d.x]; });

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