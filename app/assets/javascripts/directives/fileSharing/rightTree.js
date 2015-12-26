(function () {
  angular
    .module('mainApp.directives')
    .directive('rightTree', rightTree);
  rightTree.$inject = ['nodeService', '$window', '$rootScope', 'Restangular', 'Notification', 'ipCookie', 'makeNestedService', 'createIndexChaptersService', 'browserService', 'uploadService', 'cookiesService', '$translate']
  function rightTree(nodeService, $window, $rootScope, Restangular, Notification, ipCookie, makeNestedService, createIndexChaptersService, browserService, uploadService, cookiesService, $translate){

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

      /*----------  Each time the nodeEnd changes we display the docs on the right  ----------*/
      $rootScope.$watch('nodeEnd', function(newVals, oldVals){
        if($rootScope.nodeEnd){
          // gestion of the lock
          if($rootScope.nodeEnd[2] != $rootScope.userId && !$rootScope.superadmin){
            $('#protection-node-container .round-button').attr('disabled', true)
            $('#protection-node-container .round-button').addClass('protection-file-disabled')
          } else{
            $('#protection-node-container .round-button').attr('disabled', false)
            $('#protection-node-container .round-button').removeClass('protection-file-disabled')
          }

          showNodeActions()

          // We look the specific node to see if something changed
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
      });
    }
  }
}());


