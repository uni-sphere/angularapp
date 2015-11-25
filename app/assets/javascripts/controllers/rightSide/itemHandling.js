(function () {

  angular
    .module('mainApp.controllers')
    .controller('itemHandlingCtrl', toggleChapterCtrl);

  toggleChapterCtrl.$inject = ['$translate', '$rootScope', '$scope', 'Notification', 'ipCookie', 'createIndexChaptersService', 'Restangular', 'cookiesService']
  function toggleChapterCtrl($translate, $rootScope, $scope, Notification, ipCookie, createIndexChaptersService, Restangular, cookiesService){
    var move,
      cancel_warning


    $translate(['MOVE']).then(function (translations) {
      move = translations.MOVE;
    });

    $scope.treeOptions = {
      beforeDrop: function(event) {

        // We change the depth of the node
        if(event.dest.nodesScope.$nodeScope != null){
          event.source.nodeScope.$modelValue.depth = event.dest.nodesScope.$nodeScope.$modelValue.depth + 1
        } else{
          event.source.nodeScope.$modelValue.depth = 0
        }

        // we change the index
        createIndexChaptersService.create($rootScope.listItems)

        // chapter
        if(!event.source.nodeScope.$modelValue.document){
          var chapterNumberStr = event.source.nodeScope.$modelValue.chapter
          var chapNumber = chapterNumberStr.substr(0,chapterNumberStr.indexOf('.'))
          // console.log(chapNumber)
          // console.log(event.source.nodeScope.$modelValue.position)

          var source = event.source.nodeScope.$modelValue

          // console.log(event.dest.nodesScope)
          //parent
          if(event.dest.nodesScope.$nodeScope != null){
            parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id
            chapterFoldedCookiesGestion(parent_id)
          } else{
            parent_id = 0
          }

          Restangular.one('chapters/' + source.id).put({parent: parent_id, position: chapNumber, node_id: $rootScope.nodeEnd[0]}).then(function(res) {
            source.position = chapNumber
            console.log("Ok: Item moved");
          }, function(d) {
            cookiesService.reload()
            console.log("Error: Item not moved");
            console.log(d);
            Notification.error(move);
          });
        }
        // file
        else{
          // order
          var chapNumber = event.source.nodeScope.$modelValue.chapter

          var source_id = event.source.nodeScope.$modelValue.doc_id

          //parent
          if(event.dest.nodesScope.$nodeScope != null){
            parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id
            chapterFoldedCookiesGestion(parent_id)
          } else{
            parent_id = 0
          }

          Restangular.one('awsdocuments/' + source_id).put({parent: parent_id, position: chapNumber, node_id: $rootScope.nodeEnd[0]}).then(function(res) {
            console.log("Ok: Item moved");
          }, function(d) {
            console.log("Error: Item not moved");
            console.log(d);
            Notification.error(move);
          });
        }

      },

      dropped: function(event) {



        $scope.selectChapter(event.source.nodeScope)

        // console.log(event.dest.nodesScope.$nodeScope)

      }
    };


    /*----------  Functions run on each items to have their initial position (closed / open)  ----------*/
    $scope.collapseItems = function(node) {
      // If we have no cookies we close all
      if($rootScope.foldedChapters == undefined){
        node.collapse()
      } else{
        // If we have cookies, we close only the nodes that are not in chapter folded and have no items
        if($rootScope.foldedChapters.indexOf(node.$modelValue.id) == -1 && node.$modelValue.items.length != 0){
          node.collapse();
        }
      }
    }

    /*----------  Toggles chapters  ----------*/
    $scope.toggleChapter = function(node){

      // Only applies on chapters
      if(!node.$modelValue.document){

        $scope.selectChapter(node)

        // We toggle the node & and check if we need to add or remove it from cookies
        if(node.$modelValue.items.length != 0){
          // console.log(node.$modelValue.items.length)
          node.toggle();
          chapterFoldedCookiesGestion(node.$modelValue.id);
        }

      }
    }

    $scope.selectChapter = function(node){
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
