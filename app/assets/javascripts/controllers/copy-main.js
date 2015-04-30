(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope', 'browser', 'nodesflat', '$cookies','$timeout', 'Restangular', '$upload', 'ngDialog', function ($scope, browser, nodesflat, $cookies, $timeout, Restangular, $upload, ngDialog) {

     // var setCallBacks = function () {
     //        var treeScope = getRootNodesScope();
     //        var callBacks = treeScope.$callbacks;
     //        callBacks.dropped = function (event) {
     //            setOrdinals(treeScope.$nodesScope.$nodesMap);
     //        };
     //    };


    $scope.nodes = nodesflat;
    $scope.selectedItem = {};
    $scope.options = {};
    $scope.fileStore=[];
    $scope.chaptersNumber = [];
    $scope.i = -1;
    $scope.showError = false;
    $scope.IsChrome = checkIfChrome();
    $scope.list = "";

    $scope.testtest = function(){
      console.log($scope.list);
    }

    // console.log($scope.nodes);

    /*======================================================
    =            Check if the browser is chrome            =
    ======================================================*/
    
    function checkIfChrome(){
      if(browser() == "chrome"){
        return true;
      } else{
        return false;
      }
    }



    /*==================================================
    =            Check if home or subdomain            =
    ==================================================*/
    
    
    checkLocation = function(){
      var host = window.location.host;
      var pathname = window.location.pathname
      if(pathname == '/home' || host == 'unisphere.eu'){
        $scope.home = true
      } else{
        $scope.home = false;
      }
    }();
    

    /*=====================================
    =            Error gestion            =
    =====================================*/
    
    $scope.displayError = function(errorString){
      if($scope.listError == undefined || $scope.listError.length == 0){
         $scope.listError = [errorString];
      } else{
        $scope.listError.push(errorString);
      }
      $scope.showError = true;
    }
    
    $scope.hideError = function(){
      $scope.listError = [];
      $scope.showError = false;
    }

    /*=======================================
    =            Counter gestion            =
    =======================================*/

    $scope.initCounter = function(){
      $scope.j = 0;
      $scope.k = 0;
    }

    $scope.initI = function(){
      $scope.i ++;
    }

    /*========================================
    =            Show admin popup            =
    ========================================*/
    
    $scope.openPlain = function () {
      ngDialog.open({
        template: 'firstDialogId',
        className: 'admin-popup',
      });
    };

    /*==========================================================
    =            Transform flat data to nested data            =
    ==========================================================*/

    function makeNested(flatData){

      var dataMap = flatData.reduce(function(map, node) {
        map[node.id] = node;
        return map;
      }, {});

      var treeData = [];
      flatData.forEach(function(node) {
        var parent = dataMap[node.parent];
        if (parent) {
          (parent.items || (parent.items = []))
            .push(node);
        } else {
          treeData.push(node);
        }
      });

      return treeData;
    }

    /*======================================
    =            Periodical Get            =
    ======================================*/
    
    // function retrieveDocuments() {
    //   Restangular.one('documents').get().then(function(response) {
    //     $scope.list = response;
    //     console.log("Objects get");
    //     $timeout(retrieveDocuments, 5000);
    //   }, function() {
    //     console.log("There was an error getting");
    //   });
    // }

    // $timeout(retrieveDocuments, 5000);

    /*========================================
    =            utility functions            =
    ========================================*/
    
    function isInArray(value, array) {
      return array.indexOf(value.toString()) > -1;
    }

    /*===========================================
    =            get the environment            =
    ===========================================*/
    
    getEnvironment = function(){
      var host = window.location.host;
      if(host == 'localhost:3000'){
        $scope.urlPath = "http://api.unisphere-dev.com:3000"
      } else{
        $scope.urlPath = "http://api.unisphere.eu"
      }
    }();

    /*======================================
    =            Cookie gestion            =
    ======================================*/

    /*==========  Cookie to find the last node and thus the chapters/document to display  ==========*/
    
    getNodeEnd = $cookies.get('nodeEnd');

    if( getNodeEnd != undefined && getNodeEnd != 'false'){
      getNodeEndArray = getNodeEnd.split(',');
      $scope.nodeEnd =  [parseInt(getNodeEndArray[0]),getNodeEndArray[1]];
    }else{
      $scope.nodeEnd = false;
    }

    /*==========  Cookie to find which chapter are collapsed  ==========*/
    
    var getDocumentFolded = $cookies.get('documentCookies');

    if( getDocumentFolded != undefined ){
      documentFoldedArray = getDocumentFolded.split(',');
      if(!isInArray(0,documentFoldedArray)){
        documentFoldedArray.push("0");
      }
    }else{
      documentFoldedArray =["0"];
    }

    function addToDocumentFoldedCookie(nb){
      if(documentFoldedArray == undefined){
        documentFoldedArray = [nb.toString()];
      } else if(isInArray(nb,documentFoldedArray)){
        var index = documentFoldedArray.indexOf(nb.toString());
        documentFoldedArray.splice(index, 1);
      } else{
        documentFoldedArray.push(nb.toString());
      };
      $cookies.put('documentCookies', documentFoldedArray);
    }

    /*========================================
    =            Toogle documents            =
    ========================================*/

    $scope.toggleItems = function(scope) {
      if(scope.$childNodesScope.$modelValue != undefined){
        scope.toggle();
        addToDocumentFoldedCookie(scope.$modelValue.id);

        // save latest collapse position in case of dropped file
        if(scope.collapsed && scope.$parentNodeScope!= undefined){
          $scope.lastDeployedPosition = scope.$parentNodeScope;
        } else{
          $scope.lastDeployedPosition = scope;
        }
      }
    };

    $scope.collapseItems = function(scope){
      if(documentFoldedArray == undefined){
        scope.toggle();
      } else{
        if(!isInArray(scope.$modelValue.id,documentFoldedArray)){
          scope.toggle();
        };
      }
    }



    $scope.$watch('list', function(newVals, oldVals) {
      if(newVals){
        // console.log($scope.list);
      }
    },true);


    /*=============================================================================
    =            Watches which node is selected and gets the documents            =
    =============================================================================*/
    
    $scope.$watch('nodeEnd', function(newVals, oldVals) {
      if(newVals){
        documentFlat = Restangular.one('chapters').get({node_id: newVals[0]}).then(function (document) {

          document.shift();
         
          if(document.plain().length == 0){
            $scope.documentAbsent = true;
          } else{
            $scope.documentAbsent = false;
          }

          $scope.list = makeNested(document);

          // $scope.$watch('list', function(newVals, oldVals) {
          //   var j = 1;
          //   var chap = [];
          //   var savedValueByDepth = [];
          //   var previousDepth = 0;

          //   createChap = function(d){
          //     if(!d.document){
          //       var depth = d.id.toString().split('').length
          //       newValueByDepth = savedValueByDepth;
          //       if(depth == previousDepth){
          //         // console.log("==");
          //         newValueByDepth[depth - 1] = savedValueByDepth[[depth - 1]] + 1;
          //         savedValueByDepth = newValueByDepth;
          //       }
          //       if(depth > previousDepth){
          //         // console.log(">");
          //         if(savedValueByDepth[[depth - 1]] == undefined){
          //           newValueByDepth[depth - 1] = 1;
          //         } else{
          //           newValueByDepth[depth - 1] = savedValueByDepth[[depth - 1]] + 1;
          //         }
          //         savedValueByDepth = newValueByDepth;
          //       }
          //       if(depth < previousDepth){
          //         var diff = previousDepth - depth;
          //         newValueByDepth[depth -1 ] = savedValueByDepth[depth - 1] + 1;
          //         for(i= 0; i < diff; i++){
          //           newValueByDepth.pop();
          //         }
                  
          //         savedValueByDepth[depth - 1] = savedValueByDepth[depth - 1];
          //       }

          //       previousDepth = depth;
          //       // console.log(newValueByDepth.join('.'));
          //       d.chapter = newValueByDepth.join('.');
          //     }
          //   }

          //   iterate = function (d){
          //     createChap(d);
          //     if(d.items){
          //       d.items.forEach(iterate);
          //     }
          //   }

          //   newVals.forEach(iterate);

          // }, true);
        });

      }
    });


    /*========================================
    =            Delete Documents            =
    ========================================*/

    $scope.removeItem = function(scope) {
      var nodeToDelete = scope;
      var parent = nodeToDelete.$parentNodeScope;

      // Delete the documents
      if(nodeToDelete.$modelValue.document){
        Restangular.all('awsdocuments/' + nodeToDelete.$modelValue.doc_id).remove().then(function() {
          nodeToDelete.remove();
          console.log("document deleted");


          // console.log($scope.list[0].items);
          // console.log($scope.list[0].items[0]);
          // console.log($scope.list)
          if($scope.list.length == 0){
            $scope.documentAbsent = true;
          }
        }, function() {
          scope.displayError("Try again to delete: " + nodeToDelete.$modelValue.title);
          console.log("Try again to delete: " + nodeToDelete.$modelValue.title);
        });
      }
      //delete the chapters
      else{
        Restangular.all('chapters/' + nodeToDelete.$modelValue.id).remove({node_id: $scope.nodeEnd[0]}).then(function() {
          nodeToDelete.remove();
          console.log("chapter deleted");

          // console.log($scope.list)
          if($scope.list.length == 0){
            $scope.documentAbsent = true;
          }

        }, function() {
          scope.displayError("There was an error deleting: " + nodeToDelete.$modelValue.title);
          console.log("There was an error deleting: " + nodeToDelete.$modelValue.title);
        });
      }
      // If we deleted all documents / chapters display the page for no docs

    };

    /*===========================================
    =            Create new item                =
    ===========================================*/
    
    $scope.newSubItem = function(scope) {

      if(scope == undefined){
        var nodeData = {id: 0};
      } else{
        var nodeData = scope.$modelValue;
      }

      // console.log($scope.list[0]);
      // console.log(nodeData);

      var nodeToCreate ={
        node_id: $scope.nodeEnd[0],
        title: "new chapter",
        parent_id: nodeData.id
      }

      Restangular.all('chapters').post(nodeToCreate).then(function(d) {
        var a = {title: "new chapter", id: d.id}

        if(nodeData.items == undefined){
          nodeData.items = [a];
        } else{
          nodeData.items.push(a);
        }
        addToDocumentFoldedCookie(nodeData.id);

        if(!$scope.documentAbsent && scope!= undefined){
          scope.expand();
        } else{
          $scope.documentAbsent = false;
        }

      }, function(d) {
        $scope.displayError("Try again to create a chapter");
        console.log("There was an error saving");
      });
    };

    // $scope.createFirstChapter = function(){
    //   console.log("hello");
    // }

    /*====================================
    =            Rename items            =
    ====================================*/

    $scope.renameItems = function(scope){
      var itemToUpdate = scope.$modelValue;

      //If it is a document
      if(itemToUpdate.document){
        var documentToUpdateId = itemToUpdate.doc_id;

        var result = prompt('Change the name of the document',scope.title);
        if(result) {
          var nodeUpdate = {title: result}

          Restangular.one('awsdocuments/' + documentToUpdateId).put(nodeUpdate).then(function(d) {
            itemToUpdate.title = result;

            console.log("Object updated");
          }, function(d) {
            console.log("There was an error updating the document");
            scope.displayError("Try again to change this document's name");
          });
        }
      }

      //If it is a chapter 
      else{
        var chapterToUpdateId = itemToUpdate.id;

        var result = prompt('Change the name of the chapter',scope.title);
        if(result) {
          var nodeUpdate = {title: result, node_id: $scope.nodeEnd[0]}

          Restangular.one('chapters/' + chapterToUpdateId).put(nodeUpdate).then(function(d) {
            itemToUpdate.title = result;

            console.log("Object updated");
          }, function(d) {
            console.log("There was an error updating");
            scope.displayError("Try again to change this chapter's name");
          });
        }
      }
    }

    /*=========================================
    =            Download function            =
    =========================================*/
    
    $scope.downloadItem = function(scope){
      Restangular.one('activity').put().then(function(d) {
        console.log("Download registered");
      },function(d){
        console.log("There was an error registering the download");
      });
    }

    /*======================================
    =            Upload funcion            =
    ========================================*/

    $scope.$watch('fileStore.files', function () {
      upload($scope.fileStore.files,false);
    });

    $scope.$watch('files', function () {
      upload($scope.files, true);
    });

    $scope.$watch('firstFiles', function () {
      upload($scope.firstFiles, false);
    });

    upload = function (files, dragAndDrop) {

      /*==========  Order the files (one folder and than all files inside)  ==========*/

      orderFiles = function(files){
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
              if(files[i].type != "directory"){
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

      /*==========  Upload the dir first  ==========*/

      uploadDir = function(files){
        folder = files.shift();

        var path = folder.way;
        path[0] = nextNodeData;
        nodeData = masternodeData;

        placeFolder = function(){

          if(path.length > 1){
            var num_doc = 0;
            for (var i = 0; i < nodeData.items.length; i++) {
              if(nodeData.items[i].document){
                num_doc ++;
              }
            }
            nodeData = nodeData.items[path[0] + num_doc];
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
          var a = {title: folder.name, id: d.id}

          if(nodeData.items == undefined){
            nodeData.items = [a];
            nodeDocData = nodeData.items[0];
          } else{
            nodeData.items.push(a);
            nodeDocData = nodeData.items[nodeData.items.length -1];
          }

          console.log("OK chapter created:" + folder.name);
          uploadFiles(files)

        }, function(d) {
          $scope.displayError("Failed to create chapter:" + folder.name);
          console.log("Failed to create chapter:" + folder.name);
        });
      }

      /*==========  Upload all files in a directory  ==========*/

      uploadFiles = function(files){
        for (var i = 0; i < files.length; i++) {

          var file = files[i];
          var numberItems = 0;

          // console.log($scope.nodeEnd[0]);

          $upload.upload({
            url: $scope.urlPath + '/awsdocuments',
            fields: {'username': $scope.username},
            file: file,
            fields: {
              title: file.name,
              node_id: $scope.nodeEnd[0],
              chapter_id: nodeDocData.id,
              content: file
            }
          }).then(function(d) {
            var a = {title: d.data.title, doc_id: d.data.id, document: true, type: d.data.file_type, preview_link: d.data.url}

            numberItems ++;
            console.log("OK document uploaded:" + d.data.title);
            if(numberItems == files.length){
              console.log("OK upload of this level finished")

              $scope.dirUploaded = true;
            }

            if(nodeDocData.items == undefined){
              nodeDocData.items = [a];
            } else{
              nodeDocData.items.unshift(a);
            }

            if(!dragAndDrop && !$scope.documentAbsent){
              $scope.lastClick.expand(); 
            } else if($scope.documentAbsent){
              $scope.documentAbsent = false;
            } 

            //else{
            //   console.log($scope.lastClick);
            //   console.log($scope.lastDeployedPosition);
            //   console.log($scope.lastDeployedPosition.$$nextSibling);
            //   $scope.lastDeployedPosition.$$nextSibling.expand();
            // }

          }, function(d) {
            $scope.displayError("Failed to upload document:" +  file.name);
            console.log("Failed to upload document:" +  file.name);
          });

        }
      }

      /*==========  Upload function  ==========*/
      
      uploadItems = function(){
        //IF the first element of the array is a directory we upload the dir
        if( $scope.arrayFiles[0][0].type == "directory"){
          uploadDir( $scope.arrayFiles[0]);
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
            if( $scope.arrayFiles.length != 0){
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
        // console.log(files);

        var savedPath;
        $scope.arrayFiles = undefined;

        if(!dragAndDrop){
          // If we upload the first file
          if($scope.lastClick == undefined){
            var masternodeData = $scope.list[0];
          }
          // If we upload a normal file
          else{
            var masternodeData = $scope.lastClick.$modelValue;
          }
        } else{
          if($scope.lastDeployedPosition == undefined){
            var masternodeData = $scope.list[0];
            var nextNodeData = $scope.list[0].items.length;
          } else{
            var masternodeData = $scope.lastDeployedPosition.$modelValue;
            var nextNodeData = $scope.lastDeployedPosition.$modelValue.items.length;
          }
        }

        nodeDocData = masternodeData;
        orderFiles(files);
        uploadItems();
      }

    };

  }]);
})();