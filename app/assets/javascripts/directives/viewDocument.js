(function () {
  // 'use strict';
  angular.module('mainApp.directives')
    .directive('viewDocument', ['$translate' , 'Restangular', 'browser', '$upload', function($translate, Restangular, browser, $upload) {
      return {
        restrict: 'E',
        templateUrl: 'application/view-document.html',
        scope:{
          activeNodes: '=',
          nodeEnd: '=',
          files: '=',
          displayError: '=',
          admin: '=',
          home: '='
        },
        link: function(scope){
          
          //Some css
          circleNoDoc();
          window.onresize = function() {
            circleNoDoc();
          };

          scope.$watch('activeNodes', function(newVals, oldVals){
            if(newVals){
              // console.log(newVals);

              //breadcrumb
              scope.breadcrumb = []
              for(var i = scope.activeNodes.length - 2; i >= 0; i--){
                scope.breadcrumb.push(scope.activeNodes[i][1]);
              }

              //Loads docs
              if(scope.nodeEnd){
                Restangular.one('chapters').get({node_id: scope.nodeEnd[0]}).then(function (document) {

                  document.shift();

                  // console.log(scope.documentAbsent);
                  scope.list = makeNested(document);
                });
              } 
            }
          });


          scope.$watch('list', function(newVals, oldVals) {
            if(newVals){

              if(scope.list.length == 0){
                scope.documentAbsent = true;
              } else{
                scope.documentAbsent = false;
              }

              var j = 1;
              var chap = [];
              var savedValueByDepth = [];
              var previousDepth = 0;

              function createChap(d){
                if(!d.document){
                  var newValueByDepth = savedValueByDepth;
                  if(d.depth == previousDepth){
                    // console.log("==");
                    if(savedValueByDepth[[d.depth]] != undefined){
                      newValueByDepth[d.depth] = savedValueByDepth[[d.depth]] + 1;
                    } else{
                      newValueByDepth[d.depth] = 1;
                    }
                    // console.log(newValueByDepth);
                    savedValueByDepth = newValueByDepth;
                  }
                  if(d.depth > previousDepth){
                    // console.log(">");
                    if(savedValueByDepth[[d.depth]] == undefined){
                      newValueByDepth[d.depth] = 1;
                    } else{
                      newValueByDepth[d.depth] = savedValueByDepth[[d.depth]] + 1;
                    }
                    savedValueByDepth = newValueByDepth;
                  }
                  if(d.depth < previousDepth){
                    // console.log("<")
                    var diff = previousDepth - d.depth;
                    newValueByDepth[d.depth] = savedValueByDepth[d.depth] + 1;
                    for(var i= 0; i < diff; i++){
                      newValueByDepth.pop();
                    }
                    
                    savedValueByDepth[d.depth] = savedValueByDepth[d.depth];
                  }

                  previousDepth = d.depth;
                  d.chapter = newValueByDepth.join('.') + ".";
                  // console.log(d.chapter);
                }
              }

              function iterate(d){
                createChap(d);
                if(d.items){
                  d.items.forEach(iterate);
                }
              }

              newVals.forEach(iterate);
            }

          }, true);


          // Take flat data and make them nested
          function makeNested(flatData){

            var dataMap = flatData.reduce(function(map, node) {
              map[node.id] = node;
              return map;
            }, {});

            var treeData = [];
            flatData.forEach(function(node) {

              node.depth = 0;

              if(node.chapter_id){
                node.parent = node.chapter_id
                node.doc_id = node.id
                node.document = true
                node.preview_link = node.url
                delete node.id
                delete node.chapter_id
                delete node.url
              } else{
                node.parent = node.parent_id
                delete node.parent_id
              }
            });

            flatData.forEach(function(node) {
              // console.log(node);
              node.items = [];

              var parent = dataMap[node.parent];
              if (parent) {
                node.depth = node.depth + 1;
                (parent.items || (parent.items = [])).push(node);
              } else {
                // console.log(node);
                treeData.push(node);
              }
            });

            // console.log(treeData);

            return treeData;
          }


          // We save the number of download
          scope.downloadItem = function(scope){
            Restangular.one('activity').put().then(function(d) {
              console.log("Download registered");
            },function(d){
              console.log("There was an error registering the download");
            });
          }


          scope.fileStore =  [];

          // We watch when someone uploads files from the tree
          scope.$watch('fileStore.files', function (newVals, oldVals) {
            if(newVals){
              // console.log("fileStore.files")
              upload(scope.fileStore.files,false);
            }
          });

          // We store where the upload comes from
          scope.storeClick = function(d){
            scope.lastClick = d;
          }

          // We watch when someone drag and drops a file / folder
          scope.$watch('files', function (newVals, oldVals) {
            if(newVals){
              // console.log("files")
              upload(scope.files, true);
            }
          });

          // We watch when someone uploads a file at the root
          scope.$watch('firstFiles', function (newVals, oldVals) {
            if(newVals){
              // console.log("firstFiles")
              upload(scope.firstFiles, false);
            }
          });

          // $scope.$watch('nodeEnd', function(newVals, oldVals) {
          //   if(newVals){
          //     console.log("gg");
          //   }
          // });



          function upload(files, dragAndDrop) {

            /*==========  Order the files (one folder and than all files inside)  ==========*/

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
                  if(scope.arrayFiles == undefined){
                    scope.arrayFiles = [[files[i]]]
                  } else{
                    scope.arrayFiles.push([files[i]]);
                  }
                }
              }

              if(scope.arrayFiles == undefined){
                scope.arrayFiles  = [files];
              } else{
                for (var i = 0; i < files.length; i++){
                  for(var j = 0; j <  scope.arrayFiles.length; j++){
                    if(files[i].type != "directory"){
                      var dir = files[i].path.split("/");
                      dir.pop();
                      if(dir.join('/') == scope.arrayFiles[j][0].path){
                        scope.arrayFiles[j].push(files[i]);
                      }
                    }
                  }
                }
              }
            }

            /*==========  Upload the dir first  ==========*/

            function uploadDir(files){
              var folder = files.shift();

              var path = folder.way;

              path[0] = nextNodeData;
              var nodeData = masternodeData;

              function placeFolder(){

                if(path.length > 1){
                  var num_doc = 0;
                  if(nodeData.items == undefined){
                    nodeData = scope.list[scope.list.length - 1];
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
                node_id: scope.nodeEnd[0],
                parent_id: nodeData.id,
              }

              Restangular.all('chapters').post(chapterToCreate).then(function(d) {
                if(nodeData.items == undefined){
                  var depth = 0
                } else{
                  depth = nodeData.depth + 1;
                }
                var a = {title: folder.name, id: d.id, items: [], depth: depth}

                if(nodeData.items == undefined){
                  scope.list.push(a);
                  nodeDocData = scope.list[scope.list.length - 1];
                } else{
                  nodeData.items.push(a);
                  nodeDocData = nodeData.items[nodeData.items.length -1];
                }

                console.log("OK chapter created:" + folder.name);
                uploadFiles(files)

              }, function(d) {
                scope.displayError("Failed to create chapter:" + folder.name);
                console.log("Failed to create chapter:" + folder.name);
              });
            }

            /*==========  Upload all files in a directory  ==========*/

             function uploadFiles(files){
              for (var i = 0; i < files.length; i++) {

                var file = files[i];
                var numberItems = 0;
                // console.log(nodeDocData);

                $upload.upload({
                  url: getApiUrl() + '/awsdocuments',
                  file: file,
                  fields: {
                    title: file.name,
                    node_id: scope.nodeEnd[0],
                    chapter_id: nodeDocData.id,
                    content: file
                  }
                }).then(function(d) {
                  var a = {title: d.data.title, doc_id: d.data.id, document: true, type: d.data.file_type, preview_link: d.data.url}

                  numberItems ++;
                  console.log("OK document uploaded:" + d.data.title);
                  if(numberItems == files.length){
                    console.log("OK upload of this level finished")

                    scope.dirUploaded = true;
                  }

                  // console.log(nodeDocData.items);
                  if(nodeDocData.items == undefined){
                    scope.list.unshift(a);
                  } else{
                    nodeDocData.items.unshift(a);
                  }

                  if(!dragAndDrop && !scope.documentAbsent && scope.lastClick != undefined){
                    scope.lastClick.expand(); 
                  } else if(scope.documentAbsent){
                    scope.documentAbsent = false;
                  } 

                }, function(d) {
                  scope.displayError("Failed to upload document:" +  file.name);
                  console.log("Failed to upload document:" +  file.name);
                });

              }
            }

            /*==========  Upload function  ==========*/
            
            function uploadItems(){
              //IF the first element of the array is a directory we upload the dir
              if( scope.arrayFiles[0][0].type == "directory"){
                uploadDir( scope.arrayFiles[0]);
              } 
              //If the first element is a file we upload the file(s)
              else{
                uploadFiles( scope.arrayFiles[0]);
              }
              // We remove the array we uploaded
              scope.arrayFiles.shift();

              // We wait until the directory is uploaded
              scope.$watch('dirUploaded', function () {
                var promise = new Promise(function(resolve, reject){
                  if(scope.dirUploaded){
                    scope.dirUploaded = false;
                    resolve();
                  }
                }).then(function(){
                  if( scope.arrayFiles.length != 0){
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
              scope.arrayFiles = undefined;

              if(!dragAndDrop){
                // console.log(scope.lastClick);
                // If we upload the first file
                if(scope.lastClick == undefined){
                  var masternodeData = {id: 0};
                }
                // If we upload a normal file
                else{
                  var masternodeData = scope.lastClick.$modelValue;
                }
              } else{
                if(scope.lastDeployedPosition == undefined){
                  var masternodeData = {id: 0};
                  var nextNodeData = 1;
                } else{
                  var masternodeData = scope.lastDeployedPosition.$modelValue;
                  var nextNodeData = scope.lastDeployedPosition.$modelValue.items.length;
                }
              }

              var nodeDocData = masternodeData;
              // console.log(nodeDocData);
              orderFiles(files);
              uploadItems();
            }
          };

          function getApiUrl(){
            var host = window.location.host;
            if(host == 'localhost:3000'){
              return "http://api.unisphere-dev.com:3000"
            } else{
              return "http://api.unisphere.eu"
            }
          }

          function isInArray(value, array) {
            return array.indexOf(value.toString()) > -1;
          }

          function checkIfChrome(){
            if(browser() == "chrome"){
              scope.isChrome = true;
            } else{
              scope.isChrome = false;
            }
          };

          checkIfChrome();

          function circleNoDoc(){
            var circleWidth = $('#document-absent-dropzone-image').width();
            var circleHeight = $('#document-absent-dropzone-image').height();
            var circleMarginTop = (circleHeight - circleWidth)/ 2

            if(circleWidth > circleHeight){
              $('.circle-image').css("width", circleHeight);
              $('.circle-image').css("height", circleHeight);
              $('.circle-image').css("border-radius", circleHeight / 2);
            } else{
              $('.circle-image').css("margin-top", circleMarginTop);
              $('.circle-image').css("width", circleWidth);
              $('.circle-image').css("height", circleWidth);
              $('.circle-image').css("border-radius", circleWidth / 2);
            }
          }


        }
      };
    }]);
}());


