(function () {
  angular
    .module('mainApp.directives')
    .directive('rightTree', rightTree);
  rightTree.$inject = ['assignmentService', '$location', 'nodeService', '$window', '$rootScope', 'Restangular', 'Notification', 'ipCookie', 'makeNestedService', 'createIndexChaptersService', 'browserService', 'uploadService', 'cookiesService', '$translate']
  function rightTree(assignmentService, $location, nodeService, $window, $rootScope, Restangular, Notification, ipCookie, makeNestedService, createIndexChaptersService, browserService, uploadService, cookiesService, $translate){

    var directive = {
      link: link,
      templateUrl: 'webapp/right-tree.html',
      scope:{
        files: '=',
        activeChapter: '=',
      }
    };
    return directive;

    function link(scope, elem, attrs){

      var error,
        cancel_warning,
        share,
        assignment,
        edit;

      $translate(['ERROR', 'NW_CANCEL', 'DD_SHARE', 'DD_PSW', 'CREATE_ASSIGNMENT']).then(function (translations) {
        error = translations.ERROR;
        cancel_warning = translations.NW_CANCEL;
        share = translations.DD_SHARE;
        edit = translations.DD_PSW;
        createAssignment = translations.CREATE_ASSIGNMENT;
      });

      scope.$watch('firstFiles', function (newVals, oldVals) {
        if(newVals && newVals.length != 0){
          console.log("Ok: file choosen")
          uploadService.upload(scope.firstFiles, scope.activeChapter, $rootScope.nodeEnd[0], $rootScope.listItems);
        }
      });

      scope.selectAssignment = function(assignment){
        $location.path('/exam')
        assignmentService.getIndex({assignment_id: assignment.id, student: true})
      }

      /*----------  We display different tip in case we are on chrome or another browser  ----------*/
      if(browserService.analyse() == "chrome"){
        $rootScope.isChrome = true;
      }

      function showNodeActions(){
        if(($rootScope.nodeEnd[2] == $rootScope.userId || $rootScope.superadmin) && $rootScope.nodeProtected){
          scope.nodeDropdownOptions = [{text: share, value: 'share'}, {text: createAssignment, value: 'assignment'}, {text: edit, value: 'change'}];
        } else{
          scope.nodeDropdownOptions = [{text: share, value: 'share'}, {text: createAssignment, value: 'assignment'}];
        }
      }

      var watchNodeEnd = $rootScope.$watch('nodeEnd', function(newVals, oldVals){
        if((newVals != undefined && oldVals == undefined) || (newVals != undefined && oldVals == newVals )){
          console.log("NODE END " + newVals[0])
          $rootScope.reloadRightTree()
          watchNodeEnd()
        }
      })

      $rootScope.reloadRightTree = function(){
        console.log("reload right tree")
        colorLock()
        displayAssignments()
        showNodeActions()
        getChapters()
      }

      function colorLock(){
         if($rootScope.nodeEnd[2] != $rootScope.userId && !$rootScope.superadmin){
          $('#protection-node-container .round-button').attr('disabled', true)
          $('#protection-node-container .round-button').addClass('protection-file-disabled')
        } else{
          $('#protection-node-container .round-button').attr('disabled', false)
          $('#protection-node-container .round-button').removeClass('protection-file-disabled')
        }
      }

      function displayAssignments(){
        Restangular.one('index_node').get({node_id: $rootScope.nodeEnd[0]}).then(function (res) {
          // console.log(res.assignment_array)
          $rootScope.nodesAssignment = res.assignment_array
          console.log("Ok: get nodes assignments")
        }, function(d){
          console.log("Error: Get nodes assignment")
          console.log(d)
          Notification.error($rootScope.errorMessage);
        })
      }
     
      function getChapters(){
        Restangular.one('chapters').get({node_id: $rootScope.nodeEnd[0]}).then(function (res) {

          if(res.locked != $rootScope.nodeProtected){
            $rootScope.nodeProtected = res.locked;
            showNodeActions()
          }

          // Saves the items
          if(res.tree.length > 0){
            // We save it in the $rootScope to see the modif  and in the actual object
            // so it doesn't need to be changed again
            node = nodeService.findNode($rootScope.nodeEnd[0])
            $rootScope.listItems = makeNestedService.item(res.tree);
            node.items = $rootScope.listItems
          } else{
            $rootScope.listItems = []
          }

          // We index the chapters
          createIndexChaptersService.create($rootScope.listItems)

        }, function(d){
          if(d.status == 404) {
            cookiesService.reload()
            console.log("Ok: Node opening cancelled. Node doesn't exist anymore")
            Notification.warning(cancel_warning)
          } else{
            console.log("Error: Get document");
            console.log(d)
            Notification.error(error)
          }
        });
      }
      
      // We watch every click to un focus some elements
      $rootScope.looseFocusItem = function(){
        if($rootScope.tutorialDashboardOpen){
          $rootScope.tutorialDashboardSeen = true
          setHelp();
        }
        if($rootScope.tutorialPadlockOpen){
          $rootScope.tutorialPadlockSeen = true
          setHelp();
        }
        if($rootScope.tutorialActionButtonOpen){
          $rootScope.tutorialActionButtonSeen = true
          setHelp();
        }
        if($rootScope.tutorialLeftTreeOpen){
          $rootScope.tutorialLeftTreeSeen = true
          setHelp();
        }
        if($rootScope.tutorialRightTreeOpen){
          $rootScope.tutorialRightTreeSeen = true
          setHelp();
        }
        if($rootScope.activeChapter != undefined){
          $rootScope.activeChapter.$modelValue.selectedItem = false;
          $rootScope.activeChapter = undefined
        }
        if($rootScope.activeFile != undefined){
          $rootScope.activeFile.$modelValue.selectedItem = false;
          $rootScope.activeFile = undefined
        }
        $('.dropdown.active').removeClass('active')
      }
      
    }
  }
}());


