(function () {

  angular.module('mainApp.directives')
    .directive('rightTree', ['Restangular', 'browser', '$upload',
                'Notification', 'ipCookie', 'activateSpinner', 'stopSpinner',
                '$window', 'ModalService', 'makeNested', 'createChap', 'downloadItem', '$timeout', function(Restangular, browser,
                $upload, Notification, ipCookie, activateSpinner, stopSpinner, $window, ModalService, makeNested, createChap, downloadItem, $timeout) {
      return {
        restrict: 'E',
        templateUrl: 'webapp/right-tree.html',
        scope:{
          activeNodes: '=',
          nodeEnd: '=',
          files: '=',
          admin: '=',
          chapterFolded: '=',
          activeChapter: '=',
          breadcrumb: '=',
          reloadNodes: '=',
          userId: '=',
          looseFocusItem: '=',
          superadmin: '=',
          home: '=',
          sandbox: '='
        },
        link: function(scope){

          scope.chapterFolded = ipCookie('chapterFolded');
          scope.nodeDropdownSelected = {};
          scope.dropdownSelected = {};

          scope.nodeChangePassword = function(){
            ModalService.showModal({
              templateUrl: "webapp/set-node-password-modal.html",
              controller: "SetNodePswCtrl",
              inputs:{
                name: scope.nodeEnd[1]
              }
            }).then(function(modal) {
              modal.close.then(function(result) {
                if(result){
                  Restangular.one('nodes/'+ scope.nodeEnd[0]).put({password: result, lock: true}).then(function(res) {
                    Notification.success("Password for node " + scope.nodeEnd[1] + " has been set")
                    scope.nodeProtected = true;
                    scope.nodeDropdownOptions = [{text: 'Change password',value: 'change'},{text: 'Share node',value: 'share'}];
                    console.log("Ok: Password for node set");
                  }, function(d) {
                    if(d.status == 403){
                      console.log("Ok: set password cancelled | This node is not yours")
                      Notification.error("Your can't lock this node, it is not yours.")
                    } else{
                      console.log("Error: Set password for node");
                      console.log(d);
                      Notification.error("An error occcured while setting the password")
                    }
                  });
                }
              });
            });
          }

          scope.watchEnterPressed = function($event, item){
            if($event.which == 13){
              $event.preventDefault()
              item.title = $event.currentTarget.innerHTML
              $timeout(function () { $event.target.blur() }, 0, false);
            } else{
              item.title = $event.currentTarget.innerHTML
            }
          }

          scope.toggleProtection = function(d){
            if(scope.nodeProtected){
              Restangular.one('nodes/'+ scope.nodeEnd[0]).put({lock: false, password: ""}).then(function(res) {
                scope.nodeProtected = false;
                scope.nodeDropdownOptions = [{text: 'Share',value: 'share'}];
                console.log("Ok: " + scope.nodeEnd[1] + " has been unlocked")
                Notification.success(scope.nodeEnd[1] + " has been unlocked")
              }, function(d) {
                console.log("Error: unlock node")
                console.log(d);
                Notification.error("Error while unlocking node")
              });
            } else{
              scope.nodeChangePassword()
            }
          }

          scope.$watch('nodeEnd', function(newVals, oldVals){
            if(newVals){
              //Loads docs
              if(scope.nodeEnd){
                // gestion of the lock
                if(scope.nodeEnd[2] != scope.userId && !scope.superadmin){
                  $('#protection-node-container .round-button').attr('disabled', true)
                  $('#protection-node-container .round-button').addClass('protection-file-disabled')
                } else{
                  $('#protection-node-container .round-button').attr('disabled', false)
                  $('#protection-node-container .round-button').removeClass('protection-file-disabled')
                }

                Restangular.one('chapters').get({node_id: scope.nodeEnd[0]}).then(function (res) {
                  scope.nodeProtected = res.locked;

                  if(scope.nodeEnd[2] == scope.userId || scope.superadmin && scope.nodeProtected){
                    scope.nodeDropdownOptions = [{text: 'Share',value: 'share'}, {text: 'Change password',value: 'change'}];
                  } else{
                    scope.nodeDropdownOptions = [{text: 'Share',value: 'share'}];
                  }

                  res.tree.shift()
                  scope.listItems = makeNested(res.tree);
                  if((scope.home && !ipCookie('chapterFolded')) || (scope.sandbox && !ipCookie('chapterFolded'))){
                    addTochapterFolded(scope.listItems[2].id)
                  }
                }, function(d){
                  if(d.status == 404) {
                    console.log("Ok: Node opening cancelled. Node doesn't exist anymore")
                    Notification.warning('This action has been cancelled. One of your colleague deleted this node')
                  } else{
                    console.log("Error: Get document");
                    console.log(d)
                    Notification.error("We temporarly can not display the documents")
                  }
                  scope.reloadNodes()
                });
              }
            }
          });

          scope.$watch('listItems', function(newVals, oldVals) {
            if(newVals){
              if(newVals.length == 0){
                scope.documentAbsent = true;
              } else{
                scope.documentAbsent = false;
              }
              createChap(newVals)
            }
          }, true);

          // We save the number of download
          scope.downloadItem = function(node){
            downloadItem(scope.nodeProtected,node.$modelValue.title, node.$modelValue.doc_id, node.$modelValue.parent, scope.nodeEnd[0])
          }

          // We watch when someone drag and drops a file / folder
          scope.$watch('files', function (newVals, oldVals) {
            if(newVals){
              if(!scope.nodeEnd){
                Notification.error("Select a lead node to upload files")
              } else{
                 console.log("Ok: File Dropped")
                $('#grey-background').fadeIn();
                $('#fileDropped').fadeIn();
              }
            }
          });

          scope.selectDrop = function(position){
            scope.lastDeployedPosition = position;
            upload(scope.files, true);
            $('#fileDropped').fadeOut(300);
            $('#grey-background').fadeOut();
          }

          scope.rootSelected = function(){
            upload(scope.files, true);
            $('#fileDropped').fadeOut();
            $('#grey-background').fadeOut();
          }

          scope.cancelDrop = function(){
            $('#grey-background').fadeOut();
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

          scope.actionNodeOptions = function(){

            /*----------  Rename  ----------*/
            if(scope.nodeDropdownSelected.value == 'change'){
              scope.nodeChangePassword()
            }

            /*----------  Share  ----------*/
            if(scope.nodeDropdownSelected.value == 'share'){
              Restangular.one('chapter/restrain_link').get({id: 0, node_id: scope.nodeEnd[0]}).then(function(res){
                var itemLink = res.link
                ModalService.showModal({
                  templateUrl: "webapp/share-item-modal.html",
                  controller: "ShareItemCtrl",
                  inputs:{
                    itemLink: itemLink,
                    itemTitle: ''
                  }
                }).then(function(modal) {
                  modal.close.then(function(result) {
                  })
                })
              },function(d){
                if(d.status == 404){
                  console.log("Ok: node archived | cannot get share link")
                  Notification.warning("This node has been deleted by its owner")
                  scope.reloadNodes()
                } else{
                  console.log(d);
                  console.log("Error: download doc")
                  Notification.error("Can not get the share link")
                }
              });
            }

            $('.dropdown.active').removeClass('active')
          }

          scope.actionItem = function(item){
            /*----------  Delete  ----------*/
            if(scope.dropdownSelected.value == 'delete'){
              scope.removeItem(item)
              scope.looseFocusItem()
            }

            /*----------  Share  ----------*/
            if(scope.dropdownSelected.value == 'share'){
              if(scope.activeChapter == undefined){
                Restangular.one('awsdocument/restrain_link').get({id: scope.activeFile.$modelValue.doc_id}).then(function(res){
                  var itemLink = res.link


                  ModalService.showModal({
                    templateUrl: "webapp/share-item-modal.html",
                    controller: "ShareItemCtrl",
                    inputs:{
                      itemLink: itemLink,
                      itemTitle: scope.activeFile.$modelValue.title
                    }
                  }).then(function(modal) {
                    modal.close.then(function(result) {
                    })
                  })
                  scope.looseFocusItem()
                },function(d){
                  if(d.status == 404){
                    console.log("Ok: file archived | cannot get share link")
                    Notification.warning("This file has been deleted by its owner")
                    scope.reloadNodes()
                  } else{
                    console.log(d);
                    console.log("Error: download doc")
                    Notification.error("Can not get the share link")
                  }
                });
              } else if (scope.activeFile == undefined) {
                Restangular.one('chapter/restrain_link').get({id: scope.activeChapter.$modelValue.id, node_id: scope.activeChapter.$modelValue.node_id}).then(function(res){
                  var itemLink = res.link


                  ModalService.showModal({
                    templateUrl: "webapp/share-item-modal.html",
                    controller: "ShareItemCtrl",
                    inputs:{
                      itemLink: itemLink,
                      itemTitle: scope.activeChapter.$modelValue.title
                    }
                  }).then(function(modal) {
                    modal.close.then(function(result) {
                    })
                  })

                  scope.looseFocusItem()

                },function(d){
                  if(d.status == 404){
                    console.log(d)
                    console.log("Ok: chapter archived | cannot get share link")
                    Notification.warning("This chapter has been deleted by its owner")
                    scope.reloadNodes()
                  } else{
                    console.log(d);
                    console.log("Error: download doc")
                    Notification.error("Can not get the share link")
                  }
                });
              }
            }

            //Rename
            if(scope.dropdownSelected.value == 'rename'){
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
                        console.log("Object updated");
                      }, function(d) {
                        if (d.status == 403) {
                          console.log("Ok: Rename document forbidden");
                          console.log(d);
                          Notification.warning("This file is not yours");
                        } else if(d.status == 404) {
                          console.log("Ok: Rename file cancelled. Node doesn't exist anymore")
                          Notification.warning('This action has been cancelled. One of you colleague deleted this node')
                          scope.reloadNodes()
                        } else{
                          console.log("Error: Rename document");
                          console.log(d);
                          Notification.error("We can't temporarily rename this file");
                        }
                      });
                    }
                    // Chapters
                    else{
                      Restangular.one('chapters/' + itemToUpdate.id).put({title: result, node_id: scope.nodeEnd[0]}).then(function(res) {
                        itemToUpdate.title = result;
                        itemToUpdate.savedTitle = result;
                        Notification.success("Chapter renamed")
                        console.log("Object updated");
                      }, function(d) {
                        if (d.status == 403) {
                          console.log("Ok: Rename chapter forbidden");
                          console.log(d);
                          Notification.warning("This chapter is not yours");
                        } else if(d.status == 404) {
                          console.log("Ok: Rename file cancelled. Node doesn't exist anymore")
                          Notification.warning('This action has been cancelled. One of you colleague deleted this node')
                          scope.reloadNodes()
                        } else{
                          console.log("Error: Rename chapter");
                          console.log(d);
                          Notification.error("We can't temporarily rename the chapter");
                        }
                      });
                    }
                  }
                })
              })
              scope.looseFocusItem()
            }

            /*----------  Download  ----------*/
            //Download
            if(scope.dropdownSelected.value == 'download'){
              scope.downloadItem(scope.activeFile)
              scope.looseFocusItem()
            }

          }

          // $('.input-rename-item').click(function(){
          //   console.log(this)
          // })

          scope.selectItem = function(node){
            // We remove colors on either files or chapters
            if(scope.activeChapter != undefined){
              scope.activeChapter.$modelValue.selectedItem = false;
            }
            if(scope.activeFile != undefined){
              scope.activeFile.$modelValue.selectedItem = false
            }

            // If we color a chapter
            if(!node.$modelValue.document){
              scope.activeFile = undefined
              node.$modelValue.selectedItem = true;
              scope.activeChapter = node;
              if(scope.userId == scope.activeChapter.$modelValue.user_id || scope.nodeEnd[2] == scope.userId || scope.superadmin){
                scope.dropdownOptions = [{text: 'Rename',value: 'rename'}, {text: 'Share',value: 'share'}, {text: 'Delete',value: 'delete'}];
              } else{
                scope.dropdownOptions = [{text: 'Share',value: 'share'}];
              }
            }
            // If we color a file
            else{
              scope.activeChapter = undefined
              node.$modelValue.selectedItem = true;
              scope.activeFile = node;
              if(scope.userId == scope.activeFile.$modelValue.user_id || scope.nodeEnd[2] == scope.userId || scope.superadmin){
                scope.dropdownOptions = [{text: 'Rename',value: 'rename'}, {text: 'Download',value: 'download'}, {text: 'Share',value: 'share'}, {text: 'Delete',value: 'delete'} ]
              } else{
                scope.dropdownOptions = [{text: 'Download',value: 'download'}, {text: 'Share',value: 'share'}];
              }
            }
          }

          scope.activateChapter = function(node){
              // activate the chapter
            if(!node.$modelValue.document){
              // We remove colors on either files or chapters
              if(scope.activeChapter != undefined){
                scope.activeChapter.$modelValue.selectedItem = false;
              }
              if(scope.activeFile != undefined){
                scope.activeFile.$modelValue.selectedItem = false
              }

              // If we color a chapter
              if(!node.$modelValue.document){
                scope.activeFile = undefined
                if(node.collapsed || node.$modelValue.items.length == 0){
                  node.$modelValue.selectedItem = true;
                  scope.activeChapter = node;
                } else{
                  scope.activeChapter = undefined;
                }
              }
              // If we color a file
              else{
                scope.activeChapter = undefined
                node.$modelValue.selectedItem = true;
                scope.activeFile = node;
              }

              $('.dropdown.active').removeClass('active')
              // toggle the node
              if(node.$modelValue.items.length != 0){
                node.toggle();
                addTochapterFolded(node.$modelValue.id);
              }
            }
          }

          scope.looseFocusItem = function(){
            if(scope.activeChapter != undefined){
              scope.activeChapter.$modelValue.selectedItem = false;
              scope.activeChapter = undefined
            }
            if(scope.activeFile != undefined){
              scope.activeFile.$modelValue.selectedItem = false;
              scope.activeFile = undefined
            }
            $('.dropdown.active').removeClass('active')
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
            // console.log(scope.chapterFolded)
          }

          function isInArray(value, array) {
            return array.indexOf(value.toString()) > -1;
          }

          /*========================================
          =            Delete Documents            =
          ========================================*/

          scope.removeItem = function(node) {
            var parent = node.$parentNodeScope;

            // Delete the documents
            if(node.$modelValue.document){

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
                } else if(d.status == 404) {
                  console.log("Ok: Deletion cancelled node doesn't exist anymore")
                  Notification.warning('This action has been cancelled. One of your colleague deleted this node')
                  scope.reloadNodes()
                } else{
                  console.log("Error: Delete file");
                  console.log(d);
                  Notification.error("We can't temporarily delete the file " + node.$modelValue.title);
                }
              });
            }

            //delete the chapters
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
                } else if(d.status == 404) {
                  console.log("Ok: Deletion cancelled node doesn't exist anymore")
                  Notification.warning('This action has been cancelled. One of your colleague deleted this node')
                  scope.reloadNodes()
                } else{
                  console.log("Error: Delete a chapter");
                  console.log(d);
                  Notification.error("We can't temporarily delete this chapter");
                }
              });
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
                  Notification.warning("This node is not yours. " +folder.name +" was not created.")
                } else if(d.status == 404) {
                  console.log("Ok: chapter creation cancelled. Node doesn't exist anymore")
                  Notification.warning('This action has been cancelled. One of your colleague deleted this node')
                  scope.reloadNodes()
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
                    node_id: scope.nodeEnd[0],
                    chapter_id: nodeDocData.id,
                    content: file
                  }
                }).then(function(fileUploaded) {
                  console.log(fileUploaded.data.user_id)
                  scope.progressionUpload --;
                  var a = {title: fileUploaded.data.title, doc_id: fileUploaded.data.id, document: true, user_id: fileUploaded.data.user_id,  extension: fileUploaded.data.title.split('.').pop()}
                  if(file.type == 'application/pdf'){
                    a.pdf = true;
                  }
                  numberItems ++;
                  console.log("OK document uploaded:" + fileUploaded.data.title);
                  Notification.success(fileUploaded.data.title + " uploaded")
                  if(numberItems == files.length){
                    if(nodeDocData.id != 0){
                      if(dragAndDrop || !scope.activeChapter.$nodeScope.collapsed ){
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
                    nodeDocData.items.unshift(a)
                  }
                }, function(d) {
                  stopSpinner()
                  if (d.status == 403) {
                    console.log("Ok: Upload documents forbidden");
                    Notification.warning("This node is not yours")
                  } else if(d.status == 404) {
                    console.log(d)
                    console.log("Ok: File upload cancelled. Node doesn't exist anymore")
                    Notification.warning('This action has been cancelled. One of your colleague deleted this node')
                    scope.reloadNodes()
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

          function isInArray(value, array) {
            return array.indexOf(value.toString()) > -1;
          }

        }
      }
    }])
}());


