(function () {

  angular
    .module('mainApp.controllers')
    .controller('toggleChapterCtrl', toggleChapterCtrl);

  toggleChapterCtrl.$inject = ['$rootScope', '$scope', 'Notification', 'ipCookie']
  function toggleChapterCtrl($rootScope, $scope, Notification, ipCookie){

    /*----------  Functions run on each items to have their initial position (closed / open)  ----------*/
    $scope.collapseItems = function(node) {
      // If we have no cookies we close all
      // console.log($rootScope.foldedChapters)
      // console.log(node.$modelValue.id)
      // console.log($rootScope.foldedChapters)
      if($rootScope.foldedChapters == undefined){
        node.collapse()
      } else{
        // If we have cookies, we close only the nodes that are not in chapter folded and have no items
        if($rootScope.foldedChapters.indexOf(node.$modelValue.id) == -1 && node.$modelValue.items.length != 0){
          // console.log(node)
          node.collapse();
        }
      }
    }

    /*----------  Toggles chapters  ----------*/
    $scope.toggleChapter = function(node){

      // Only applies on chapters
      if(!node.$modelValue.document){

        // We remove colors on files and chapters
        if($rootScope.activeChapter != undefined){
          $rootScope.activeChapter.$modelValue.selectedItem = false;
          $rootScope.activeChapter = undefined;
        }
        if($rootScope.activeFile != undefined){
          $rootScope.activeFile.$modelValue.selectedItem = false
          $rootScope.activeFile = undefined
        }

        // If the chapters is getting opened and has item, we color it
        if(node.collapsed || node.$modelValue.items.length == 0){
          node.$modelValue.selectedItem = true;
          $rootScope.activeChapter = node;
        }

        // We toggle the node & and check if we need to add or remove it from cookies
        if(node.$modelValue.items.length != 0){
          // console.log(node.$modelValue.items.length)
          node.toggle();
          chapterFoldedCookiesGestion(node.$modelValue.id);
        }

        // We hide the dropdown
        $('.dropdown.active').removeClass('active')
      }
    }
    /*=================================
    =            Functions            =
    =================================*/

    /*----------  Gestion of foldedChapters cookies  ----------*/
    function chapterFoldedCookiesGestion(nb){
      if($rootScope.foldedChapters.indexOf(nb) > -1){
        $rootScope.foldedChapters.splice($rootScope.foldedChapters.indexOf(nb), 1);
      } else{
        $rootScope.foldedChapters.push(nb);
      };
      ipCookie('foldedChapters', $rootScope.foldedChapters);
    }
  }

})();