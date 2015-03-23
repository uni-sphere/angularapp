(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('collapsibleTree', ['d3','$cookies', '$filter', 'Restangular', function(d3, $cookies, $filter, Restangular) {
      return {
        restrict: 'EA',
        scope: {
          branch: '=',
          currentNode: '='
        },
        link: function(scope, iElement, iAttrs) {
          var margin = {top: 0, right: 20, bottom: 0, left: 150};

          var removeUnwantedAttribute = function(key, value){
            if(key == 'parent' || key == 'reqParams' || key == 'fromServer' || key == 'parentResource' || key == 'restangularCollection' || key == 'route' || key == 'restangularEtag' || key == 'id' || key == 'depth' || key == 'x' || key == 'y' || key == 'x0' || key == 'y0'){
              return;
            } else{
              return value;
            }
          };

          var plop = function(key, value){
            if(key == 'parent' || key == 'id' || key == 'depth' || key == 'x' || key == 'y' || key == 'x0' || key == 'y0'){
              return;
            } else{
              return value;
            }
          };

          // var backendNode = Restangular.one('api');

          var svg = d3.select(iElement[0])
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var getCookies = $cookies.get('nodeCookies');
          var getCookieArray;
          
          if( typeof getCookies !== "undefined" ){
            getCookieArray = getCookies.split(',');
          }
         
          
          // on window resize, re-render d3 canvas
          window.onresize = function() {
            return scope.$apply();
          };

          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(d){

              // console.log(scope.branch);
              return scope.render(scope.branch, iElement, getCookieArray);
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


          // define render function
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

            function isInArray(value, array) {
              return array.indexOf(value.toString()) > -1;
            }

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

            if(getCookieArray == undefined){
              root.children.forEach(collapseAll);
            } else{
              root.children.forEach(collapseSelectively);
            }

            update(root);


            function update(source) {



              // Compute the new tree layout.
              var nodes = tree.nodes(root).reverse();
              var links = tree.links(nodes);

              // Normalize for fixed-depth.
              nodes.forEach(function(d) { d.y = d.depth * 180; });


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

              // Transition nodes to their new position.
              var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

              nodeUpdate.select("circle.deleteNode")
                .attr("r", 3)
                .style("fill", "red")
                // .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

              nodeUpdate.select("circle.addNode")
                .attr("r", function(d){ return d._children ? 0 : 3; })
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
                d.x0 = d.x;
                d.y0 = d.y;
              });

            }

            // Toggle children on click.
            function openNode(d) {
              if (d.children) {
                d._children = d.children;
                d.children = null;
              } else {
                d.children = d._children;
                d._children = null;
              }

              var postCookies = [];
              function saveCollapse(d){
                if(d.children){
                  d.children.forEach(saveCollapse);
                }
                if(d._children){
                  d._children.forEach(saveCollapse);
                  postCookies.push(d.num);
                }
              }

              saveCollapse(branch);
              // console.log(postCookies);
              $cookies.put('nodeCookies', postCookies);
            


              // var ooo = function(key, value){
              //   if(key == 'parent' || key == 'reqParams' || key == 'fromServer' || key == 'parentResource' || key == 'restangularCollection' || key == 'route' || key == 'restangularEtag' || key == 'depth' || key == 'x' || key == 'y' || key == 'x0' || key == 'y0'){
              //     return;
              //   } else if(key == '_children'){
              //     return true;
              //   } 
              //   else{
              //     return value;
              //   }
              // };


              // var postCookies = JSON.stringify(scope.nodes, ooo);
              // console.log(postCookies);

              // $cookies.put('nodeCookies', postCookies);

              // function pp(d) {
              //   console.log(d);
              //   if (d.children) {
              //     // console.log(d.children);
              //     if(d._children){
              //       // console.log(d.children)
              //       d._children = d.children;
              //       d._children.forEach(pp);
              //       // d.collapse = true;
              //     }
              //     d.children = null;
              //   }
              // }

              // nodes.children.forEach(pp);
              // console.log(scope.nodes);

              // console.log(scope.nodes.children.forEach(pp));



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

                // scope.nodes.save();


                // console.log(JSON.stringify(scope.nodes, plop));


              }
            }

            function addNode(d){
              var max = 0;
              function findHighest(d){
                // console.log(d.num)
                if(parseInt(d.num) > parseInt(max)){
                  max = d.num;
                }
                if(d.children){
                  d.children.forEach(findHighest);
                }
                if(d._children){
                  d._children.forEach(findHighest);
                }
              }

              findHighest(scope.branch);
              max ++;


              var a = {name: "new", num: max};

              if( d.children === undefined || d.children == null ){
                d.children = [];
              }
              d.children.push(a);
              

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
