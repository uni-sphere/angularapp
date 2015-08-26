(function(){
angular
  .module('mainApp.controllers')
  .controller('CrudCtrl', ['$scope', 'Restangular', 'Notification', 'ipCookie', function ($scope, Restangular, Notification, ipCookie) {



    /*===========================================
    =            Create new chapter             =
    ===========================================*/
    $scope.dummyId = 100;
    $scope.newSubItem = function() {

      if($scope.activeChapter){
        var nodeData = $scope.activeChapter.$modelValue;
      } else{
        var nodeData = {id: 0};
      }

      var nodeToCreate ={
        node_id: $scope.nodeEnd[0],
        title: "New chapter",
        parent_id: nodeData.id,
      }

      if($scope.home || $scope.sandbox){
        Notification.success("Chapter created")
        $scope.dummyId ++;
        if(nodeData.items == undefined){
          depth = 0
        } else{
          depth = nodeData.depth + 1;
        }
        var a = {title: "New chapter", id: $scope.dummyId, items: [], depth: depth }

        if(nodeData.items == undefined){
          $scope.listItems.push(a);
        } else{
          nodeData.items.push(a);
        }

        $scope.documentAbsent = false;
      }
      // Real Version
      else{
        Restangular.all('chapters').post(nodeToCreate).then(function(d) {
          Notification.success("Chapter created")
          if(nodeData.items == undefined){
            depth = 0
          } else{
            depth = nodeData.depth + 1;
          }
          var a = {title: "New chapter", id: d.id, items: [], depth: depth }

          if(nodeData.items == undefined){
            $scope.listItems.push(a);
          } else{
            nodeData.items.push(a);
          }

          if(nodeData.id != 0 && $scope.chapterFolded.indexOf(nodeData.id.toString()) == -1){
            $scope.chapterFolded.push(nodeData.id.toString());
            ipCookie('chapterFolded', $scope.chapterFolded);
          }


          $scope.documentAbsent = false;

        }, function(d) {
          if (d.status == 403) {
            console.log('Ok: Chapter creation not allowed');
            Notification.warning("This node is not yours");
          } else if(d.status == 402) {
            console.log("Ok: Chapter creation cancelled. Node doesn't exist anymore")
            Notification.warning('This action has been cancelled. One of you colleague deleted this node')
            $scope.reloadNodes()
          } else{
            console.log("Error: Create a chapter");
            console.log(d);
            Notification.error("We can't temporarily create a chapter");
          }
        });
      }

    };


    /*====================================
    =            Rename items            =
    ====================================*/

    $scope.renameItems = function(scope){
      var itemToUpdate = scope.$modelValue;

      //If it is a document
      if(itemToUpdate.document){
        var extension = itemToUpdate.title.split('.')[1];
        var documentToUpdateId = itemToUpdate.doc_id;

        var result = prompt('Change the name of the document',scope.title);
        if(result) {

          // We check the user didn't change the extension
          if(result.indexOf('.') > -1){
            result = result.split('.')[0];
          }

          var nodeUpdate = {title: result + "." + extension}

          // Demo version
          if($scope.home || $scope.sandbox){
            itemToUpdate.title = result + "." + extension;
          }
          // Real version
          else{
            Restangular.one('awsdocuments/' + documentToUpdateId).put(nodeUpdate).then(function(d) {
              itemToUpdate.title = result + "." + extension;
              Notification.success("File renamed")
              console.log("Object updated");
            }, function(d) {
              if (d.status == 403) {
                console.log("Ok: Rename document forbidden");
                console.log(d);
                Notification.warning("This file is not yours");
              } else if(d.status == 402) {
                console.log("Ok: Rename file cancelled. Node doesn't exist anymore")
                Notification.warning('This action has been cancelled. One of you colleague deleted this node')
                $scope.reloadNodes()
              } else{
                console.log("Error: Rename document");
                console.log(d);
                Notification.error("We can't temporarily rename this file");
              }
            });
          }
        }
      }

      //If it is a chapter
      else{
        var chapterToUpdateId = itemToUpdate.id;

        var result = prompt('Change the name of the chapter',scope.title);
        if(result) {

          // Uppercase the first letter
          result = result[0].toUpperCase() + result.slice(1);

          var nodeUpdate = {title: result, node_id: $scope.nodeEnd[0]}

          // Demo version
          if($scope.home || $scope.sandbox){
            itemToUpdate.title = result;
          }
          // Real version
          else{
            Restangular.one('chapters/' + chapterToUpdateId).put(nodeUpdate).then(function(d) {
              itemToUpdate.title = result;
              Notification.success("Chapter renamed")
              console.log("Object updated");
            }, function(d) {
              if (d.status == 403) {
                console.log("Ok: Rename chapter forbidden");
                console.log(d);
                Notification.warning("This chapter is not yours");
              } else if(d.status == 402) {
                console.log("Ok: Rename file cancelled. Node doesn't exist anymore")
                Notification.warning('This action has been cancelled. One of you colleague deleted this node')
                $scope.reloadNodes()
              } else{
                console.log("Error: Rename chapter");
                console.log(d);
                Notification.error("We can't temporarily rename the chapter");
              }
            });
          }
        }
      }
    }

  }]);
})();
