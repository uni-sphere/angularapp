(function () {

  angular
    .module('mainApp.directives')
    .directive('leftTree', leftTree)

  leftTree.$inject = ['$translate', '$rootScope', 'ipCookie', '$timeout', 'Restangular', 'Notification', 'ModalService', 'cookiesService', 'nodeService', 'nodeCrudService'];
  function leftTree($translate, $rootScope, ipCookie, $timeout, Restangular, Notification, ModalService, cookiesService, nodeService, nodeCrudService){
    var directive = {
      link: link,
      scope:{
        activeChapter: '=',
        viewNews: '=',
        viewhome: '=',
      }
    };
    return directive;

    function link(scope){

      var drag_node;

      $translate(['DRAG_NODE']).then(function (translations) {
        drag_node = translations.DRAG_NODE;
      });

      $rootScope.$watch('admin', function(newVals, oldVals){
        if(newVals != undefined){
          cookiesService.reload()
        }
      });

      scope.$on('reloadTree', function (event, data) {
        $rootScope.contentLoaded = true;
        render()
      });

      /*==========  Svg creation  ==========*/
      var margin = {top: 20, right: 20, bottom: 10, left: 30};
      // var panBoundary = 20;
      var selectedNode = null;
      var draggingNode = null;
      // var dragStarted = false;
      // var panSpeed = 200;

      var leftTreeSvg = d3.select($('#view-tree')[0])
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      $rootScope.$watch('viewhome', function(newVals, oldVals){
        if(oldVals == false && newVals == true){
          render();
        }
      });

      /*===================================
      =            Drag N Drop            =
      ===================================*/

      function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
        d3.select(domNode).attr('class', 'node activeDrag');

        leftTreeSvg.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
          if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
          else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
          // remove link paths
          links = scope.leftTree.links(nodes);
          nodePaths = leftTreeSvg.selectAll("path.link")
            .data(links, function(d) {
              return d.target.id;
            }).remove();
          // remove child nodes
          nodesExit = leftTreeSvg.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id;
            }).filter(function(d, i) {
              if (d.id == draggingNode.id) {
                return false;
              }
            return true;
          }).remove();
        }

        // remove parent link
        parentLink = scope.leftTree.links(scope.leftTree.nodes(draggingNode.parent));
        leftTreeSvg.selectAll('path.link').filter(function(d, i) {
          if (d.target.id == draggingNode.id) {
            return true;
          }
          return false;
        }).remove();

        dragStarted = null;
      }

      function expand(d) {
        if (d._children) {
          d.children = d._children;
          d.children.forEach(expand);
          d._children = null;
        }
      }

      var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
      };

      var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
      };

      var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
          // have to flip the source coordinates since we did this for the existing connectors on the original tree
          data = [{
            source: {
              x: selectedNode.y0,
              y: selectedNode.x0
            },
            target: {
              x: draggingNode.y0,
              y: draggingNode.x0
            }
          }];
        }
        var link = leftTreeSvg.selectAll(".templink").data(data);

        link.enter().append("path")
          .attr("class", "templink")
          .attr("d", d3.svg.diagonal())
          .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
      };

      // Define the drag listeners for drag/drop behaviour of nodes.
      dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
          console.log("drag")
          // Only admin and user who created the node can move it
          if (d == scope.root || (!$rootScope.superadmin && d.user_id != $rootScope.userId)) {
            return;
          }
          dragStarted = true;
          nodes = scope.leftTree.nodes(d);
          d3.event.sourceEvent.stopPropagation();
          // it's important that we suppress the mouseover event on the node being dragged.
          // Otherwise it will absorb the mouseover event and the underlying node will not
          //detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
          if (d == scope.root || (!$rootScope.superadmin && d.user_id != $rootScope.userId)) {
            return;
          }
          if (dragStarted) {
            // console.("hey")
            domNode = this;
            initiateDrag(d, domNode);
          }

          d.x0 += d3.event.dy;
          d.y0 += d3.event.dx;
          var node = d3.select(this);
          node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
          updateTempConnector();
        }).on("dragend", function(d) {
          if (d == scope.root || (!$rootScope.superadmin && d.user_id != $rootScope.userId)) {
            return;
          }
          domNode = this;
          if (selectedNode) {
            // now remove the element from the parent, and insert it into the new elements children
            var index = draggingNode.parent.children.indexOf(draggingNode);
            if (index > -1) {
              draggingNode.parent.children.splice(index, 1);
            }
            if(typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
              if (typeof selectedNode.children !== 'undefined') {
                selectedNode.children.push(draggingNode);
                // draggingNode.parent = selectedNode
              } else {
                selectedNode._children = [draggingNode];
                // draggingNode.parent = selectedNode
              }
            } else {
              selectedNode.children = [draggingNode];
              // draggingNode.parent = selectedNode
            }

            // Make sure that the node being added to is expanded so user can see added node is correctly moved
            expand(selectedNode);

            // We send all to the backend
            Restangular.one('nodes/'+ draggingNode.id).put({parent: selectedNode.id}).then(function(res) {
              console.log("Ok: node drag and dropped")
            }, function(error) {
              console.log("Error: Impossible to drag and drop this node")
              console.log(error)
              Notification.error(drag_node)
              cookiesService.reload()
            })

            endDrag();
          } else {
            endDrag();
          }
        });

      function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', 'node');

        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        updateTempConnector();
        if (draggingNode !== null) {

          // We need to first do the animation ( to update parents ) than change the colors
          // than do the animation again ( very short ) to update colors
          update(scope.root, 750);
          $timeout(function(){
            nodeService.changeNode(draggingNode)
            nodeService.findFoldedNodes(draggingNode);
            update(scope.root, 1);
            draggingNode = null;
          }, 600)

        }
      }

      /*==============================
      =            RENDER            =
      ==============================*/

      function render(){
        console.log("OK: Tree rendered")

        window.onresize = function() {
          if(window.location.pathname == '/' || (window.location.pathname == '/home' && $rootScope.viewhome)){
            render();
          }
        };

        if($rootScope.home){
          scope.leftTreeWidth = ((window.innerWidth * 80/100 - 70) * 65/100 - margin.right - margin.left - 3);
          scope.leftTreeHeight = window.innerHeight - 270 - 50 - margin.top - margin.bottom;
        } else{
          scope.leftTreeWidth = (window.innerWidth - 70) * 65/100 - margin.right - margin.left - 3;
          scope.leftTreeHeight = window.innerHeight - 50 - margin.top - margin.bottom;
        }

        leftTreeSvg.selectAll("*").remove();

        scope.root = $rootScope.nodes;
        scope.root.x0 = scope.leftTreeHeight / 2;
        scope.root.y0 = 0;

        scope.leftTree = d3.layout.tree()
          .separation(function(a,b){
            if(a.parent != b.parent || b.children ){
              return 2
            } else{
              return 1
            }
          })
          .size([scope.leftTreeHeight, scope.leftTreeWidth])

        scope.leftTreeDiagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

        if($rootScope.foldedNodes == undefined){
          nodeService.collapseAll($rootScope.nodes)
        } else{
          nodeService.collapseSelectively($rootScope.nodes);
        }

        // When we render, the nodeEnd, foldedNodes, activeNodes have already been set ( all that has to do with cookies)
        // So we just need to color the active nodes and find the proper breadcrumb to display
        nodeService.colorActiveNodes($rootScope.nodes)
        nodeService.findBreadCrumb()

        update(scope.root, 1);
      }

      /*==============================
      =            UPDATE            =
      ==============================*/

      function update(source, time) {
        var maxWidth = scope.leftTreeWidth - 150
        var duration = time;

        // Compute the new tree layout.
        var nodes = scope.leftTree.nodes(scope.root).reverse();
        var links = scope.leftTree.links(nodes);

        // We find the length of the links
        // We want the tree to be the whole size of the left part
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

        /*====================================
        =            Update nodes            =
        ====================================*/

        var node = leftTreeSvg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = d.num); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
          .call(dragListener)
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
          })
          .on("contextmenu", function (d, i) {
            d3.event.preventDefault();
          });

        // In all case we happened a circle that toogles the nodes
        nodeEnter.append("circle")
          .attr("class", "circleCollapse")
          .attr("r", 1e-6)
          .style("stroke", "cornflowerblue")
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff" })
          .on('click', toggleNode)
          // .call(dragListener)
          // .on("click", toggleNode)


        // We have a different display when the user is an admin or not
        if($rootScope.admin){
          // Label of the node. Rename of the node or simple display
          // In case the nodes belongs to the user he can rename it.
          // In case it doesn't it is just a display
          nodeEnter.append("text")
            // .call(dragListener)
            .attr("class", function(d){
              if(typeof d.parent != 'object'){
                return ""
              } else if(d.user_id == $rootScope.userId || $rootScope.superadmin){
                return "renameNode"
              } else{
                return "justDisplayNode"
              }
            })
            .text(function(d) { return d.name; })
            .on("click", renameNode)
            .attr("y", function(d) { return d.children ? 25 : 5; })
            .attr("text-anchor", function(d){
              if(d.children){
                return "middle"
              } else{
                return "start"
              }
            })
            .attr("x", function(d){
              if(!d.children){
                return 15
              }
            })
            .on("contextmenu", function (d, i) {
              console.log("plop")
            });

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

          nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 25)
            .attr("opacity", 0.2) // change this to zero to hide the target area
            .style("fill", "red")
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
              overCircle(node);
            })
            .on("mouseout", function(node) {
              outCircle(node);
            });

          // nodeEnter.append("circle")
          //   .attr('class', 'ghostInBetweenCircle')
          //   .attr('display', function(node){
          //     if(node.parent.children && node.parent.children.length > 1){
          //       console.log(node.parent)
          //       return 'block'
          //     } else{
          //       return 'none'
          //     }
          //   })
          //   .attr("opacity", 0.2) // change this to zero to hide the target area
          //   .style("fill", "blue")
          //   .attr("r", 5)
          //   .attr("cy", -35)

            // .attr('pointer-events', 'mouseover')
            // .on("mouseover", function(node) {
            //   overInBetweenCircle(node);
            // })
            // .on("mouseout", function(node) {
            //   overInBetweenCircle(node);
            // });
        }
        // NOT admin
        else{
           // Label of the node. When clicked it opens the node
          nodeEnter.append("text")
            .attr("class", function(d){return typeof d.parent === 'object' ? "nameNode" : ""})
            .attr("x", function(d) { return d.children ? 0 : 15; })
            .attr("y", function(d) { return d.children ? 25 : 5; })
            .attr("text-anchor", function(d) { return d.children ? "middle" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6)
            // .on("click", toggleNode)
        }

        /*========================================
        =            Transition nodes            =
        ========================================*/

        var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        // We show the delete button only if the node belongs to the user
        nodeUpdate.select("text.deleteNode").style("fill-opacity", function(d){
          if($rootScope.userId == d.user_id || $rootScope.superadmin){
            return 1;
          } else{
            return 1e-6;
          }
        })

        // We show the add button only if the node is open and belongs to the user
        nodeUpdate.select("text.addNode").style("fill-opacity",  function(d){
          if(d._children){
            return 1e-6
          } else if(!d.children && $rootScope.userId != d.user_id && !d.superadmin && !$rootScope.superadmin){
            return 1e-6
          } else{
            return 1
          }
        })

        // We always show the circle
        nodeUpdate.select("circle.circleCollapse")
          .attr("r", 6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff" })

        // We change the position of the text if it is an leaf or not
        nodeUpdate.select("text.nameNode, text.justDisplayNode, text.renameNode")
          .style("fill-opacity", 1)
          .attr("y", function(d) { return d.children ? 25 : 5; })
          .attr("text-anchor", function(d){
            if(d.children){
              return "middle"
            } else{
              return "start"
            }
          })
          .attr("x", function(d){
            if(!d.children){
              return 15
            }
          })

        // Transition exiting nodes to the parent's new position.
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

        /*====================================
        =            Update links            =
        ====================================*/

        var link = leftTreeSvg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return scope.leftTreeDiagonal({source: o, target: o});
          });

        // Transition links to their new position.
        link.transition()
          .duration(duration)
          .attr("d", scope.leftTreeDiagonal)
          .attr("class", function(d) { return d.target.active ? "link link-active" : "link"; })

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return scope.leftTreeDiagonal({source: o, target: o});
          })
          .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      /*======================================
      =            NODE FUNCTIONS            =
      ======================================*/

      function toggleNode(node) {
        if (d3.event.defaultPrevented) return; // click suppressed
        $rootScope.resizeCircle()
        nodeCrudService.toggle(node).then(function(){
          update(node , 750);
        })
      }

      function deleteNode(node){
        nodeCrudService.deleteNode(node, $rootScope.superadmin).then(function(){
          update(node.parent, 750);
        })
      }

      function addNode(node){
        if (d3.event.defaultPrevented) return; // click suppressed
        nodeCrudService.add(node).then(function(){
          update(node, 750)
        })
      }

      function renameNode(node){
        // In case this node belongs to the user or if he is super user
        if(node.user_id == $rootScope.userId || $rootScope.superadmin){
          nodeCrudService.rename(node).then(function(){
            update(node, 750)
          })
        }
      }

    }
  }

}());
