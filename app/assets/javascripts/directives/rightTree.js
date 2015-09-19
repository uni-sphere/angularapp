(function () {

  angular
    .module('mainApp.directives')
    .directive('rightTree', rightTree);

  rightTree.$inject = ['Restangular', 'Notification', 'ipCookie', 'makeNested']
  function rightTree(Restangular, Notification, ipCookie, makeNested){
    var directive = {
      link: link,
      templateUrl: 'webapp/right-tree.html',
      scope:{
        nodeEnd: '=',
        files: '=',
        admin: '=',
        chapterFolded: '=',
        breadcrumb: '=',
        reloadNodes: '=',
        userId: '=',
        superadmin: '=',
        home: '=',
        sandbox: '=',
        looseFocusItem: '=',
        activeChapter: '='
      }
    };
    return directive;

    function link(scope){

      /*----------  We get the chapter folded in cookie  ----------*/
      scope.chapterFolded = ipCookie('chapterFolded');

      /*----------  Each time the nodeEnd changes we display the docs on the right  ----------*/
      scope.$watch('nodeEnd', function(newVals, oldVals){
        if(scope.nodeEnd){

          // gestion of the lock
          if(scope.nodeEnd[2] != scope.userId && !scope.superadmin){
            $('#protection-node-container .round-button').attr('disabled', true)
            $('#protection-node-container .round-button').addClass('protection-file-disabled')
          } else{
            $('#protection-node-container .round-button').attr('disabled', false)
            $('#protection-node-container .round-button').removeClass('protection-file-disabled')
          }

          Restangular.one('chapters').get({node_id: scope.nodeEnd[0]}).then(function (res) {

            // Gestion of the options to display in node options ( we have to wait until we know if the node is locked)
            scope.nodeProtected = res.locked;
            if(scope.nodeEnd[2] == scope.userId || scope.superadmin && scope.nodeProtected){
              scope.nodeDropdownOptions = [{text: 'Share',value: 'share'}, {text: 'Change password',value: 'change'}];
            } else{
              scope.nodeDropdownOptions = [{text: 'Share',value: 'share'}];
            }

            // Removes the main chapter & saves the items
            res.tree.shift()
            scope.listItems = makeNested(res.tree);

            // We check if there are any documents ( = toggle the view for no documents)
            if(scope.listItems.length == 0){
              scope.documentAbsent = true;
            } else{
              scope.documentAbsent = false;
            }

            // In case we are on home or sandbox we unfold the the second chapter of the first leaf
            if((scope.home && !ipCookie('chapterFolded')) || (scope.sandbox && !ipCookie('chapterFolded'))){
              addTochapterFolded(scope.listItems[2].id)
            }

          }, function(d){
            if(d.status == 404) {
              console.log("Ok: Node opening cancelled. Node doesn't exist anymore")
              Notification.warning('This action has been cancelled. One of your colleague deleted this node')
            } else{
              console.log("Error: Get document");
              console.log(d)
              Notification.error("Error while retrieving your documents. Please refresh.")
            }
            scope.reloadNodes()
          });
        }
      });
    }
  }
}());


