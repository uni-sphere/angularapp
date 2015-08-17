(function () {

  angular.module('mainApp.directives')
    .directive('viewDocument', ['$translate' , 'Restangular', 'browser', '$upload', 'Notification', 'ipCookie', 'activateSpinner', 'stopSpinner', function($translate, Restangular, browser, $upload, Notification, ipCookie, activateSpinner, stopSpinner) {
      return {
        restrict: 'E',
        templateUrl: 'webapp/view-document.html',
        scope:{
          activeNodes: '=',
          nodeEnd: '=',
          files: '=',
          admin: '=',
          sandbox: '=',
          home: '=',
          chapterFolded: '='
        },
        link: function(scope){

          // Find the chapter that are folded
          // demo
          if(scope.home || scope.sandbox){
            scope.chapterFolded = ["0", "19"];
          }
          // Normal mode
          else{
            scope.chapterFolded = ipCookie('chapterFolded');

            if(scope.chapterFolded != undefined ){
              if(!isInArray(0, scope.chapterFolded)){
                $scope.chapterFolded.push("0");
              }
            } else{
              scope.chapterFolded =["0"];
            }
          }


          // scope.home = true
          var dummyId = 50;
          // scope.viewDocumentRename = true;

          scope.$watch('activeNodes', function(newVals, oldVals){
            if(newVals){
              console.log(newVals);
              //breadcrumb
              scope.breadcrumb = []
              for(var i = scope.activeNodes.length - 2; i >= 0; i--){
                scope.breadcrumb.push(scope.activeNodes[i][1]);
              }

              //Loads docs
              if(scope.nodeEnd){
                Restangular.one('chapters').get({node_id: scope.nodeEnd[0]}).then(function (document) {
                  document.shift();
                  scope.list = makeNested(document);
                }, function(d){
                  console.log("Error: Get document");
                  console.log(d)
                  Notification.error("We temporarly can not display the documents")
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
              console.log("Ok: File Dropped")
              $('#fileDroppedBackground').fadeIn();
              $('#fileDropped').fadeIn();
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

          // We watch when someone uploads a file at the root
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
            console.log("Ok: Chapter selected")
            // activate the chapter
            if(!node.$modelValue.document){
              if(scope.previousActiveChapter != undefined){
                scope.previousActiveChapter.$modelValue.activeItem = false;
              }

              node.$modelValue.activeItem = true;
              scope.activeChapter = node;
              scope.previousActiveChapter = node
            }

            // toggle the node
            if(node.$childNodesScope.$modelValue != undefined){
              node.toggle();
              addTochapterFolded(node.$modelValue.id);
            }
          }

          scope.documentLooseFocus = function(){

            if(scope.previousActiveChapter != undefined){
              scope.previousActiveChapter.$modelValue.activeItem = false;
              scope.activeChapter = undefined
            }


          }

          // Add folded chapters to cookie
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
          }

          function isInArray(value, array) {
            return array.indexOf(value.toString()) > -1;
          }














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
                  scope.list.push(a);
                  nodeDocData = scope.list[scope.list.length - 1];
                } else{
                  nodeData.items.push(a);
                  nodeDocData = nodeData.items[nodeData.items.length -1];
                }

                scope.chapterFolded.push(d.id.toString());

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
                    scope.list.push(a);
                    nodeDocData = scope.list[scope.list.length - 1];
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
                  Notification.error("Chapter creation problem")
                  console.log("Error: Failed to create chapter:" + folder.name);
                });
              }
            }

            /*==========  Upload all files in a directory  ==========*/

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
                    scope.list.unshift(a);
                  } else{
                    nodeDocData.items.unshift(a);
                  }

                  if(!dragAndDrop && !scope.documentAbsent && scope.lastClick != undefined){
                    scope.chapterFolded.push(nodeDocData.id.toString());

                    scope.lastClick.expand();

                  } else if(scope.documentAbsent){
                    scope.documentAbsent = false;
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
                      console.log(scope.lastClick)
                      scope.lastClick.expand();
                      scope.chapterFolded.push(nodeDocData.id.toString());
                      ipCookie('chapterFolded', scope.chapterFolded);
                    } else if(scope.documentAbsent){
                      scope.documentAbsent = false;
                    }

                  }, function(d) {
                    Notification.error("File upload error")
                    console.log("Error: Upload document failed :" +  file.name);
                  });
                }
              }
            }

            /*==========  Upload function  ==========*/

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
                  // scope.chapterFolded.push(scope.lastDeployedPosition.$parentNodeScope.$modelValue.id.toString());
                  // ipCookie('chapterFolded', scope.chapterFolded);
                  // console.log(scope.lastDeployedPosition.$parentNodeScope)
                  // console.log(scope.lastDeployedPosition.$parentNodeScope.$modelValue.title)
                  console.log(scope.lastDeployedPosition.$parentNodeScope)
                  setTimeout(function(){
                    scope.lastDeployedPosition.$parentNodeScope.expand()
                  }, 500);
                  // scope.lastDeployedPosition.$parentNodeScope.toggle()
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
                  Notification.error("You can only upload folder on Chrome")
                } else{
                  activateSpinner()
                  orderFiles(files);
                  uploadItems();
                }
              }
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

        }
      };
    }]);
}());


