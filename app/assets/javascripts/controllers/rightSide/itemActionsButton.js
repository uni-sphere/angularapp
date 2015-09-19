(function () {

  angular
    .module('mainApp.controllers')
    .controller('itemActionsButtonCtrl', itemActionsButtonCtrl);

  itemActionsButtonCtrl.$inject = ['$rootScope', '$scope', 'Restangular', 'Notification', 'ModalService', 'downloadService']
  function itemActionsButtonCtrl($rootScope, $scope, Restangular, Notification, ModalService, downloadService){
    $scope.dropdownSelected = {};

    /*----------  Triggers an action after the user choose it in the dropdown  ----------*/
    $scope.actionItem = function(item){
      if($scope.dropdownSelected.value == 'delete'){
        removeItem(item)
      } else if($scope.dropdownSelected.value == 'share'){
        shareItem(item)
      } else if($scope.dropdownSelected.value == 'rename'){
        renameItem(item)
      } else if($scope.dropdownSelected.value == 'download'){
        downloadFile(item)
      }
      $scope.looseFocusItem()
    }

    /*----------  Color and selects an item after we click on the options button  ----------*/
    $scope.selectItem = function(node){

      // We remove colors on files and chapters
      if($rootScope.activeChapter != undefined){
        $rootScope.activeChapter.$modelValue.selectedItem = false;
      }
      if($rootScope.activeFile != undefined){
        $rootScope.activeFile.$modelValue.selectedItem = false
      }

      // If we color a chapter
      if(!node.$modelValue.document){
        node.$modelValue.selectedItem = true;
        $rootScope.activeFile = undefined;
        $rootScope.activeChapter = node;
        if($scope.userId == node.$modelValue.user_id || $scope.nodeEnd[2] == $scope.userId || $scope.superadmin){
          $scope.dropdownOptions = [{text: 'Rename',value: 'rename'}, {text: 'Share',value: 'share'}, {text: 'Delete',value: 'delete'}];
        } else{
          $scope.dropdownOptions = [{text: 'Share',value: 'share'}];
        }
      }
      // If we color a file
      else{
        node.$modelValue.selectedItem = true;
        $rootScope.activeFile = node;
        $rootScope.activeChapter = undefined;
        if($scope.userId == node.$modelValue.user_id || $scope.nodeEnd[2] == $scope.userId || $scope.superadmin){
          $scope.dropdownOptions = [{text: 'Rename',value: 'rename'}, {text: 'Download',value: 'download'}, {text: 'Share',value: 'share'}, {text: 'Delete',value: 'delete'} ]
        } else{
          $scope.dropdownOptions = [{text: 'Download',value: 'download'}, {text: 'Share',value: 'share'}];
        }
      }
    }

    /*=================================
    =            Functions            =
    =================================*/

    function removeItem(item){
      var parent = item.$parentNodeScope;

      /*----------  Document  ----------*/
      if(item.$modelValue.document){
        Restangular.all('awsdocuments/' + item.$modelValue.doc_id).remove().then(function() {
          item.remove();
          console.log("Ok: Document deleted");
          Notification.warning( item.$modelValue.title + " removed.")
          if($scope.listItems.length == 0){
            $scope.documentAbsent = true;
          }
        }, function(d) {
          if (d.status == 403){
            console.log("Ok: Delete a file forbidden");
             Notification.error("Error while deleting the file " + item.$modelValue.title + ", please refresh.");
          } else if(d.status == 404) {
            console.log("Ok: Deletion cancelled node doesn't exist anymore")
            Notification.warning('This action has been cancelled. One of your colleague deleted this node')
            $scope.reloadNodes()
          } else{
            console.log("Error: Delete file");
            console.log(d);
            Notification.error("Error while deleting the file " + item.$modelValue.title + ", please refresh.");
          }
        });
      }

      /*----------  Chapter  ----------*/
      else{
        Restangular.all('chapters/' + item.$modelValue.id).remove({node_id: $scope.nodeEnd[0]}).then(function() {

          // Remove from cookies the chapter folded deleted
          if($scope.chapterFolded && $scope.chapterFolded.indexOf(item.$modelValue.id) > -1){
            $scope.chapterFolded.splice($scope.chapterFolded.indexOf(item.$modelValue.id), 1);
          }

          // We remove from cookies all the sub chapters of the chapter we delete
          angular.forEach(item.$modelValue.items, function(value,key){
            if(!value.document && $scope.chapterFolded && $scope.chapterFolded.indexOf(value.id) > -1){
              $scope.chapterFolded.splice($scope.chapterFolded.indexOf(value.id), 1);
            }
          });

          item.remove();
          console.log("Ok: Chapter deleted");
          Notification.warning(item.$modelValue.title + " removed")

          // In case the is item left. Show the view no document
          if($scope.listItems.length == 0){
            $scope.documentAbsent = true;
          }
        }, function(d) {
          if (d.status == 403){
            console.log("Ok: Delete of chapter forbidden, it is not yours");
            Notification.error("Error while deleting " + item.$modelValue.title +", please refresh.");
          } else if(d.status == 404) {
            console.log("Ok: Deletion cancelled node doesn't exist anymore")
            Notification.warning('This action has been cancelled. One of your colleague deleted this node.')
            $scope.reloadNodes()
          } else{
            console.log("Error: Delete a chapter");
            console.log(d);
            Notification.error("Error while deleting " + item.$modelValue.title +", please refresh.");
          }
        });
      }
      $scope.looseFocusItem()
    }

    /*----------  Download file  ----------*/
    function downloadFile(file){
      downloadService.download($scope.nodeProtected, file.$modelValue.title, file.$modelValue.doc_id, file.$modelValue.parent, $scope.nodeEnd[0])
    }

    /*----------  Share item  ----------*/
    function shareItem(item){
      /*----------  File  ----------*/
      if(item.$modelValue.document){
        Restangular.one('awsdocument/restrain_link').get({id: item.$modelValue.doc_id}).then(function(res){
          var itemLink = res.link

          ModalService.showModal({
            templateUrl: "webapp/share-item-modal.html",
            controller: "ShareItemCtrl",
            inputs:{
              itemLink: itemLink,
              itemTitle: item.$modelValue.title
            }
          }).then(function(modal) {
            modal.close.then(function(result) {
            })
          })
        },function(d){
          if(d.status == 404){
            console.log("Ok: file archived | cannot get share link")
            Notification.warning("You can't share " + item.$modelValue.title + ", it has been deleted by one of your colleagues.")
            $scope.reloadNodes()
          } else{
            console.log(d);
            console.log("Error: download doc")
            Notification.error("Error while sharing " + item.$modelValue.title + ", please refresh.")
          }
        });
      }
      /*----------  Chapter  ----------*/
      else if(!item.$modelValue.document) {
        Restangular.one('chapter/restrain_link').get({id: item.$modelValue.id, node_id: item.$modelValue.node_id}).then(function(res){
          ModalService.showModal({
            templateUrl: "webapp/share-item-modal.html",
            controller: "ShareItemCtrl",
            inputs:{
              itemLink: res.link,
              itemTitle: item.$modelValue.title
            }
          }).then(function(modal) {
            modal.close.then(function(result) {
            })
          })

        },function(d){
          if(d.status == 404){
            console.log(d)
            console.log("Ok: chapter archived | cannot get share link")
             Notification.warning("You can't share " + item.$modelValue.title + ", it has been deleted by one of your colleagues.")
            $scope.reloadNodes()
          } else{
            console.log(d);
            console.log("Error: download doc")
            Notification.error("Error while sharing " + item.$modelValue.title + ", please refresh.")
          }
        });
      }
    }

    /*----------  Rename Item  ----------*/
    function renameItem(item){
      ModalService.showModal({
        templateUrl: "webapp/rename-item.html",
        controller: "RenameModalCtrl",
        inputs:{
          name: item.$modelValue.title,
          length: 0
        }
      }).then(function(modal) {
        modal.close.then(function(result) {
          itemToUpdate = item.$modelValue
          if(result && result != itemToUpdate.savedTitle){

            // files
            if(itemToUpdate.document){
              Restangular.one('awsdocuments/' + itemToUpdate.doc_id).put({title: result}).then(function(res) {
                itemToUpdate.title = result;
                itemToUpdate.savedTitle = result;
                Notification.success("File renamed")
                console.log("File renamed");
              }, function(d) {
                if (d.status == 403) {
                  console.log("Ok: Rename document forbidden");
                  console.log(d);
                  Notification.error("Error while renaming " + item.$modelValue.title + ", pleae refresh.");
                } else if(d.status == 404) {
                  console.log("Ok: Rename file cancelled. Node doesn't exist anymore")
                  Notification.warning("File rename cancelled, this file has been deleted by one of your colleagues.");
                  $scope.reloadNodes()
                } else{
                  console.log("Error: Rename document");
                  console.log(d);
                  Notification.error("Error while renaming " + item.$modelValue.title + ", pleae refresh.");
                }
              });
            }
            // Chapters
            else{
              Restangular.one('chapters/' + itemToUpdate.id).put({title: result, node_id: $scope.nodeEnd[0]}).then(function(res) {
                itemToUpdate.title = result;
                itemToUpdate.savedTitle = result;
                Notification.success("Chapter renamed")
                console.log("Chapter renamed");
              }, function(d) {
                if (d.status == 403) {
                  console.log("Ok: Rename chapter forbidden");
                  console.log(d);
                  Notification.error("Error while renaming " + item.$modelValue.title + ", pleae refresh.");
                } else if(d.status == 404) {
                  console.log("Ok: Rename file cancelled. Node doesn't exist anymore")
                  Notification.warning("File rename cancelled, this file has been deleted by one of your colleagues.");
                  $scope.reloadNodes()
                } else{
                  console.log("Error: Rename chapter");
                  console.log(d);
                  Notification.error("Error while renaming " + item.$modelValue.title + ", pleae refresh.");
                }
              });
            }
          }
        })
      })
    }
  }
})();
