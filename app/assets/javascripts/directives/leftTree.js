(function () {

  angular
    .module('mainApp.directives')
    .directive('leftTree', leftTree)

  leftTree.$inject = ['$rootScope', 'ipCookie', '$timeout', 'Restangular', 'Notification', 'ModalService', 'cookiesService', 'nodeService', 'nodeCrudService'];
  function leftTree($rootScope, ipCookie, $timeout, Restangular, Notification, ModalService, cookiesService, nodeService, nodeCrudService){
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
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
          })

        // In all case we happened a circle that toogles the nodes
        nodeEnter.append("circle")
          .attr("class", "circleCollapse")
          .attr("r", 1e-6)
          .style("stroke", "cornflowerblue")
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff" })
          .on("click", toggleNode)


        // We have a different display when the user is an admin or not
        if($rootScope.admin){
          // Label of the node. Rename of the node or simple display
          // In case the nodes belongs to the user he can rename it.
          // In case it doesn't it is just a display
          nodeEnter.append("text")
            .attr("class", function(d){
              if(typeof d.parent != 'object'){
                return ""
              } else if(d.user_id == $rootScope.userId || $rootScope.superadmin){
                return "renameNode"
              } else{
                return "justDisplayNode"
              }
            })
            // .attr("x", function(d) {
            //   if(d.children){
            //     console.log(-Math.floor(this.getBBox().width/2))
            //     return 100
            //   } else{
            //     return 15
            //   }
            // })
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
            .on("click", toggleNode)
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
          .attr("x", function(d) {
            if(d.children){
              // return -Math.floor(this.getBBox().width/2)
              try{
                this.getBBox()
                return -Math.floor(this.getBBox().width/2)
              } catch(err){
                return 40
              }
            } else{
              return 15
            }
          })
          .attr("y", function(d) { return d.children ? 25 : 5; })
          .attr("text-anchor", "start")
          .text(function(d) { return d.name; });

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
