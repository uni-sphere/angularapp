(function () {

  angular.module('mainApp.directives')
    .directive('rightTree', ['$translate' , 'Restangular', 'browser', '$upload',
                'Notification', 'ipCookie', 'activateSpinner', 'stopSpinner',
                '$window', function($translate, Restangular, browser,
                $upload, Notification, ipCookie, activateSpinner, stopSpinner, $window) {
      return {
        restrict: 'E',
        templateUrl: 'webapp/right-tree.html',
        scope:{
          activeNodes: '=',
          nodeEnd: '=',
          files: '=',
          admin: '=',
          sandbox: '=',
          home: '=',
          chapterFolded: '=',
          activeChapter: '=',
          breadcrumb: '='
        },
        link: function(scope){

          var dummyId = 50;

          (function findFoldedChapter(){
            // demo
            if(scope.home || scope.sandbox){
              scope.chapterFolded = ["0", "19"];
            }
            // Normal mode
            else{
              scope.chapterFolded = ipCookie('chapterFolded');

              if(scope.chapterFolded != undefined ){
                if(!isInArray(0, scope.chapterFolded)){
                  scope.chapterFolded.push("0");
                }
              } else{
                scope.chapterFolded =["0"];
              }
            }
          })();

          scope.$watch('nodeEnd', function(newVals, oldVals){
            if(newVals){
              //Loads docs
              if(scope.nodeEnd){
                console.log(scope.nodeEnd)
                if(scope.sandbox && scope.nodeEnd[0] > 49 || scope.home && scope.nodeEnd[0] > 49){
                  console.log("Ok: fake nodes")
                   scope.listItems = [];
                } else{
                  Restangular.one('chapters').get({node_id: scope.nodeEnd[0]}).then(function (document) {
                    document.shift();
                    scope.listItems = makeNested(document);
                  }, function(d){
                    console.log("Error: Get document");
                    console.log(d)
                    Notification.error("We temporarly can not display the documents")
                    ipCookie.remove('activeNodes')
                    ipCookie.remove('nodeEnd')
                    ipCookie.remove('foldedNodes')
                    ipCookie.remove('chapterFolded')
                  });
                }
              }
            }
          });

          scope.$watch('listItems', function(newVals, oldVals) {
            if(newVals){

              if(scope.listItems.length == 0){
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
              node.items = [];

              var parent = dataMap[node.parent];
              if (parent) {
                node.depth = node.depth + 1;
                (parent.items || (parent.items = [])).push(node);
              } else {
                treeData.push(node);
              }
            });

            return treeData;
          }

          // We save the number of download
          scope.downloadItem = function(node){
            if(scope.home || scope.sandbox){
              Notification.info("It is a trial version")
            }
            else{
              // console.log(scope.nodeEnd[0])
              Restangular.one('activity').put({node_id: scope.nodeEnd[0]}).then(function(d) {
                Notification.success("File saved")
                console.log("Download registered");
              },function(d){
                console.log(d)
                console.log("Error: Register the download");
              });
            }
          }

          // We watch when someone drag and drops a file / folder
          scope.$watch('files', function (newVals, oldVals) {
            if(newVals){
              if(!scope.nodeEnd){
                Notification.error("Select a lead node to upload files")
              } else{
                 console.log("Ok: File Dropped")
                $('#fileDroppedBackground').fadeIn();
                $('#fileDropped').fadeIn();
              }
            }
          });

          scope.selectDrop = function(position){
            scope.lastDeployedPosition = position;
            upload(scope.files, true);
            $('#fileDropped').fadeOut(300);
            $('#fileDroppedBackground').fadeOut();
          }

          scope.rootSelected = function(){
            upload(scope.files, true);
            $('#fileDropped').fadeOut();
            $('#fileDroppedBackground').fadeOut();
          }

          scope.cancelDrop = function(){
            $('#fileDroppedBackground').fadeOut();
            $('#fileDropped').fadeOut();
          }

          scope.$watch('firstFiles', function (newVals, oldVals) {
            if(newVals && newVals.length != 0){
              console.log("Ok: file choosen")
              upload(scope.firstFiles, false);
            }
          });

          scope.collapseItems = function(scope) {
            if(scope.chapterFolded == undefined){
              scope.collapse();
            } else{
              if(!isInArray(scope.$modelValue.id,scope.chapterFolded) && scope.$modelValue.items.length != 0){
                scope.collapse();
              }
            }
          }

          scope.activateChapter = function(node){
            if(!node.document){
              // activate the chapter
              if(!node.$modelValue.document){
                if(scope.activeChapter != undefined){
                  scope.activeChapter.$modelValue.activeItem = false;
                }

                if(node.collapsed || node.$modelValue.items.length == 0){
                  node.$modelValue.activeItem = true;
                  scope.activeChapter = node;
                } else{
                  scope.activeChapter = undefined;
                }

              }

              // toggle the node
              if(node.$modelValue.items.length != 0){
                node.toggle();
                addTochapterFolded(node.$modelValue.id);
              }
            }
          }

          scope.documentLooseFocus = function(){
            if(scope.activeChapter != undefined){
              scope.activeChapter.$modelValue.activeItem = false;
              scope.activeChapter = undefined
            }
          }

          function addTochapterFolded(nb){
            if(scope.chapterFolded == undefined){
              scope.chapterFolded = [nb.toString()];
            } else if(isInArray(nb,scope.chapterFolded)){
              var index = scope.chapterFolded.indexOf(nb.toString());
              scope.chapterFolded.splice(index, 1);
            } else{
              scope.chapterFolded.push(nb.toString());
            };
            ipCookie('chapterFolded', scope.chapterFolded);
            console.log(scope.chapterFolded)
          }

          function isInArray(value, array) {
            return array.indexOf(value.toString()) > -1;
          }

          /*========================================
          =            Delete Documents            =
          ========================================*/

          var dummyId = 30;

          scope.removeItem = function(node) {
            var parent = node.$parentNodeScope;

            // Delete the documents
            if(node.$modelValue.document){

              // Demo mode
              if(scope.home || scope.sandbox){
                node.remove();
                console.log("Ok: Document deleted");
                Notification.warning("File removed")

                if(scope.listItems.length == 0){
                  scope.documentAbsent = true;
                }
              }
              // Normal mode
              else{
                Restangular.all('awsdocuments/' + node.$modelValue.doc_id).remove().then(function() {
                  node.remove();
                  console.log("Ok: Document deleted");
                  Notification.warning("File removed")
                  if(scope.listItems.length == 0){
                    scope.documentAbsent = true;
                  }
                }, function(d) {
                  if (d.status == 403){
                    console.log("Ok: Delete a file forbidden");
                    Notification.warning("This file is not yours");
                  } else {
                    console.log("Error: Delete file");
                    console.log(d);
                    Notification.error("We can't temporarily delete the file " + node.$modelValue.title);
                  }
                });
              }
            }

            //delete the chapters
            else{
              // Demo mode
              if(scope.home || scope.sandbox){
                node.remove();
                console.log("Ok: Document deleted");
                Notification.warning("File removed")

                if(scope.listItems.length == 0){
                  scope.documentAbsent = true;
                }
              }
              // Normal mode
              else{
                Restangular.all('chapters/' + node.$modelValue.id).remove({node_id: scope.nodeEnd[0]}).then(function() {

                  if(scope.activeChapter != undefined && scope.activeChapter.$modelValue.id == node.$modelValue.id){
                    scope.activeChapter = undefined;
                  }

                  // Remove from cookies the chapter folded deleted
                  if(scope.chapterFolded && scope.chapterFolded.indexOf(node.$modelValue.id.toString()) > -1){
                    scope.chapterFolded.splice(scope.chapterFolded.indexOf(node.$modelValue.id.toString()), 1);
                  }
                  angular.forEach(node.$modelValue.items, function(value,key){
                    if(!value.document && scope.chapterFolded && scope.chapterFolded.indexOf(value.id.toString()) > -1){
                      scope.chapterFolded.splice(scope.chapterFolded.indexOf(value.id.toString()), 1);
                    }
                  });

                  node.remove();
                  console.log("Ok: Chapter deleted");
                  Notification.warning("Chapter removed")

                  if(scope.listItems.length == 0){
                    scope.documentAbsent = true;
                  }
                }, function(d) {
                  if (d.status == 403){
                    console.log("Ok: Delete a chapter forbidden");
                    Notification.warning("This chapter is not yours");
                  } else {
                    console.log("Error: Delete a chapter");
                    console.log(d);
                    Notification.error("We can't temporarily delete this chapter");
                  }
                });
              }
            }
          }

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
                    if(files[i].type != "directory" && files[i].name[0] != '.'){
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

            function uploadDir(files){
              var folder = files.shift();

              var path = folder.way;

              path[0] = nextNodeData;
              var nodeData = masternodeData;

              function placeFolder(){

                if(path.length > 1){
                  var num_doc = 0;
                  if(nodeData.items == undefined){
                    nodeData = scope.listItems[scope.listItems.length - 1];
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
                parent_id: nodeData.id
              }

              // Demo
              if(scope.home || scope.sandbox){
                if(nodeData.items == undefined){
                  var depth = 0
                } else{
                  depth = nodeData.depth + 1;
                }
                var a = {title: folder.name, id: dummyId, items: [], depth: depth}
                dummyId ++;

                if(nodeData.items == undefined){
                  scope.listItems.push(a);
                  nodeDocData = scope.listItems[scope.listItems.length - 1];
                } else{
                  nodeData.items.push(a);
                  nodeDocData = nodeData.items[nodeData.items.length -1];
                }

                scope.chapterFolded.push(dummyId.toString());

                scope.progressionUpload --;
                console.log("OK fake chapter created:" + folder.name);

                // If there is no files to upload. We put dirUploaded to true
                if(files.length == 0){
                  scope.dirUploaded = true;
                } else{
                  uploadFiles(files)
                }
              } else{
                // Real
                Restangular.all('chapters').post(chapterToCreate).then(function(d) {
                  if(nodeData.items == undefined){
                    var depth = 0
                  } else{
                    depth = nodeData.depth + 1;
                  }
                  var a = {title: folder.name, id: d.id, items: [], depth: depth}

                  if(nodeData.items == undefined){
                    scope.listItems.push(a);
                    nodeDocData = scope.listItems[scope.listItems.length - 1];
                  } else{
                    nodeData.items.push(a);
                    nodeDocData = nodeData.items[nodeData.items.length -1];
                  }

                  // We add the chapter to chapter folded, so as to see it!
                  scope.chapterFolded.push(d.id.toString());
                  ipCookie('chapterFolded', scope.chapterFolded);

                  scope.progressionUpload --;
                  Notification.success("Chapter created")
                  console.log("OK chapter created:" + folder.name);

                  // If there is no files to upload. We put dirUploaded to true
                  if(files.length == 0){
                    scope.dirUploaded = true;
                  } else{
                     uploadFiles(files)
                  }


                }, function(d) {
                  stopSpinner()
                  if (d.status == 403) {
                    console.log("Ok: Chapter creation forbidden");
                    Notification.warning("This node is not yours")
                  } else {
                    Notification.error("Chapter creation problem")
                    console.log("Error: Failed to create chapter:" + folder.name);
                  }
                });
              }
            }

            function uploadFiles(files){
              var numberItems = 0;
              for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // Demo
                if(scope.home || scope.sandbox){
                  var a = {title: file.name, doc_id: dummyId, document: true, type: file.type}

                  numberItems ++;
                  dummyId ++;
                  console.log("Fake file uploaded:" + file.name);
                  if(numberItems == files.length){
                    console.log("OK upload of this level finished")
                    scope.dirUploaded = true;
                  }

                  if(nodeDocData.items == undefined){
                    scope.listItems.unshift(a);
                  } else{
                    nodeDocData.items.unshift(a);
                  }
                }
                // Normal mode
                else{
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
                    scope.progressionUpload --;
                    var a = {title: d.data.title, doc_id: d.data.id, document: true, type: file.type, preview_link: d.data.url}
                    numberItems ++;
                    console.log("OK document uploaded:" + d.data.title);
                    Notification.success("OK document uploaded: " + d.data.title)
                    if(numberItems == files.length){
                      if(nodeDocData.id != 0){
                        if(dragAndDrop || !scope.activeChapter.$nodeScope.collapsed ){
                          console.log("hello")
                          scope.chapterFolded.push(nodeDocData.id.toString());
                          ipCookie('chapterFolded', scope.chapterFolded);
                        }
                      }

                      console.log("OK upload of this level finished")
                      scope.dirUploaded = true;
                    }

                    if(nodeDocData.items == undefined){
                      scope.listItems.unshift(a);
                    } else{
                      nodeDocData.items.unshift(a);
                    }

                  }, function(d) {
                    stopSpinner()
                    if (d.status == 403) {
                      console.log("Ok: Upload documents forbidden");
                      Notification.warning("This node is not yours")
                    } else {
                      Notification.error("File upload error")
                      console.log("Error: Upload document failed :" +  file.name);
                    }
                  });
                }
              }
            }

            function uploadItems(){
              //IF the first element of the array is a directory we upload the dir
              if( scope.arrayFiles[0][0].type == "directory"){
                uploadDir(scope.arrayFiles[0]);
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
                  if(scope.arrayFiles.length == 0){
                    stopSpinner()
                    scope.lastDeployedPosition = undefined;
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
              scope.progressionUpload = files.length
              // console.log(files);

              var savedPath;
              scope.arrayFiles = undefined;

              if(!dragAndDrop){
                // If we upload a normal file
                if(scope.activeChapter){
                  var masternodeData = scope.activeChapter.$modelValue;
                }
                // If we upload the first file
                else{
                  var masternodeData = {id: 0};
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

              if(scope.isChrome){
                activateSpinner()
                orderFiles(files);
                uploadItems();
              } else{
                if(files[0].type == "directory" || files[0].size == 0){
                  Notification.error("You can only upload folders on Chrome")
                } else{
                  activateSpinner()
                  orderFiles(files);
                  uploadItems();
                }
              }
            }
          }

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

          (function checkIfChrome(){
            if(browser() == "chrome"){
              scope.isChrome = true;
            } else{
              scope.isChrome = false;
            }
          })();

        }
      }
    }])
}());


