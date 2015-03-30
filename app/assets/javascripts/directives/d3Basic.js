(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('collapsibleTree', ['$cookies','$timeout', 'Restangular', function($cookies, $timeout, Restangular) {
      return {
        restrict: 'EA',
        scope: {
          branch: '='
        },
        link: function(scope, iElement, iAttrs) {

          var margin = {top: 0, right: 20, bottom: 0, left: 150};
          var restAngularNode = Restangular.one('nodes');

          /*==========  Periodical get  ==========*/
          
          // function retrieveNodes() {
          //   restAngularNode.get().then(function(response) {
          //     scope.branch = response;
          //     console.log("Objects get");
          //     $timeout(retrieveNodes, 5000);
          //   }, function() {
          //     console.log("There was an error getting");
          //   });
          // }

          // $timeout(retrieveNodes, 5000);

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

         
         
         

         
          /*==========  Renders Tree  ==========*/
          
          window.onresize = function() {
            return scope.$apply();
          };

          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(d){
              return scope.render(scope.branch, iElement, getCookieArray);
            }
          );

          // // watch for data changes and re-render
          // scope.$watch('branch', function(newVals, oldVals) {
          //   console.log(newVals);
          // }, true);

          /*=======================================
          =            Render function            =
          =======================================*/
          
          scope.render = function(branch, iElement, getCookieArray){
            svg.selectAll("*").remove();

            // setup variables
            var i = 0;
            var duration = 750;


            var width = d3.select(iElement[0])[0][0].offsetWidth - margin.right - margin.left;
            var height = d3.select(iElement[0])[0][0].offsetHeight - margin.top - margin.bottom;

            var tree = d3.layout.tree()
              .size([height, width]);

            var diagonal = d3.svg.diagonal()
              .projection(function(d) { return [d.y, d.x]; });

            var root = branch;
            root.x0 = height / 2;
            root.y0 = 0;

            if(getCookieArray == undefined){
              root.children.forEach(collapseAll);
            } else{
              root.children.forEach(collapseSelectively);
            }

            if(getActiveNodesArray != undefined){
              root.children.forEach(colorActiveNodes)
            }

            update(root);


            /*=======================================
            =            Update function            =
            =======================================*/
            
            function update(source) {

              // Compute the new tree layout.
              var nodes = tree.nodes(root).reverse();
              var links = tree.links(nodes);

              // Normalize for fixed-depth.
              nodes.forEach(function(d) { d.y = d.depth * 180; });


              // Update the nodes…
              var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

              // Enter any new nodes at the parent's previous position.
              var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { 
                  return "translate(" + source.y0 + "," + source.x0 + ")"; 
                })

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

              // nodeUpdate.select("circle.deleteNode")
              //   .attr("r", 3)
              //   .style("fill", "red")
              //   .style("stroke", "#A90707")

               nodeUpdate.select("text.deleteNode")
                .style("fill", "red")
                .style("fill-opacity", 1)

              // nodeUpdate.select("circle.addNode")
              //   .attr("r", function(d){ return d._children ? 0 : 3; })
              //   .style("fill", "blue")
              //   .style("stroke", "#05008E")

              nodeUpdate.select("text.addNode")
                .attr("r", function(d){ return d._children ? 0 : 3; })
                .style("fill", "blue")
                .style("fill-opacity",  function(d){ return d._children ? 1e-6 : 1; })

              nodeUpdate.select("circle.circleCollapse")
                .attr("r", 6)
                .style("stroke", "steelblue")
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
                  return diagonal({source: o, target: o});
                });

              // Transition links to their new position.
              link.transition()
                .duration(duration)
                .attr("d", diagonal)
                .attr("class", function(d) { return d.target.active ? "link link-active" : "link"; })
                // .attr("class", function(d) { return d.target.active ? "link link-active" : "link"; })

              // Transition exiting nodes to the parent's new position.
              link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                  var o = {x: source.x, y: source.y};
                  return diagonal({source: o, target: o});
                })
                .remove();

              // Stash the old positions for transition.
              nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
              });

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

              findLastNodePath(d);
              findNodesOpen(root);
              colornodePath(root);
              $cookies.put('nodeCookies', postCookies);
              $cookies.put('activeNodes', activeNodes);

              scope.$apply();
              update(d);
            }

            /*=============================================
            =            Suppression of a node            =
            =============================================*/
            
            function deleteNode(d){

              if (d.parent && d.parent.children){
                var nodeToDelete = _.where(d.parent.children, {id: d.id});
                if (nodeToDelete){
                  d.parent.children = _.without(d.parent.children, nodeToDelete[0]);
                }
                scope.$apply();
                update(d);
              }

              /*==========  Save suppression  ==========*/

              var nodeToDelete = d.num;
              
              // var nodeToDelete = []

              // function saveNodeToDelete(d){
              //   nodeToDelete.push(d.num);
              //   if(d.children){
              //     d.children.forEach(saveNodeToDelete);
              //   }
              //   if(d._children){
              //     d._children.forEach(saveNodeToDelete);
              //   }
              // }
              // saveNodeToDelete(d);

              restAngularNode.post("delete", nodeToDelete).then(function() {
                console.log("Objects deleted");
              }, function() {
                console.log("There was an error deleting");
              });

            }

            /*==========================================
            =            Creation of a node            =
            ==========================================*/
            
            function addNode(d){

              // //  find the new id
              // var max = 0;
              // function findHighest(d){
              //   // console.log(d.num)
              //   if(parseInt(d.num) > parseInt(max)){
              //     max = d.num;
              //   }
              //   if(d.children){
              //     d.children.forEach(findHighest);
              //   }
              //   if(d._children){
              //     d._children.forEach(findHighest);
              //   }
              // }

              // findHighest(root);
              // max ++;

              // // var a = {name: "new", num: max};


              var a = {name: "new"}

              if( d.children === undefined || d.children == null ){
                d.children = [];
              }
              d.children.push(a);

              /*==========  Save the new branch  ==========*/

              var newBranch = {parentId: d.num, name: "new"}

              restAngularNode.post("create", newBranch).then(function() {
                console.log("Object saved OK");
              }, function(d) {
                // console.log(d.data);
                console.log(d.status);
                // console.log(d.header);
                console.log(d.config);

                // console.log("There was an error saving");
              });


              // // SEND WHOLE TREE
              // var rootCopy = Restangular.copy(root)
              // unCollapse(rootCopy);


              // // restAngularNode.post(root);
              // restAngularNode.post(rootCopy).then(function() {
              //   console.log("Object saved OK");
              // }, function() {
              //   console.log("There was an error saving");
              // });

              scope.$apply();
              update(d);
            }

            /*========================================
            =            Rename of a node            =
            ========================================*/
            
            function renameNode(d){
              var result = prompt('Change the name of the node',d.name);
              if(result) {
                d.name = result;

                scope.$apply();
                update(d);

                var nodeUpdate = {num: d.num, name: result}

                restAngularNode.post("update", nodeUpdate).then(function() {
                  console.log("Object updated");
                }, function(d) {
                  console.log("There was an error updating");
                });
              }
            }
          };
        }
      };
    }]);
}());
