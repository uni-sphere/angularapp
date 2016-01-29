(function () {

  angular
    .module('mainApp.controllers')
    .controller('itemHandlingCtrl', toggleChapterCtrl);

  toggleChapterCtrl.$inject = ['$q', '$translate', '$rootScope', '$scope', 'Notification', 'ipCookie', 'createIndexChaptersService', 'Restangular', 'cookiesService']
  function toggleChapterCtrl($q, $translate, $rootScope, $scope, Notification, ipCookie, createIndexChaptersService, Restangular, cookiesService){
    var move,
      cancel_warning


    $translate(['MOVE']).then(function (translations) {
      move = translations.MOVE;
    });

    $scope.treeOptions = {

      dragStart: function(event){
        styleDrag()
      },

      beforeDrag: function(sourceNodeScope){
        return true
      },

      accept: function(sourceNodeScope, destIndex, destNodesScope){
        if(destIndex.$parent.$modelValue == undefined || !destIndex.$parent.$modelValue.document){
          return true
        } else{
          return false
        }
      },

      dropped: function(event) {

        removeStyleDrag()
        preliminaryActions()
        createIndexChaptersService.create($rootScope.listItems).then(function() {
          // chapter
          if(!event.source.nodeScope.$modelValue.document){
            handleDropChapter()
          }
          // file
          else{
            handleDropFile()
          }
        }, function(d){
          cookiesService.reload()
          console.log("Error: Item not moved");
          Notification.error(move);
        })

        function preliminaryActions(){
          // We check if a file has been missplaced. In this case we move it up
          if(event.dest.nodesScope.$nodeScope != null){
            var items = event.dest.nodesScope.$nodeScope.$modelValue.items
          } else{
            var items = $rootScope.listItems
          }
          for(i = items.length -1; i>0; i--){
            if(items[i].chapter_id && !items[i-1].chapter_id){
              var element = items[i];
              items.splice(i, 1);
              items.splice(i-1, 0, element);
            }
          }

          // we change the chapter_id of the files
          if(event.source.nodeScope.$modelValue.document){
            if(event.dest.nodesScope.$nodeScope != null){
              parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id
              event.source.nodeScope.$modelValue.chapter_id = parent_id
            } else{
              event.source.nodeScope.$modelValue.chapter_id = event.source.nodeScope.$modelValue.main
            }
          }
          $scope.selectChapter(event.source.nodeScope)
        }

        function handleDropChapter(){
          //order
          var chapterNumberStr = event.source.nodeScope.$modelValue.chapter
          var parts = chapterNumberStr.split('.')
          var chapNumber = parts[parts.length - 2]

          // source
          var source = event.source.nodeScope.$modelValue

          //parent
          if(event.dest.nodesScope.$nodeScope != null){
            parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id
            addToFoldedChapters(parent_id)
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

        function handleDropFile(){
          // order
          var chapNumber = event.source.nodeScope.$modelValue.chapter

          // source
          var source_id = event.source.nodeScope.$modelValue.doc_id

          //parent
          if(event.dest.nodesScope.$nodeScope != null){
            parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id
            addToFoldedChapters(parent_id)
          } else{
            parent_id = 0
          }

          Restangular.one('awsdocuments/' + source_id).put({parent: parent_id, position: chapNumber, node_id: $rootScope.nodeEnd[0]}).then(function(res) {
            console.log("Ok: Item moved");
          }, function(d) {
            cookiesService.reload()
            console.log("Error: Item not moved");
            console.log(d);
            Notification.error(move);
          });
        }

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
          AddOrRemoveFromFoldedChapters(node.$modelValue.id);
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
        // if(node.collapsed || node.$modelValue.items.length == 0){
          node.$modelValue.selectedItem = true;
          $rootScope.activeChapter = node;
        // }

        // We hide the dropdown
        $('.dropdown.active').removeClass('active')
      }

    }


    /*=================================
    =            Functions            =
    =================================*/

    /*----------  Gestion of foldedChapters cookies  ----------*/
    function AddOrRemoveFromFoldedChapters(nb){
      // console.log($rootScope.foldedChapters)
      if($rootScope.foldedChapters.indexOf(nb) > -1){
        // console.log("found")
        $rootScope.foldedChapters.splice($rootScope.foldedChapters.indexOf(nb), 1);
      } else{
        // console.log("not found")
        $rootScope.foldedChapters.push(nb);
      };
      ipCookie('foldedChapters', $rootScope.foldedChapters);
      // console.log($rootScope.foldedChapters)
    }

    function addToFoldedChapters(nb){
      if($rootScope.foldedChapters.indexOf(nb) == -1){
        $rootScope.foldedChapters.push(nb);
      };
      ipCookie('foldedChapters', $rootScope.foldedChapters);
    }

    function styleDrag(){
      $('#white-background').css("display", "block")
      $('right-tree').css("z-index", "999")
      $('right-tree').css("cursor", "no-drop")
      $('#ui-tree-content').css("cursor", "move")
      $('.angular-ui-tree-handle').css("cursor", "move")
      $('.dual-submit').css("cursor", "no-drop")
      $('.round-button').addClass("no-drop")
    }

    function removeStyleDrag(){
      $('#white-background').css("display", "none")
      $('right-tree').css("z-index", "10")
      $('right-tree').css("cursor", "default")
      $('#ui-tree-content').css("cursor", "default")
      $('.angular-ui-tree-handle').css("cursor", "pointer")
      $('.dual-submit').css("cursor", "pointer")
      $('.round-button').removeClass("no-drop")
    }
  }

})();
