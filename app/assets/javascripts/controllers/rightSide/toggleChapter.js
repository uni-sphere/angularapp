(function () {

  angular
    .module('mainApp.controllers')
    .controller('toggleChapterCtrl', toggleChapterCtrl);

  toggleChapterCtrl.$inject = ['$rootScope', '$scope', 'Notification', 'ipCookie']
  function toggleChapterCtrl($rootScope, $scope, Notification, ipCookie){

    /*----------  Functions run on each items to have their initial position (closed / open)  ----------*/
    $scope.collapseItems = function(node) {
      // If we have no cookies we close all
      if($scope.chapterFolded == undefined){
        node.collapse()
      } else{
        // If we have cookies, we close only the nodes that are not in chapter folded and have no items
        if(node.chapterFolded.indexOf(node.$modelValue.id) == -1 && node.$modelValue.items.length != 0){
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

    /*----------  Gestion of chapterFolded cookies  ----------*/
    function chapterFoldedCookiesGestion(nb){
      if($scope.chapterFolded == undefined){
        $scope.chapterFolded = [nb];
      } else if($scope.chapterFolded.indexOf(nb) > -1){
        var index = $scope.chapterFolded.indexOf(nb);
        $scope.chapterFolded.splice(index, 1);
      } else{
        $scope.chapterFolded.push(nb);
      };
      ipCookie('chapterFolded', $scope.chapterFolded);
    }
  }

})();
