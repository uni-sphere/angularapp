(function () {

  angular
    .module('mainApp.controllers')
    .controller('uploadCtrl', uploadCtrl);

  uploadCtrl.$inject = ['$scope', 'Restangular', 'Notification', 'ipCookie', 'spinnerService', '$upload']
  function uploadCtrl($scope, Restangular, Notification, ipCookie, spinnerService, $upload){

    // We watch when someone drag and drops a file / folder
    $scope.$watch('files', function (newVals, oldVals) {
      if(newVals){
        if(!$scope.nodeEnd){
          Notification.error("Select a lead node to upload files")
        } else{
           console.log("Ok: File Dropped")
          $('#grey-background').fadeIn();
          $('#fileDropped').fadeIn();
        }
      }
    });

    $scope.selectDrop = function(position){
      $scope.lastDeployedPosition = position;
      $scope.upload($scope.files, true);
      $('#fileDropped').fadeOut(300);
      $('#grey-background').fadeOut();
    }

    $scope.rootSelected = function(){
      $scope.upload($scope.files, true);
      $('#fileDropped').fadeOut();
      $('#grey-background').fadeOut();
    }

    $scope.cancelDrop = function(){
      $('#grey-background').fadeOut();
      $('#fileDropped').fadeOut();
    }

    $scope.$watch('firstFiles', function (newVals, oldVals) {
      if(newVals && newVals.length != 0){
        console.log("Ok: file choosen")
        $scope.upload($scope.firstFiles, false);
      }
    });

    $scope.upload = function(files, dragAndDrop){
      upload(files, dragAndDrop)
    }

    /*=================================
    =            Functions            =
    =================================*/


    function upload(files, dragAndDrop) {

      function orderFiles(files){
        for (var i = 0; i < files.length; i++){
          if(files[i].type == "directory"){


            var path  = files[i].path.split("/");
            var postPath = [];

            for (var j = 0; j < path.length; j++){
              if(savedPath == undefined){
                postPath.push(0);
                savedPath = [[path[j]]];
              } else if(savedPath[j] == undefined){
                savedPath.push([path[j]]);
                postPath.push(0);
              } else if(isInArray(path[j],savedPath[j])){
                postPath.push(savedPath[j].indexOf(path[j].toString()));
              } else{
                postPath.push(savedPath[j].length);
                savedPath[j].push(path[j]);
              }

            }
            files[i].way = postPath;
            if($scope.arrayFiles == undefined){
              $scope.arrayFiles = [[files[i]]]
            } else{
              $scope.arrayFiles.push([files[i]]);
            }
          }
        }

        if($scope.arrayFiles == undefined){
          $scope.arrayFiles  = [files];
        } else{
          for (var i = 0; i < files.length; i++){
            for(var j = 0; j <  $scope.arrayFiles.length; j++){
              if(files[i].type != "directory" && files[i].name[0] != '.'){
                var dir = files[i].path.split("/");
                dir.pop();
                if(dir.join('/') == $scope.arrayFiles[j][0].path){
                  $scope.arrayFiles[j].push(files[i]);
                }
              }
            }
          }
        }
      }

      function uploadDir(files){
        var folder = files.shift();

        var path = folder.way;

        path[0] = nextNodeData;
        var nodeData = masternodeData;

        function placeFolder(){

          if(path.length > 1){
            var num_doc = 0;
            if(nodeData.items == undefined){
              nodeData = $scope.listItems[$scope.listItems.length - 1];
            } else{
              for (var i = 0; i < nodeData.items.length; i++) {
                if(nodeData.items[i].document){
                  num_doc ++;
                }
              }
              nodeData = nodeData.items[path[0] + num_doc];
            }
            path.shift();
            placeFolder();
          }
        }

        placeFolder();


        var chapterToCreate ={
          title: folder.name,
          node_id: $scope.nodeEnd[0],
          parent_id: nodeData.id
        }

        Restangular.all('chapters').post(chapterToCreate).then(function(d) {
          if(nodeData.items == undefined){
            var depth = 0
          } else{
            depth = nodeData.depth + 1;
          }
          var a = {title: folder.name, id: d.id, items: [], depth: depth}

          if(nodeData.items == undefined){
            $scope.listItems.push(a);
            nodeDocData = $scope.listItems[$scope.listItems.length - 1];
          } else{
            nodeData.items.push(a);
            nodeDocData = nodeData.items[nodeData.items.length -1];
          }

          // We add the chapter to chapter folded, so as to see it!
          $scope.chapterFolded.push(d.id.toString());
          ipCookie('chapterFolded', $scope.chapterFolded);

          $scope.progressionUpload --;
          Notification.success("Chapter created")
          console.log("OK chapter created:" + folder.name);

          // If there is no files to upload. We put dirUploaded to true
          if(files.length == 0){
            $scope.dirUploaded = true;
          } else{
             uploadFiles(files)
          }


        }, function(d) {
          spinnerService.begin()
          if (d.status == 403) {
            console.log("Ok: Chapter creation forbidden");
            Notification.warning("This node is not yours. " +folder.name +" was not created.")
          } else if(d.status == 404) {
            console.log("Ok: chapter creation cancelled. Node doesn't exist anymore")
            Notification.warning('This action has been cancelled. One of your colleague deleted this node')
            $scope.reloadNodes()
          } else{
            Notification.error("Chapter creation problem")
            console.log("Error: Failed to create chapter:" + folder.name +". Please refresh.");
          }
        });
      }

      function uploadFiles(files){
        var numberItems = 0;
        for (var i = 0; i < files.length; i++) {
          var file = files[i];

          $upload.upload({
            url: getEnvironment() + '/awsdocuments',
            file: file,
            fields: {
              title: file.name,
              node_id: $scope.nodeEnd[0],
              chapter_id: nodeDocData.id,
              content: file
            }
          }).then(function(fileUploaded) {
            $scope.progressionUpload --;
            var a = {title: fileUploaded.data.title, doc_id: fileUploaded.data.id, document: true, user_id: fileUploaded.data.user_id,  extension: fileUploaded.data.title.split('.').pop()}
            if(file.type == 'application/pdf'){
              a.pdf = true;
            }
            numberItems ++;
            console.log("OK document uploaded:" + fileUploaded.data.title);
            Notification.success(fileUploaded.data.title + " uploaded")
            if(numberItems == files.length){
              if(nodeDocData.id != 0){
                if(dragAndDrop || !$scope.activeChapter.collapsed ){
                  $scope.chapterFolded.push(nodeDocData.id.toString());
                  ipCookie('chapterFolded', $scope.chapterFolded);
                }
              }
              console.log("OK upload of this level finished")
              $scope.dirUploaded = true;
            }

            if(nodeDocData.items == undefined){
              $scope.listItems.unshift(a);
            } else{
              nodeDocData.items.unshift(a)
            }
          }, function(d) {
            spinnerService.stop()
            if (d.status == 403) {
              console.log("Ok: Upload documents forbidden");
              Notification.warning("This node is not yours")
            } else if(d.status == 404) {
              console.log(d)
              console.log("Ok: File upload cancelled. Node doesn't exist anymore")
              Notification.warning('This action has been cancelled. One of your colleague deleted this node')
              $scope.reloadNodes()
            } else{
              console.log(d)
              Notification.error("File upload error")
              console.log("Error: Upload document failed :" +  file.name + ". Please refresh.");
            }
          });
        }
      }

      function uploadItems(){
        //IF the first element of the array is a directory we upload the dir
        if( $scope.arrayFiles[0][0].type == "directory"){
          uploadDir($scope.arrayFiles[0]);
        }
        //If the first element is a file we upload the file(s)
        else{
          uploadFiles( $scope.arrayFiles[0]);
        }
        // We remove the array we uploaded
        $scope.arrayFiles.shift();

        // We wait until the directory is uploaded
        $scope.$watch('dirUploaded', function () {
          var promise = new Promise(function(resolve, reject){
              if($scope.dirUploaded){
                $scope.dirUploaded = false;
                resolve();
              }
            }).then(function(){
              if($scope.arrayFiles.length == 0){
                spinnerService.stop()
                $scope.lastDeployedPosition = undefined;
              } else{
                console.log("|| MORE FOLDER TO UPLOAD");
                console.log("---------");
                uploadItems();
              }
            }, function(){
              console.log("|| FAIL SOMETHING");
            });
          });
        }

        if (files && files.length) {
          $scope.progressionUpload = files.length
          // console.log(files);

          var savedPath;
          $scope.arrayFiles = undefined;

          if(!dragAndDrop){
            // If we upload a normal file
            if($scope.activeChapter){
              var masternodeData = $scope.activeChapter.$modelValue;
            }
            // If we upload the first file
            else{
              var masternodeData = {id: 0};
            }
          } else{
            if($scope.lastDeployedPosition == undefined){
              var masternodeData = {id: 0};
              var nextNodeData = 1;
            } else{
              var masternodeData = $scope.lastDeployedPosition.$modelValue;
              var nextNodeData = $scope.lastDeployedPosition.$modelValue.items.length;
            }
          }

          var nodeDocData = masternodeData;

          if($scope.isChrome){
            spinnerService.begin()
            orderFiles(files);
            uploadItems();
          } else{
            if(files[0].type == "directory" || files[0].size == 0){
              Notification.error("You can only upload folders on Chrome")
            } else{
              spinnerService.begin()
              orderFiles(files);
              uploadItems();
            }
          }
        }
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
