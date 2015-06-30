(function () {

  angular.module('mainApp.directives')
    .directive('collapsibleTree', ['ipCookie', '$timeout', 'Restangular', 'Notification', function(ipCookie, $timeout, Restangular, Notification) {
      return {
        restrict: 'EA',
        scope: {
          nodeEnd: '=',
          activeNodes: '=',
          admin: '=',
          sidebarMinified: '=',
          home: '=',
          sandbox: '='
        },
        link: function(scope, iElement, iAttrs) {

          var dummyId = 50

          // First we get the nodes
          Restangular.one('nodes').get().then(function (nodes) {
            scope.nodes = nodes.plain();
            scope.$watch('admin',function(newVals, oldVals){
              if(newVals != undefined){
                render(makeNested(scope.nodes), iElement);
              }
            });

            window.onresize = function() {
              render(makeNested(scope.nodes), iElement);
            };
          }, function(d){
            Notification.error("We temporarily can't display the nodes")
            console.log("Error: Get nodes");
            console.log(d)
          });


          // scope.dataChanged = false;

          /*==========  Svg creation  ==========*/
          var margin = {top: 0, right: 20, bottom: 0, left: 30};

          var svg = d3.select(iElement[0])
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          /*==========  Cookie gestion  ==========*/

          // Folded nodes
          // Demo
          if(scope.home || scope.sandbox){
            scope.foldedNodes = [4]
          }
          // Normal version
          else{
            scope.foldedNodes = ipCookie('foldedNodes');
          }

          // Active nodes
          // Demo
          if(scope.home || scope.sandbox){
            scope.activeNodes = [[17,"Histoire"],[9,"S"],[3,"Premiere"],[1,"Sandbox"]]
          }
          // Normal version
          else{
            scope.activeNodes = ipCookie('activeNodes');
          }

          //Node end
          // Demo
          if(scope.home || scope.sandbox){
            scope.nodeEnd = [17,"Histoire"]
          }
          // Normal version
          else{
            scope.nodeEnd = ipCookie('nodeEnd');
            if(scope.nodeEnd == "false"){
              scope.nodeEnd = false;
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

          /*=======================================
          =            Update function            =
          =======================================*/

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

            if(!scope.admin){

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


          /*======================================
          =            Open and Close            =
          ======================================*/

          function openNode(d) {
            var clickedNode = d;

            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }

            scope.foldedNodes = [];
            scope.activeNodes = [];

            findActiveNodes(d);
            findNodeEnd(d);
            findFoldedNodes(scope.root);
            colornodePath(scope.root);

            if(!scope.home && !scope.sandbox){
              ipCookie('activeNodes', scope.activeNodes);
              ipCookie('foldedNodes', scope.foldedNodes);
            }

            scope.$apply();
            update(d);
          }


          /*==========  Find the node that are collapsed and add them to cookies  ==========*/

          function findFoldedNodes(d){
            if(d.children){
              d.children.forEach(findFoldedNodes);
            }
            if(d._children){
              d._children.forEach(findFoldedNodes);
              scope.foldedNodes.push(d.num);
            }
          }

          /*==========  Find the node path and add it to active nodes ( in ordrer to color nodes)  ==========*/

          function findActiveNodes(d){
            scope.activeNodes.push([d.num, d.name]);
            if(d.parent){
              findActiveNodes(d.parent)
            }

          }

          /*==========  Use activeNodes to color the nodes  ==========*/

          function colornodePath(d) {
            d.active = false;
            if(intInDoubleArray(d.num,scope.activeNodes)){
              d.active = true;
            }
            if (d.children){
              d.children.forEach(colornodePath);
            }
          }

          /*==========  Save in cookies if the current node is an end node  ==========*/

          function findNodeEnd(d){
            if(!d.children && !d._children){
              scope.nodeEnd = [d.num, d.name];
              // Demo mode
              if(!scope.home && !scope.sandbox){
                ipCookie('nodeEnd', [d.num, d.name]);
              }
            } else{
              scope.nodeEnd = false;
              ipCookie('nodeEnd', false);
            }
          };

          /*=============================================
          =            Suppression of a node            =
          =============================================*/

          function deleteNode(d){
            var nodeSelected = d;

            // Demo app
            if(scope.home || scope.sandbox){
              var nodeToDelete = _.where(nodeSelected.parent.children, {id: nodeSelected.id});
              if (nodeToDelete){
                nodeSelected.parent.children = _.without(nodeSelected.parent.children, nodeToDelete[0]);
              }


              function deleteProperly(node){
                if(node.num == scope.nodeEnd[0]){
                  scope.nodeEnd = [scope.root.num, scope.root.name]
                  scope.activeNodes = [scope.nodeEnd]
                  findFoldedNodes(scope.root);
                  colornodePath(scope.root);

                  scope.$apply()
                }
                if(node.children){
                  // console.log(node.children)
                  node.children.forEach(deleteProperly)
                }
                if(node._children){
                  node._children.forEach(deleteProperly)
                }
              }

              deleteProperly(nodeSelected)
              update(nodeSelected);

            }
            // If we are the app
            else{
              Restangular.all('nodes/' + d.num).remove().then(function() {
                var nodeToDelete = _.where(nodeSelected.parent.children, {id: nodeSelected.id});
                if (nodeToDelete){
                  nodeSelected.parent.children = _.without(nodeSelected.parent.children, nodeToDelete[0]);
                }

                // We check if the node end was in the node deleted.
                // than we need to change the cookies

                function deleteProperly(node){
                  if(node.num == scope.nodeEnd[0]){
                    scope.nodeEnd = [scope.root.num, scope.root.name]
                    scope.activeNodes = [scope.nodeEnd]
                    findFoldedNodes(scope.root);
                    ipCookie('activeNodes', scope.activeNodes);
                    ipCookie('nodeEnd', scope.nodeEnd);
                    ipCookie('foldedNodes', scope.foldedNodes);
                    colornodePath(scope.root);
                  }
                  if(node.children){
                    // console.log(node.children)
                    node.children.forEach(deleteProperly)
                  }
                  if(node._children){
                    node._children.forEach(deleteProperly)
                  }
                }

                deleteProperly(nodeSelected)


                update(nodeSelected);
                console.log("Objects deleted");
              }, function(d) {
                console.log(d);
                console.log("Error: Delete node");
               Notification.error('You can\'t temporarily delete a node');
              });
            }

          }

          /*==========================================
          =            Creation of a node            =
          ==========================================*/

          function addNode(d){

            var nodeSelected = d
            var newBranch = {parent_id: d.num, name: "new"}

            // Demo app
            if(scope.home || scope.sandbox){
              var a = {name: "new", num: dummyId}
              dummyId ++;

              if( nodeSelected.children === undefined || nodeSelected.children == null ){
                nodeSelected.children = [];
              }
              nodeSelected.children.push(a);

              update(nodeSelected);
            }

            // Normal app
            else{
              Restangular.all('nodes').post(newBranch).then(function(d) {

                console.log("Object saved OK");
                var a = {name: "new", num: d.id}

                if( nodeSelected.children == undefined || nodeSelected.children == null ){
                  nodeSelected.children = [];
                }

                nodeSelected.children.push(a);
                // console.log(nodeSelected)
                // console.log(scope.root)
                // console.log(nodeSelected.children)
                update(nodeSelected);


              }, function(d) {
                console.log("Error: New node");
                console.log(d);
                Notification.error("You can't temporarily create a new node");

              });
            }

          }


          /*========================================
          =            Rename of a node            =
          ========================================*/

          function renameNode(d){
            var nodeSelected = d;

            var result = prompt('Change the name of the node',d.name);
            if(result) {
              var nodeUpdate = {name: result}

              if(scope.home || scope.sandbox){
                nodeSelected.name = result;
                update(nodeSelected);
              } else{
                Restangular.one('nodes/'+ d.num).put(nodeUpdate).then(function(d) {
                  nodeSelected.name = result;
                  update(nodeSelected);
                  console.log("Object updated");
                }, function(d) {
                  console.log("Error: Rename node");
                  console.log(d);
                  Notification.error("We can't temporarily rename this node")
                });
              }
            }
          }

          /*=======================================
          =            Render function            =
          =======================================*/

          function render(branch, iElement){
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
            }

            update(scope.root);
          }

          /*==========================================
          =            Collapse functions            =
          ==========================================*/

          function collapseSelectively(d) {
            if (d.children){
              d.children.forEach(collapseSelectively);

              if(isInArray(d.num,scope.foldedNodes)){
                d._children = d.children;
                d.children = null;
              }
            }
          }

          function collapseAll(d) {
            if (d.children) {
              d._children = d.children;
              d._children.forEach(collapseAll);
              d.children = null;
            }
          }

          function unCollapse(d){
            if(d._children){
              d.children = d._children;
              d._children = null;
            }
            if(d.children){
              d.children.forEach(unCollapse);
            }
          }

          /*===================================
          =            Color nodes            =
          ===================================*/
          function colorActiveNodes(d) {
            if(isInDoubleArray(d.num,scope.activeNodes)){
              d.active = true;
            }
            if (d.children){
              d.children.forEach(colorActiveNodes);
            }
          }

          /*========================================
          =            Utility function            =
          ========================================*/

          /*==========  flat data to nested data  ==========*/

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


          /*==========  Compare objects  ==========*/

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

          /*==========  Compares two arrays of objects  ==========*/

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

        }
      };
    }]);
}());
