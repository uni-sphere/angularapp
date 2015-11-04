(function () {

  angular
    .module('mainApp.controllers')
    .controller('itemActionsButtonCtrl', itemActionsButtonCtrl);

  itemActionsButtonCtrl.$inject = ['$rootScope', '$scope', 'Restangular', 'Notification', 'ModalService', 'downloadService', 'createIndexChaptersService', 'cookiesService', '$translate']
  function itemActionsButtonCtrl($rootScope, $scope, Restangular, Notification, ModalService, downloadService, createIndexChaptersService, cookiesService, $translate){

    var error,
      success,
      forbidden,
      cancel_warning,
      share,
      rename,
      destroy,
      download;

    $translate(['ERROR', 'SUCCESS', 'CANCEL', 'FORBIDDEN', 'DD_SHARE', 'DD_DESTROY', 'DD_RENAME', 'DD_DOWNLOAD']).then(function (translations) {
      error = translations.ERROR;
      success = translations.SUCCESS;
      forbidden = translations.FORBIDDEN;
      cancel_warning = translations.CANCEL;
      share = translations.DD_SHARE;
      rename = translations.DD_RENAME;
      destroy = translations.DD_DESTROY;
      download = translations.DD_DOWNLOAD;
    });

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
      $rootScope.looseFocusItem()
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
        if($rootScope.userId == node.$modelValue.user_id || $rootScope.nodeEnd[2] == $rootScope.userId || $rootScope.superadmin){
          $scope.dropdownOptions = [{text: rename, value: 'rename'}, {text: share, value: 'share'}, {text: destroy, value: 'delete'}];
        } else{
          $scope.dropdownOptions = [{text: share, value: 'share'}];
        }
      }
      // If we color a file
      else{
        node.$modelValue.selectedItem = true;
        $rootScope.activeFile = node;
        $rootScope.activeChapter = undefined;
        if($rootScope.userId == node.$modelValue.user_id || $rootScope.nodeEnd[2] == $rootScope.userId || $rootScope.superadmin){
          $scope.dropdownOptions = [{text: rename,value: 'rename'}, {text: download, value: 'download'}, {text: share, value: 'share'}, {text: destroy, value: 'delete'} ]
        } else{
          $scope.dropdownOptions = [{text: download,value: 'download'}, {text: share, value: 'share'}];
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
          Notification.success(success)
        }, function(d) {
          if (d.status == 403){
            console.log("Ok: Delete a file forbidden");
            Notification.error(forbidden);
          } else if(d.status == 404) {
            console.log("Ok: Deletion cancelled node doesn't exist anymore")
            Notification.warning(cancel_warning)
            cookiesService.reload()
          } else{
            console.log("Error: Delete file");
            console.log(d);
            Notification.error(error);
          }
        });
      }

      /*----------  Chapter  ----------*/
      else{
        Restangular.all('chapters/' + item.$modelValue.id).remove({node_id: $rootScope.nodeEnd[0]}).then(function(res) {

          // // Remove from cookies the chapter folded deleted
          // if($rootScope.foldedChapters && $rootScope.foldedChapters.indexOf(item.$modelValue.id) > -1){
          //   $rootScope.foldedChapters.splice($rootScope.foldedChapters.indexOf(item.$modelValue.id), 1);
          // }

          // // We remove from cookies all the sub chapters of the chapter we delete
          // angular.forEach(item.$modelValue.items, function(value,key){
          //   if(!value.document && $rootScope.foldedChapters && $rootScope.foldedChapters.indexOf(value.id) > -1){
          //     $rootScope.foldedChapters.splice($rootScope.foldedChapters.indexOf(value.id), 1);
          //   }
          // });

          item.remove();
          console.log("Ok: Chapter deleted");
          Notification.success(success)

          // We index the chapters
          createIndexChaptersService.create($rootScope.listItems)
        }, function(d) {
          if (d.status == 403){
            console.log("Ok: Delete of chapter forbidden, it is not yours");
            Notification.error(forbidden);
          } else if(d.status == 404) {
            console.log("Ok: Deletion cancelled node doesn't exist anymore")
            Notification.warning(cancel_warning)
            cookiesService.reload()
          } else{
            console.log("Error: Delete a chapter");
            console.log(d);
            Notification.error(error);
          }
        });
      }
      $rootScope.looseFocusItem()
    }

    /*----------  Download file  ----------*/
    function downloadFile(file){
      // console.log($scope.nodeProtected)
      // console.log(file.$modelValue.title)
      // console.log(file.$modelValue.doc_id)
      // console.log(file.$modelValue.parent)
      // console.log($rootScope.nodeEnd[0])
      downloadService.download($rootScope.nodeProtected, file.$modelValue.title, file.$modelValue.doc_id, file.$modelValue.parent, $rootScope.nodeEnd[0])
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
            Notification.warning(cancel_warning)
            cookiesService.reload()
          } else{
            console.log(d);
            console.log("Error: download doc")
            Notification.error(error)
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
             Notification.warning(cancel_warning)
            cookiesService.reload()
          } else{
            console.log(d);
            console.log("Error: download doc")
            Notification.error(error)
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
          length: 0,
          file: item.$modelValue.document
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
                Notification.success(success)
                console.log("File renamed");
              }, function(d) {
                if (d.status == 403) {
                  console.log("Ok: Rename document forbidden");
                  console.log(d);
                  Notification.error(forbidden);
                } else if(d.status == 404) {
                  console.log("Ok: Rename file cancelled. Node doesn't exist anymore")
                  Notification.warning(cancel_warning);
                  cookiesService.reload()
                } else{
                  console.log("Error: Rename document");
                  console.log(d);
                  Notification.error(error);
                }
              });
            }
            // Chapters
            else{
              Restangular.one('chapters/' + itemToUpdate.id).put({title: result, node_id: $rootScope.nodeEnd[0]}).then(function(res) {
                itemToUpdate.title = result;
                itemToUpdate.savedTitle = result;
                Notification.success(success)
                console.log("Chapter renamed");
              }, function(d) {
                if (d.status == 403) {
                  console.log("Ok: Rename chapter forbidden");
                  console.log(d);
                  Notification.error(forbidden);
                } else if(d.status == 404) {
                  console.log("Ok: Rename file cancelled. Node doesn't exist anymore")
                  Notification.warning(cancel_warning);
                  cookiesService.reload()
                } else{
                  console.log("Error: Rename chapter");
                  console.log(d);
                  Notification.error(error);
                }
              });
            }
          }
        })
      })
    }
  }
})();
