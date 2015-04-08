(function(){
angular
  .module('myApp.controllers')
  .controller('HomeCtrl', ['$scope', 'nodesflat', '$cookies','$timeout', 'Restangular', '$upload', 'ngDialog', function ($scope, nodesflat, $cookies, $timeout, Restangular, $upload, ngDialog) {
    
    $scope.openPlain = function () {
      // $rootScope.theme = 'ngdialog-theme-plain';
      ngDialog.open({
        template: 'firstDialogId',
        className: 'admin-popup',
      });
    };


    /*==========  transform flat to nested data  ==========*/

    // var data = [
    // { "name" : "Level 2: A", "parent":"Top Level" },
    // { "name" : "Top Level", "parent":"null" },
    // { "name" : "Son of A", "parent":"Level 2: A" },
    // { "name" : "Daughter of A", "parent":"Level 2: A" },
    // { "name" : "Level 2: B", "parent":"Top Level" }
    // ];

    // console.log(data);



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

    $scope.nodes = nodesflat;

    $scope.selectedItem = {};
    $scope.options = {};
    $scope.fileStore=[];
    $scope.$watch('fileStore.files', function () {
      upload($scope.fileStore.files,false);
    });
    var restAngularDocuments = Restangular.one('documents');

    $scope.$watch('files', function () {
      upload($scope.files, true);
    });

    $scope.storeClick = function(scope){
      $scope.lastClick = scope;
    }

    /*==========  Periodical get  ==========*/
    
    // function retrieveDocuments() {
    //   restAngularDocuments.get().then(function(response) {
    //     $scope.list = response;
    //     console.log("Objects get");
    //     $timeout(retrieveDocuments, 5000);
    //   }, function() {
    //     console.log("There was an error getting");
    //   });
    // }

    // $timeout(retrieveDocuments, 5000);

    /*========================================
    =            Random functions            =
    ========================================*/
    
    function isInArray(value, array) {
      return array.indexOf(value.toString()) > -1;
    }
    
    $scope.initCounter = function(){
      $scope.j = 0;
      $scope.k = 0;
    }

    $scope.initI = function(){
      $scope.i ++;
    }

    getEnvironment = function(){
      var host = window.location.host;
      if(host == 'localhost:3000'){
        $scope.urlPath = "http://api.unisphere-dev.com:3000"
      } else{
        $scope.urlPath = "http://api.unisphere.eu"
      }
    }

    getEnvironment();

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

    // $scope.showError = false;

    $scope.displayError = function(errorString){
      if($scope.listError.length == 0){
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

    $scope.chaptersNumber = [];
    $scope.i = -1;

    // $scope.displayError(["hello", "salut", "ads"]);

    /*========================================
    =            Toogle documents            =
    ========================================*/

    // console.log($scope.lastDeployedPosition);
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
      // console.log($scope.lastDeployedPosition);
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

   

    $scope.$watch('nodeEnd', function(newVals, oldVals) {
      if(newVals){
        // console.log(newVals);
        documentFlat = Restangular.one('chapters').get({node_id: newVals[0]}).then(function (document) {

          if(document.plain().length == 0){
            $scope.documentAbsent = true;
          } else{
            $scope.documentAbsent = false;
          }
          // console.log(document.plain());

          var documentsNested = makeNested(document);
        
          $scope.list = documentsNested

          // console.log($scope.list);
          // for(document in $scope.list){
          //   if(document.document){
          //     console.log(document);
          //   }
          // }

          // console.log($scope.list);

          // console.log(plop);

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

    $scope.removeItems = function(scope) {
      

      if(scope.$modelValue.document){
        var nodeToDelete = scope.$modelValue.doc_id;
        Restangular.all('awsdocuments/' + nodeToDelete).remove().then(function() {
          scope.remove();
          console.log("document deleted");
        }, function() {
          scope.displayError("Try again to delete this document");
          console.log("There was an error deleting the document");
        });
      } else{
        var nodeToDelete = scope.$modelValue.id;
        Restangular.all('chapters/' + nodeToDelete).remove({node_id: $scope.nodeEnd[0]}).then(function() {
          scope.remove();
          console.log("chapter deleted");
        }, function() {
          scope.displayError("Try again to delete this chapter");
          console.log("There was an error deleting the chapter");
        });
      }
    };


    /*===========================================
    =            Create new item                =
    ===========================================*/
    
    $scope.newSubItem = function(scope) {

      var nodeData = scope.$modelValue;
      var nodeToCreate ={
        node_id: $scope.nodeEnd[0],
        title: "new chapter",
        parent_id: scope.$modelValue.id
      }

      Restangular.all('chapters').post(nodeToCreate).then(function(d) {
        var a = {title: "new chapter", id: d.id}

        if(nodeData.items == undefined){
          nodeData.items = [a];
        } else{
          nodeData.items.push(a);
        }
        addToDocumentFoldedCookie(scope.$modelValue.id);
        scope.expand();
      }, function(d) {
        $scope.displayError("Try again to create a chapter");
        console.log("There was an error saving");
      });
    };


    /*======================================
    =            Upload funcion            =
    ========================================*/

    
    upload = function (files, dragAndDrop) {

      orderFiles = function(files){
        // console.log(files);
        for (var i = 0; i < files.length; i++){
          // console.log(files[i].type);
          if(files[i].type == "directory"){
            // console.log(files[i]);

            var path  = files[i].path.split("/");
            var postPath = [];

            for (var j = 0; j < path.length; j++){
              // console.log(savedPath);
              if(savedPath == undefined){
                // console.log("path undef")
                postPath.push(0);
                savedPath = [[path[j]]];
              } else if(savedPath[j] == undefined){
                savedPath.push([path[j]]);
                postPath.push(0);
              } else if(isInArray(path[j],savedPath[j])){
                // console.log("path exist")
                postPath.push(savedPath[j].indexOf(path[j].toString()));
              } else{
                // console.log("path new")
                postPath.push(savedPath[j].length);
                savedPath[j].push(path[j]);
              }

            }
            files[i].way = postPath;
            // console.log(files[i]);
            if($scope.arrayFiles == undefined){
              $scope.arrayFiles = [[files[i]]]
            } else{
              $scope.arrayFiles.push([files[i]]);
            }
          }
        }

        // console.log(arrayFiles);
        
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

      uploadDir = function(files){
        folder = files.shift();

        // if(!dragAndDrop){
        //   var masterodeData = $scope.lastClick.$modelValue;
        // } else{
        //   if($scope.lastDeployedPosition == undefined){
        //     var nodeData = $scope.list[0];
        //   } else{
        //     var nodeData = $scope.lastDeployedPosition.$modelValue;
        //   }
        // }

        // // console.log(nodeData);
        var path = folder.way;
        path[0] = nextNodeData;
        // console.log(nextNodeData);
        // console.log("PATH " + path);

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
        // console.log("nodeData")
        // console.log(nodeData);


        var chapterToCreate ={
          title: folder.name,
          node_id: $scope.nodeEnd[0],
          parent_id: nodeData.id
        }

        Restangular.all('chapters').post(chapterToCreate).then(function(d) {
          var a = {title: folder.name, id: d.id}

          // console.log(nodeData);

          if(nodeData.items == undefined){
            nodeData.items = [a];
            nodeDocData = nodeData.items[0];
          } else{
            nodeData.items.push(a);
            nodeDocData = nodeData.items[nodeData.items.length -1];
          }

          // if($scope.lastDeployedPosition != undefined){
          //   $scope.lastDeployedPosition = $scope.lastDeployedPosition.$childNodesScope
          // }
         
          
          console.log("OK chapter created:" + folder.name);
          uploadFiles(files)

          // scope.expand();

        }, function(d) {
          $scope.displayError("Failed to create chapter:" + folder.name);
          console.log("Failed to create chapter:" + folder.name);
        });
      }

      uploadFiles = function(files){
        for (var i = 0; i < files.length; i++) {

          // console.log("merde: " + arrayFiles);

          var file = files[i];
          var numberItems = 0;

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
            console.log(d);
            var a = {title: d.data.title, doc_id: d.data.id, document: true, type: d.data.type_file, preview_link: d.data.content.url}

            console.log(file.type)
            // console.log("merde: " + arrayFiles);


            numberItems ++;
            console.log("OK document uploaded:" + d.data.title);
            if(numberItems == files.length){
              console.log("OK upload of this level finished")
              // console.log("merde: " + arrayFiles);

              $scope.dirUploaded = true;
            }

            if(nodeDocData.items == undefined){
              nodeDocData.items = [a];
            } else{
              nodeDocData.items.unshift(a);
            }


            if(!dragAndDrop){
              $scope.lastClick.expand(); 
            } //else{
            //   console.log($scope.lastClick);
            //   console.log($scope.lastDeployedPosition);
            //   console.log($scope.lastDeployedPosition.$$nextSibling);
            //   $scope.lastDeployedPosition.$$nextSibling.expand();
            // }

          }, function(d) {
            $scope.displayError("Failed to upload document:" + d.data.title);
            console.log("Failed to upload document:" + d.data.title);
          });

        }
      }

      uploadItems = function(){
        // console.log(arrayFiles);
        if( $scope.arrayFiles[0][0].type == "directory"){
          uploadDir( $scope.arrayFiles[0]);
        } else{
          uploadFiles( $scope.arrayFiles[0]);
        }
         $scope.arrayFiles.shift();
        // console.log("hello");

        $scope.$watch('dirUploaded', function () {
          var promise = new Promise(function(resolve, reject){
            // console.log("putain" +  $scope.arrayFiles);
            if($scope.dirUploaded){
              $scope.dirUploaded = false;
              resolve();
            }
          }).then(function(){
            // console.log(arrayFiles.length);
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

      // $scope.arrayFiles = [];
      if (files && files.length) {
        var savedPath;
        $scope.arrayFiles = undefined;

        if(!dragAndDrop){
          var masternodeData = $scope.lastClick.$modelValue;
        } else{
          if($scope.lastDeployedPosition == undefined){
            var masternodeData = $scope.list[0];
            // console.log($scope.list[0]);
            var nextNodeData = $scope.list[0].items.length;
          } else{
            var masternodeData = $scope.lastDeployedPosition.$modelValue;
            var nextNodeData = $scope.lastDeployedPosition.$modelValue.items.length;
          }
        }

        nodeDocData = masternodeData;
        orderFiles(files);

        // console.log(arrayFiles);
        uploadItems();
      }

    };

  }]);
})();