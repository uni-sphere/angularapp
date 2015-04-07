(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('collapsibleTree', ['$cookies','$timeout', 'Restangular', function($cookies, $timeout, Restangular) {
      return {
        restrict: 'EA',
        scope: {
          flatData: '=',
          nodeEnd: '=',
          displayError: '='
        },
        link: function(scope, iElement, iAttrs) {

          scope.copyFlatData = Restangular.copy(scope.flatData);
          scope.dataChanged = false;



          /*==========  flat data to nested data  ==========*/
          
          function createTreeData(flatData){
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

          // console.log(scope.flatData[0]);

          
          var margin = {top: 0, right: 20, bottom: 0, left: 150};
          // var restAngularNode = Restangular.one();


          /*==========  Svg creation  ==========*/
          
          var svg = d3.select(iElement[0])
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          /*==========  Cookie gestion  ==========*/
          
          function isInArray(value, array) {
            return array.indexOf(value.toString()) > -1;
          }

          var getCookies = $cookies.get('nodeCookies');
          var getCookieArray;
          
          if( typeof getCookies !== "undefined" ){
            getCookieArray = getCookies.split(',');
          }

          var getActiveNodes = $cookies.get('activeNodes');
          var getActiveNodesArray; 

          if( typeof getActiveNodes !== "undefined" ){
            getActiveNodesArray = getActiveNodes.split(',');
          }

          // console.log(getActiveNodesArray);

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

          var car = [{num:1, type:"Fiat", model:500, color:"white"},{num:2, type:"Fiat", model:500, color:"noire"}];
          var ppd = [{num:1, type:"Fiat", model:500, color:"white"},{num:2, type:"Fiat", model:500, color:"noire"},{num:3, type:"Fiat", model:500, color:"noire"}];

          // console.log(compareObjectsArray(car,ppd));

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

          function compareObjectsArray(a,b){
            var objectId = false;
            // console.log(a);

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
              console.log("youhouu");
              var listObjectsId =[];
              for (var j=0; j < b.length; j ++){
                // console.log(b[j]);
                var idFound = false;
                for(var i=0; i < a.length; i ++){
                  if(a[i].num == b[j].num){
                    idFound = true;
                  } 
                } 
                if(!idFound){
                  console.log(b[j].num)
                  listObjectsId.push(b[j].num);
                }
              }
              return listObjectsId;
            }
            
          }

          /*==========  Renders Tree  ==========*/
          
          window.onresize = function() {
            return scope.$apply();
          };

          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(d){
              return render(createTreeData(scope.flatData), iElement, getCookieArray);
            }
          );

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

          //   scope.update(scope.root);
          // }



          /*=======================================
          =            Update function            =
          =======================================*/
          
          scope.update = function(source) {
            var duration = 750;

            // Compute the new tree layout.
            var nodes = scope.tree.nodes(scope.root).reverse();
            var links = scope.tree.links(nodes);

            // console.log(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });


            // Update the nodes…
            var node = svg.selectAll("g.node")
              .data(nodes, function(d) { return d.id || (d.id = ++scope.i); });


            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { 
                return "translate(" + source.y0 + "," + source.x0 + ")";
              })

            // console.log(nodeEnter);

            nodeEnter.append("circle")
              .attr("class", "circleCollapse")
              .attr("r", 1e-6)
              // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
              .on("click", openNode)

            // nodeEnter.append("circle")
            //   .attr("class", "addNode")
            //   .attr("cx", "-10px")
            //   .attr("cy", "-20px")
            //   .attr("r", 1e-6)
            //   .on("click", addNode)

            nodeEnter.append("text")
              .attr("class", "addNode")
              .attr("x", "-16px")
              .attr("y", "-20px")
              // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              .text("+")
              .style("fill-opacity", 1e-6)
              .on("click", addNode)

            // nodeEnter.append("circle")
            //   .attr("class", "deleteNode")
            //   .attr("cx", "10px")
            //   .attr("cy", "-20px")
            //   .attr("r", 1e-6)
            //   .on("click", deleteNode)
            //   // .call(add_node, "name");

            nodeEnter.append("text")
              .attr("class", "deleteNode")
              .attr("x", "10px")
              .attr("y", "-20px")
              // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              .text("x")
              .style("fill-opacity", 1e-6)
              .on("click", deleteNode)


            nodeEnter.append("text")
              .attr("class", "nameNode")
              .attr("x", function(d) { return d.children || d._children ? -15 : 10; })
              .attr("dy", ".275em")
              .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              .style("fill-opacity", 1e-6)
              .on("click", renameNode)


            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
              .duration(duration)
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("text.deleteNode")
              .style("fill", "#F76565")
              .style("fill-opacity", 1)

            nodeUpdate.select("text.addNode")
              .attr("r", function(d){ return d._children ? 0 : 3; })
              .style("fill", "cornflowerblue")
              .style("fill-opacity",  function(d){ return d._children ? 1e-6 : 1; })

            nodeUpdate.select("circle.circleCollapse")
              .attr("r", 6)
              .style("stroke", "cornflowerblue")
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text.nameNode")
              .style("fill-opacity", 1)
              .text(function(d) { return d.name; });

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
              .duration(duration)
              .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
              .remove();

              nodeExit.select("circle.circleCollapse")
              .attr("r", 1e-6);

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
              // .attr("class", function(d) { return d.target.active ? "link link-active" : "link"; })

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

              /*==========  Save cookies  ==========*/
              
              var postCookies = [];
              var activeNodes = [];

              function findNodesOpen(d){
                if(d.children){
                  d.children.forEach(findNodesOpen);
                }
                if(d._children){
                  d._children.forEach(findNodesOpen);
                  postCookies.push(d.num);
                }
              }

              function findLastNodePath(d){
                activeNodes.push(d.num);
                
                if(d.parent){
                  findLastNodePath(d.parent)
                }
              }

              function intInArray(value, array) {
                return array.indexOf(value) > -1;
              }

              function colornodePath(d) {
                d.active = false;
                if(intInArray(d.num,activeNodes)){
                  d.active = true;
                }
                if (d.children){
                  d.children.forEach(colornodePath);
                }
              }

              function findNodeEnd(d){
                if(!d.children && !d._children){
                  scope.nodeEnd = [d.num, d.name];
                  $cookies.put('nodeEnd', [d.num, d.name]);
                } else{
                  scope.nodeEnd = false;
                  $cookies.put('nodeEnd', false);
                }
              }

              findLastNodePath(d);
              findNodeEnd(d);
              findNodesOpen(scope.root);
              colornodePath(scope.root);
              $cookies.put('nodeCookies', postCookies);
              $cookies.put('activeNodes', activeNodes);


              scope.$apply();
              scope.update(d);
            }

            /*=============================================
            =            Suppression of a node            =
            =============================================*/
            
            function deleteNode(d){
              var nodeSelected = d;

              Restangular.all('nodes/' + d.num).remove().then(function() {

                if (nodeSelected.parent && nodeSelected.parent.children){
                  var nodeToDelete = _.where(nodeSelected.parent.children, {id: nodeSelected.id});
                  if (nodeToDelete){
                    nodeSelected.parent.children = _.without(nodeSelected.parent.children, nodeToDelete[0]);
                  }
                  scope.update(nodeSelected);
                }

                console.log("Objects deleted");
              }, function() {
                console.log("There was an error deleting");
                scope.displayError(["Try again to delete this node"]);
              });

            }

            /*==========================================
            =            Creation of a node            =
            ==========================================*/
            
            function addNode(d){

              var nodeSelected = d
              var newBranch = {parent_id: d.num, name: "new branch"}

              Restangular.all('nodes').post(newBranch).then(function(d) {

                console.log("Object saved OK");
                var a = {name: "new", num: d.id}

                if( nodeSelected.children === undefined || nodeSelected.children == null ){
                  nodeSelected.children = [];
                }

              
                nodeSelected.children.push(a);

                // scope.$apply;
                scope.update(nodeSelected);
              }, function(d) {
                scope.displayError(["Try again to create a node"]);
                // console.log(d.data);
                // console.log(d.status);
                // console.log(d.header);
                // console.log(d.config);
                console.log("There was an error saving");
              });

            }

            /*========================================
            =            Rename of a node            =
            ========================================*/
            
            function renameNode(d){
              var nodeSelected = d;


              var result = prompt('Change the name of the node',d.name);
              if(result) {
                

                var nodeUpdate = {name: result}

                // Restangular.all('node/' + d.num).remove().then(function() {
                Restangular.one('nodes/'+ d.num).put(nodeUpdate).then(function(d) {
                // restAngularNode.put("update", nodeUpdate).then(function() {

                  nodeSelected.name = result;
                  scope.update(nodeSelected);
                 
                  
                  console.log("Object updated");
                }, function(d) {
                  console.log("There was an error updating");
                  scope.displayError(["Try again to change this node's name"]);
                });
                // scope.$apply();
                // console.log(d);
                
              }
            }
          }


          /*=======================================
          =            Render function            =
          =======================================*/
          
          function render(branch, iElement, getCookieArray){
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

           

            if(getCookieArray == undefined){
              branch.children.forEach(collapseAll);
            } else{
              branch.children.forEach(collapseSelectively);
            }

            if(getActiveNodesArray != undefined){
              branch.children.forEach(colorActiveNodes)
            }

            scope.update(scope.root);


            /*==========================================
            =            Collapse functions            =
            ==========================================*/
            
            function collapseSelectively(d) {
              if (d.children){
                d.children.forEach(collapseSelectively);

                if(isInArray(d.num,getCookieArray)){
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
              if(isInArray(d.num,getActiveNodesArray)){
                  d.active = true;
                }
              if (d.children){
                d.children.forEach(colorActiveNodes);
              }
            }

          }
        }
      };
    }]);
}());
