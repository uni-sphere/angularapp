(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('collapsibleTree', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          nodes: '=',
          currentNode: '='
        },
        link: function(scope, iElement, iAttrs) {
        
          // console.log(currentNode);
          // on window resize, re-render d3 canvas
          window.onresize = function() {

            console.log("plop");
            return scope.$apply();
          };

          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(){
              return scope.render(scope.nodes, iElement);
            }
          );

          // watch for data changes and re-render
          // scope.$watch('nodes', function(newVals, oldVals) {
          //   console.log(newVals);
          //   // update(root);
          //   // return scope.$apply();
          //   // scope.render(oldVals, iElement);
          // }, true);

          // scope.$watch('nodes', function(newVals, oldVals) {
          //   // console.log(oldVals);
          //   console.log(newVals);
          //   // return scope.render(newVals, iElement);
          // }, true);


          // console.log(scope.nodes)

          // define render function
          scope.render = function(nodes, iElement){
            // console.log(nodes);

             // setup variables
            var margin = {top: 0, right: 20, bottom: 0, left: 150};
            var i = 0;
            var duration = 750;

            var svg = d3.select(iElement[0])
              .append("svg")
              .attr("width", "100%")
              .attr("height", "100%")
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var width = d3.select(iElement[0])[0][0].offsetWidth - margin.right - margin.left;
            var height = d3.select(iElement[0])[0][0].offsetHeight - margin.top - margin.bottom;

            var tree = d3.layout.tree()
              .size([height, width]);

            var diagonal = d3.svg.diagonal()
              .projection(function(d) { return [d.y, d.x]; });

            // console.log(nodes)
            var root = nodes;
            root.x0 = height / 2;
            root.y0 = 0;

            function collapse(d) {
              if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
              }

              // console.log("yo");
            }

            root.children.forEach(collapse);
            update(root);


            function update(source) {


              // Compute the new tree layout.
              var nodes = tree.nodes(root).reverse();
              var links = tree.links(nodes);

              // Normalize for fixed-depth.
              nodes.forEach(function(d) { d.y = d.depth * 180; });

              // var oldNode = svg.selectAll("g.node")
              //   .data(nodes, function(d) { 
              //     if(d.children != null){
              //     console.log(d);
              //     return d.id || (d.id = ++i); 
              //     }
              //   });

              // var oldNodeEnter = oldNode.enter().append("g")
              //   .attr("class", "oldNode")
              //   .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })

              // oldNodeEnter.append("circle")
              //   .attr("class", "addNode")
              //   .attr("cx", "-10px")
              //   .attr("cy", "-20px")
              //   .attr("r", 3)
              //   .style("fill", "blue")
              //   .on("click", addNode)

              // Update the nodes…
              var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

              // node.transition().duration(750).call(cell);


              // Enter any new nodes at the parent's previous position.
              var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { 
                  return "translate(" + source.y0 + "," + source.x0 + ")"; 
                })


              // console.log(nodeEnter);
              nodeEnter.append("circle")
                .attr("r", 1e-6)
                // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
                .on("click", openNode)

           

              nodeEnter.append("circle")
                .attr("class", "addNode")
                .attr("cx", "-10px")
                .attr("cy", "-20px")
                .attr("r", 1e-6)
                .on("click", addNode)

              nodeEnter.append("circle")
                .attr("class", "deleteNode")
                .attr("cx", "10px")
                .attr("cy", "-20px")
                .attr("r", 1e-6)
                .on("click", deleteNode)
                // .call(add_node, "name");

              
              nodeEnter.append("text")
                .attr("x", function(d) { return d.children || d._children ? -15 : 10; })
                .attr("dy", ".275em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                
                .style("fill-opacity", 1e-6)
                .on("click", renameNode)
               
              // nodeEnter.append("text")
              //   .attr("x", "2em")
              //   .attr("dy", "1.5em")
              //   .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              //   .text(function(d) { return "add node"; })
              //   .style("font-size", ".8em")
              //   .on("click", addNode)
              //   // .style("fill-opacity", 1e-6)
              //   // .style("fill-opacity", 1e-5)

              //   // .fadeIn('slow');

              // Transition nodes to their new position.
              var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

              nodeUpdate.select("circle.deleteNode")
                .attr("r", 3)
                .style("fill", "red")
                // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

              nodeUpdate.select("circle.addNode")
                .attr("r", function(d){
                  if(d.children == null){
                    return 0;
                  } else{
                    return 3;
                  }
                })
                .style("fill", "blue")

              nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

              nodeUpdate.select("text")
                .style("fill-opacity", 1)
                .text(function(d) { return d.name; });

              // Transition exiting nodes to the parent's new position.
              var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

              nodeExit.select("circle")
                .attr("r", 1e-6);

              nodeExit.select("text")
                .style("fill-opacity", 1e-6);

              // Update the links…
              var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

              // Enter any new links at the parent's previous position.
              link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                  var o = {x: source.x0, y: source.y0};
                  return diagonal({source: o, target: o});
                });

              // Transition links to their new position.
              link.transition()
                .duration(duration)
                .attr("d", diagonal);

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
                // console.log(d.name);
                d.x0 = d.x;
                d.y0 = d.y;
              });

              // console.log("yo");

            }

            // Toggle children on click.
            function openNode(d) {
              if (d.children) {
                d._children = d.children;
                d.children = null;
                // console.log("children");
                // console.log(d);
              } else {
                d.children = d._children;
                d._children = null;
                // console.log("no children")
                // console.log(d);
              }
              scope.currentNode = d;
              scope.$apply();
              update(d);
            }

            function deleteNode(d){
              if (d.parent && d.parent.children){
                var nodeToDelete = _.where(d.parent.children, {id: d.id});
                if (nodeToDelete){
                  d.parent.children = _.without(d.parent.children, nodeToDelete[0]);
                }
                scope.$apply();
                update(d);
              }
            }

            function addNode(d){
              var a = {"name": "new"};
              d.children.push(a);


              // console.log(d.children);

              // if(typeof d.children === 'undefined'){
              //   d.children = [a];
              // } else if (d.children == null) {
              //   d.children = d._children;
              //   d.children.push(a);
              //   d._children = null;
              // } else{
              //   d.children.push(a);
              //   // console.log("yo");
              // }

              scope.$apply();
              update(d);
            }

            function renameNode(d){
              var result = prompt('Change the name of the node',d.name);
              if(result) {
                d.name = result;
              }
              // svg.selectAll("*").remove();
              scope.$apply();
              update(d);
            }

            function openGroupView(d){
              // console.log("yo");
            }

          };
        }
      };
    }]);
}());
