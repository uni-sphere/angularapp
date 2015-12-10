(function () {
  angular
    .module('mainApp.services')
    .service('uploadService', uploadService);
  uploadService.$inject = ['$rootScope', 'Restangular', 'Notification', 'ipCookie', 'spinnerService', 'Upload', 'createIndexChaptersService', 'cookiesService', '$translate', '$q'];
  function uploadService($rootScope, Restangular, Notification, ipCookie, spinnerService, Upload, createIndexChaptersService, cookiesService, $translate, $q){
    var service = {
      upload: upload
    }
    return service;
    var dragndrop,
      nodeId,
      listItems,
      chapterUploadedArray,
      foldersArray,
      filesArray,
      chapUploaded,
      stopWatchingFolders,
      numberOfRequest,
      file_success,
      file_error,
      file_warning,
      chapter_success,
      chapter_error,
      chapter_warning,
      error,
      success,
      cancel_warning,
      forbidden;

      $translate(['ERROR', 'SUCCESS', 'NW_CANCEL', 'FORBIDDEN']).then(function (translations) {
        error = translations.ERROR;
        success = translations.SUCCESS;
        cancel_warning = translations.NW_CANCEL;
        forbidden = translations.FORBIDDEN;
      });

    function upload(files, position_chapter, node_id, list_items){
      return $q(function(resolve, reject){
        
        nodeId = node_id;
        listItems = list_items;
        foldersArray = [];
        filesArray = [];
        chapterUploadedArray = [];
        numberOfRequest = files.length;

        // Begin the spinner
        spinnerService.begin()

        // If give the position of the parent.
        if(position_chapter == undefined){
          parentChapter = {id: 0}
        } else{
          parentChapter = position_chapter.$modelValue
        }

        // If we have folder to upload
        angular.forEach(files, function(value, key) {
          if(value.type == 'directory'){
            foldersArray.push(value)
          } else if (value.name.charAt(0) != '.') {
            filesArray.push(value)
          }
        });

        // There are folder to upload
        if(foldersArray.length != 0){
          uploadAllFolder(parentChapter).then(function(){
            // We go through all the chapter we uploaded.
            // We look if the path of our files are the same than the chapters
            // If we found some we save them in filesToUpload to send them all at onces

            for(i=0; i< chapterUploadedArray.length; i++){
              var filesToUpload = []
              for(j=0; j<filesArray.length; j++){
                if(filesArray[j].path.substring(0, filesArray[j].path.lastIndexOf('/')) == chapterUploadedArray[i].path){
                  filesToUpload.push(filesArray[j])
                }
              }
              if(filesToUpload.length !=0 ){
                uploadFiles(filesToUpload, chapterUploadedArray[i]).then(function(){
                  resolve()
                })
              }
            }
          })
        }
        // There is only files to upload
        else{
          uploadFiles(files, parentChapter).then(function(){
            resolve()
          })
        }
      })

    }

    function uploadAllFolder(positionChapter){
      return $q(function(resolve, reject){
        uploadFolder(foldersArray[0], positionChapter).then(function(chapterUploaded){
          // We watch each time a folder has been uploaded.
          // If the upload of this folder allows to upload another one than we do it.

          plop(chapterUploaded)

          function plop(chapterUploaded){
            var copyFoldersArray = (JSON.parse(JSON.stringify(foldersArray)));
            lookForFolderToUpload(chapterUploaded)

            function lookForFolderToUpload(chapterUploaded){
              var folder = copyFoldersArray.pop()
              if(folder && folder.path.substring(0, folder.path.lastIndexOf('/')) == chapterUploaded.path){
                uploadFolder(folder, chapterUploaded).then(function(chapterJustUploaded){
                  if(foldersArray.length == 0){
                    createIndexChaptersService.create(listItems)
                    resolve();
                  }
                  plop(chapterJustUploaded)
                  if(copyFoldersArray.length != 0){
                    lookForFolderToUpload(chapterUploaded)
                  }
                })
              } else{
                if(copyFoldersArray.length != 0){
                  lookForFolderToUpload(chapterUploaded)
                }
              }
            }
          }
        })
      })
    }

    function uploadOneFile(file, parentChapter){
      return $q(function(resolve, reject){
        Upload.upload({
          url: getEnvironment() + '/awsdocuments',
          file: file,
          fields: {
            title: file.name,
            node_id: nodeId,
            chapter_id: parentChapter.id,
            content: file
          }
        }).then(function(fileUploaded) {
          if(parentChapter.id == 0){
            var fileDepth = 1
          } else{
            var fileDepth = parentChapter.depth + 1
          }
          var fileToAdd = {chapter: fileDepth, parent: fileUploaded.chapter_id, title: fileUploaded.data.title, doc_id: fileUploaded.data.id, document: true, user_id: fileUploaded.data.user_id, extension: fileUploaded.data.title.split('.').pop()}
          resolve();
          // Notification
          console.log("OK document uploaded: " + fileUploaded.data.title);
          // We add the file to listItem
          if(parentChapter.id == 0){
            listItems.unshift(fileToAdd);
          } else{
            parentChapter.items.unshift(fileToAdd);
          }
          // If the parent chapter was not already folded we fold it.
          if(parentChapter.id !=0 && $rootScope.foldedChapters.indexOf(parentChapter.id) == -1){
            $rootScope.foldedChapters.push(parentChapter.id);
            ipCookie('foldedChapters', $rootScope.foldedChapters);
          }
        }, function(d) {
          reject()
          spinnerService.stop()
          if (d.status == 403) {
            console.log("Ok: Upload documents forbidden");
            Notification.error(forbidden)
          } else if(d.status == 404) {
            console.log(d)
            console.log("Ok: File upload cancelled. Node doesn't exist anymore")
            Notification.warning(cancel_warning)
            cookiesService.reload()
          } else{
            console.log(d)
            Notification.error(error)
            console.log("Error: Upload document failed :" +  file.name + ". Please refresh.");
          }
        });
      })
    }


    function uploadFiles(files, parentChapter){
      return $q(function(resolve, reject){
        function IterateUploadFiles(){
          file = files.pop()
          uploadOneFile(file,parentChapter).then(function(){
            numberOfRequest -= 1;
            if(numberOfRequest == 0){
              resolve()
              spinnerService.stop();
            }
            if(files.length > 0){
              IterateUploadFiles()
            }
          });
        }

        IterateUploadFiles()
      })
    }

    function uploadFolder(folder, parentChapter){
      // console.log(parentChapter)
      return $q(function(resolve, reject){
        var chapterToCreate ={title: folder.name, node_id: nodeId, parent_id: parentChapter.id}
        Restangular.all('chapters').post(chapterToCreate).then(function(chapter) {
          numberOfRequest -= 1;
          if(numberOfRequest == 0){
            spinnerService.stop();
          }

          // We find the depth of the chapter
          if(parentChapter.id == 0){
            var depth = 0
          } else{
            var depth = parentChapter.depth + 1;
          }
          // We add the chapter to listItem
          chapterToAdd = {path: folder.path, title: folder.name, id: chapter.id, items: [], depth: depth, user_id: chapter.user_id}
          chapterUploadedArray.push(chapterToAdd)
          // We remove the current folder froms the folders and save it chapterUploaded
          removeFolderFromFolders(folder).then(function(){
            resolve(chapterToAdd);
          })
          // chapterUploaded = chapterToAdd;
          if(parentChapter.id == 0){
            listItems.push(chapterToAdd);
          } else{
            parentChapter.items.push(chapterToAdd);
          }
          // Notifications
          // Notification.success(success)
          console.log("OK chapter created: " + folder.name);
          // If we had a chapter in a chapter. We fold the parent
          if(parentChapter.id !=0 && $rootScope.foldedChapters.indexOf(parentChapter.id) == -1){
            $rootScope.foldedChapters.push(parentChapter.id);
            ipCookie('foldedChapters', $rootScope.foldedChapters);
          }
         
        }, function(d) {
          removeFolderFromFolders(folder).then(function(){
            resolve();
          })
          spinnerService.stop()
          if (d.status == 403) {
            console.log("Ok: Chapter creation forbidden");
            Notification.error(forbidden)
          } else if(d.status == 404) {
            console.log("Ok: chapter creation cancelled. Node doesn't exist anymore")
            Notification.warning(cancel_warning)
            $rootScope.reloadNodes()
          } else{
            console.log("Chapter creation problem")
            console.log(d)
            Notification.error(error)
          }
        });
      })
    }

    function removeFolderFromFolders(folder){
      return $q(function(resolve, reject){
        for( i=0; i< foldersArray.length; i++){
          if (folder.path == foldersArray[i].path){
            foldersArray.splice(i, 1)
          }
        }
        resolve();
      })
    }

    function getEnvironment(){
      var host = window.location.host;
      if(host == 'localhost:3000'){
        return "http://api.unisphere-dev.com:3000"
      } else if(host.indexOf('dev.') > -1){
        return "http://apidev.unisphere.eu"
      } else{
        return "http://api.unisphere.eu"
      }
    }
  }

})();
