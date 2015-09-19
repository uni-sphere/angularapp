// storage.js
(function() {
  angular
    .module('mainApp.services')
    .service('leftSvgTreeService', leftSvgTreeService);

  leftSvgTreeService.$inject = ['nodeService', 'ModalService']
  function leftSvgTreeService(nodeService, ModalService) {

    var width;
    var height;
    var root;
    var tree;
    var diagonal;
    var svg;
    var margin = {top: 20, right: 20, bottom: 10, left: 30};
    var duration = 750;
    var superAdmin;
    var admin;
    var userId;

    var service = {
      update: update,
      render: render
    };

    return service;

    ////////////

    function render(branch, iElement, foldedNodes, activeNodes, scopeAdmin, scopeUserId, scopeSuperAdmin) {
      admin = scopeAdmin
      superAdmin = scopeSuperAdmin
      userId = scopeUserId

      svg = d3.select(iElement[0])
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.selectAll("*").remove();

      // scope.i = 0;

      width = d3.select(iElement[0])[0][0].offsetWidth - margin.right - margin.left;
      height = d3.select(iElement[0])[0][0].offsetHeight - margin.top - margin.bottom;

      root = branch
      root.x0 = height / 2;
      root.y0 = 0;

      tree = d3.layout.tree()
        .separation(function(a,b){
          if(a.parent != b.parent || b.children ){
            return 2
          } else{
            return 1
          }
        })
        .size([height,width])

      diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

      if(foldedNodes == undefined){
        // root.children.forEach(collapseAll);
      } else{
        // root.children.forEach(collapseSelectively);
      }

      if(activeNodes != undefined){
        // root.children.forEach(colorActiveNodes)
        // changeBreadcrumb()
      }

      update(root);
    }

    /*==============================
    =            update            =
    ==============================*/

    function update(source) {

      maxWidth = width - 200

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse();
      var links = tree.links(nodes);

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


      if(admin){
        // Label of the node. When clicked it opens the rename
        nodeEnter.append("text")
          .attr("class", function(d){
            if(typeof d.parent != 'object'){
              return ""
            } else if(d.user_id == userId || superAdmin){
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
          // .on("click", deleteNode)
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

      nodeUpdate.select("text.deleteNode").style("fill-opacity", function(d){
        if(userId == d.user_id || superAdmin){
          return 1;
        } else{
          return 1e-6;
        }
      })

      nodeUpdate.select("text.addNode").style("fill-opacity",  function(d){
        if(d._children){
          return 1e-6
        } else if(!d.children && userId != d.user_id && !d.superadmin && !superAdmin){
          return 1e-6
        } else{
          return 1
        }
      })

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
          return diagonal({source: o, target: o});
        });

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", diagonal)
        .attr("class", function(d) { return d.target.active ? "link link-active" : "link"; })

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

    /*=======================================
    =            Other functions            =
    =======================================*/

    function openNode(node){
      nodeService.openNode(node)
      update(node)
    }

    function addNode(node){
      nodeService.addNode(node)
      update(node)
    }

    function renameNode(node){
      if(node.user_id == userId || superAdmin){
        ModalService.showModal({
          templateUrl: "webapp/rename-item.html",
          controller: "RenameModalCtrl",
          inputs:{
            name: node.name,
            length: 20
          }
        }).then(function(modal) {
          modal.close.then(function(modalResult) {
            if(modalResult){
              nodeService.setNodeName(node, modalResult)
              update(node)
            }
          });
        });
      }
    }


  }
})();
