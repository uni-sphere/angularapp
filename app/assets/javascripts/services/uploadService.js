(function () {
  angular
    .module('mainApp.services')
    .service('uploadService', uploadService);

  uploadService.$inject = ['$rootScope', 'Restangular', 'Notification', 'ipCookie', 'spinnerService', 'Upload', 'createIndexChaptersService'];
  function uploadService($rootScope, Restangular, Notification, ipCookie, spinnerService, Upload, createIndexChaptersService){

    var service = {
      upload: upload
    }

    return service;

    var dragndrop;
    var nodeId;
    var listItems;
    var chapterUploadedArray;
    var foldersArray;
    var chapterFolded;
    var filesArray;
    var chapUploaded;
    var stopWatchingFolders;

    function upload(files, position_chapter, node_id, list_items, chapter_folded){
      nodeId = node_id;
      listItems = list_items;
      chapterFolded = chapter_folded;
      foldersArray = [];
      filesArray = [];
      chapterUploadedArray = [];
      chapterUploaded = false;

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
        } else{
          filesArray.push(value)
        }
      });

      // There are folder to upload
      if(foldersArray.length != 0){
        uploadAllFolder(parentChapter)

        // We watch until all folders have been uploaded
        var stopWatchingFiles = $rootScope.$watch(function() {
          return foldersArray;
        }, function watchCallback(newValue, oldValue) {
          if(newValue.length == 0){

            // Once we finished uploading all folders, we stop watching for them.
            stopWatchingFolders();

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
              uploadFiles(filesToUpload, chapterUploadedArray[i])
            }
            stopWatchingFiles()
          }
        }, true);
      }
      // There is only files to upload
      else{
        // $rootScope.reloadNodes()
        uploadFiles(files, parentChapter)
      }

    }

    function uploadAllFolder(positionChapter){
      uploadFolder(foldersArray[0], positionChapter)

      // We watch each time a folder has been uploaded.
      // If the upload of this folder allows to upload another one than we do it.
      stopWatchingFolders = $rootScope.$watch(function() {
        return chapterUploaded;
      }, function watchCallback(newValue, oldValue) {
        console.log(chapterUploaded)
        if(chapterUploaded){
          for (i=0; i<foldersArray.length; i++){
            if(foldersArray[i].path.substring(0, foldersArray[i].path.lastIndexOf('/')) == chapterUploaded.path){
              uploadFolder(foldersArray[i], chapterUploaded)
            }
          }
        }
      }, true);
    }

    function uploadFiles(files, parentChapter){
      // console.log(files)
      // console.log(parentChapter)

      for (var i = 0; i < files.length; i++) {
        var file = files[i];

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
          var fileToAdd = {title: fileUploaded.data.title, doc_id: fileUploaded.data.id, document: true, user_id: fileUploaded.data.user_id, extension: fileUploaded.data.title.split('.').pop()}

          // Notification
          console.log("OK document uploaded: " + fileUploaded.data.title);
          Notification.success(fileUploaded.data.title + " uploaded")

          // We add the file to listItem
          if(parentChapter.id == 0){
            listItems.unshift(fileToAdd);
          } else{
            parentChapter.items.unshift(fileToAdd);
          }

          // If the parent chapter was not already folded we fold it.
          if(parentChapter.id !=0 && chapterFolded.indexOf(parentChapter.id) == -1){
            chapterFolded.push(parentChapter.id);
            ipCookie('chapterFolded', chapterFolded);
          }

        }, function(d) {
          spinnerService.stop()
          if (d.status == 403) {
            console.log("Ok: Upload documents forbidden");
            Notification.error(file.name + " has not been uploaded. Please refresh.")
          } else if(d.status == 404) {
            console.log(d)
            console.log("Ok: File upload cancelled. Node doesn't exist anymore")
            Notification.warning(file.name + " has not been uploaded. One of your colleague deleted this node")
            $rootScope.reloadNodes()
          } else{
            console.log(d)
            Notification.error(file.name + " has not been uploaded. Please refresh.")
            console.log("Error: Upload document failed :" +  file.name + ". Please refresh.");
          }
        });
      }

    }



    function uploadFolder(folder, parentChapter){
      // console.log(nodeId)
      // console.log(listItems)
      // console.log(folder)
      // console.log(parentChapter)

      var chapterToCreate ={title: folder.name, node_id: nodeId, parent_id: parentChapter.id}

      Restangular.all('chapters').post(chapterToCreate).then(function(chapter) {

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
        removeFolderFromFolders(folder)
        chapterUploaded = chapterToAdd;

        if(parentChapter.id == 0){
          listItems.push(chapterToAdd);
        } else{
          parentChapter.items.push(chapterToAdd);
        }

        // Notifications
        Notification.success("Chapter created")
        console.log("OK chapter created: " + folder.name);

        // If we had a chapter in a chapter. We fold the parent
        if(parentChapter.id !=0 && chapterFolded.indexOf(parentChapter.id) == -1){
          chapterFolded.push(parentChapter.id);
          ipCookie('chapterFolded', chapterFolded);
        }

        // We index the chapters
        createIndexChaptersService.create(listItems)

      }, function(d) {
        removeFolderFromFolders(folder)
        spinnerService.stop()
        if (d.status == 403) {
          console.log("Ok: Chapter creation forbidden");
          Notification.error("Error while creating the chapter " + folder.name)
        } else if(d.status == 404) {
          console.log("Ok: chapter creation cancelled. Node doesn't exist anymore")
          Notification.warning('The chapter creation has been cancelled. One of your colleague deleted this node')
          $rootScope.reloadNodes()
        } else{
          console.log("Chapter creation problem")
          Notification.error("Error while creating the chapter " + folder.name)
        }
      });
    }

    function removeFolderFromFolders(folder){
      for( i=0; i< foldersArray.length; i++){
        if (folder.path == foldersArray[i].path){
          foldersArray.splice(i, 1)
        }
      }
      // chapterUploaded = chapterToAdd
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
