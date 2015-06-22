(function(){
angular
  .module('mainApp.controllers')
  .controller('CrudCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {

    /*========================================
    =            Delete Documents            =
    ========================================*/

    var dummyId = 30;

    $scope.closeViewDocumentRename = function(){
      $('#view-document-rename-popup').slideUp(400);
    }


    $scope.removeItem = function(scope) {
      var nodeToDelete = scope;
      var parent = nodeToDelete.$parentNodeScope;

      // Delete the documents
      if(nodeToDelete.$modelValue.document){

        // Demo mode
        if($scope.home || $scope.sandbox){
          nodeToDelete.remove();

          if($scope.list.length == 0){
            $scope.documentAbsent = true;
          }
        }
        // Normal mode
        else{
          Restangular.all('awsdocuments/' + nodeToDelete.$modelValue.doc_id).remove().then(function() {
            nodeToDelete.remove();
            console.log("document deleted");

            if($scope.list.length == 0){
              $scope.documentAbsent = true;
            }
          }, function(d) {
            console.log("There was an error deleting the file");
            console.log(d);
            scope.displayError("Try again to delete the document: " + nodeToDelete.$modelValue.title);
          });
        }
      }

      //delete the chapters
      else{
        // Demo mode
        if($scope.home || $scope.sandbox){
          nodeToDelete.remove();

          if($scope.list.length == 0){
            $scope.documentAbsent = true;
          }
        }
        // Normal mode
        else{
          Restangular.all('chapters/' + nodeToDelete.$modelValue.id).remove({node_id: $scope.nodeEnd[0]}).then(function() {
            nodeToDelete.remove();
            console.log("chapter deleted");

            if($scope.list.length == 0){
              $scope.documentAbsent = true;
            }
          }, function(d) {
            console.log("There was an error deleting the chapter");
            console.log(d);
            scope.displayError("Try again to delete the chapter: " + nodeToDelete.$modelValue.title);
          });
        }
      }
    };

    /*===========================================
    =            Create new chapter             =
    ===========================================*/

    $scope.newSubItem = function(scope) {

      if(scope == undefined){
        var nodeData = {id: 0};
      } else{
        var nodeData = scope.$modelValue;
      }

      var nodeToCreate ={
        node_id: $scope.nodeEnd[0],
        title: "New chapter",
        parent_id: nodeData.id,
      }

      if($scope.home || $scope.sandbox){
        dummyId ++;
        if(nodeData.items == undefined){
          depth = 0
        } else{
          depth = nodeData.depth + 1;
        }
        var a = {title: "New chapter", id: dummyId, items: [], depth: depth }

        if(nodeData.items == undefined){
          $scope.list.push(a);
        } else{
          nodeData.items.push(a);
        }

        // Expands the containing folder
        if(!$scope.documentAbsent && scope!= undefined){
          scope.expand();
        }
        // Don't do it if we upload at the root
        else{
          $scope.documentAbsent = false;
        }
      }
      // Real Version
      else{
        Restangular.all('chapters').post(nodeToCreate).then(function(d) {
          if(nodeData.items == undefined){
            depth = 0
          } else{
            depth = nodeData.depth + 1;
          }
          var a = {title: "New chapter", id: d.id, items: [], depth: depth }

          if(nodeData.items == undefined){
            $scope.list.push(a);
          } else{
            nodeData.items.push(a);
          }

          // Expands the containing folder
          if(!$scope.documentAbsent && scope!= undefined){
            scope.expand();
          }
          // Don't do it if we upload at the root
          else{
            $scope.documentAbsent = false;
          }

        }, function(d) {
          console.log("Impossible to create the chapter");
          console.log(d);
          $scope.displayError("Try again to create the chapter");

        });
      }

    };

    /*====================================
    =            Rename items            =
    ====================================*/

    $scope.renameItems = function(scope){
      $scope.itemToUpdate = scope.$modelValue;
      $('#view-document-rename-popup').slideDown(400);
    }

    $scope.saveViewDocumentRename = function(){
      console.log($scope.itemToUpdate)
      //If it is a document
      if($scope.itemToUpdate.document){
        var extension = $scope.itemToUpdate.title.split('.')[1];
        var documentToUpdateId = $scope.itemToUpdate.doc_id;

        if($scope.updateNameItem != undefined) {

          // We check the user didn't change the extension
          if(result.indexOf('.') > -1){
            result = result.split('.')[0];
          }

          var nodeUpdate = {title: result + "." + extension}

          // Demo version
          if($scope.home || $scope.sandbox){
            $scope.itemToUpdate.title = result + "." + extension;
          }
          // Real version
          else{
            Restangular.one('awsdocuments/' + documentToUpdateId).put(nodeUpdate).then(function(d) {
              $scope.itemToUpdate.title = result + "." + extension;

              console.log("Object updated");
            }, function(d) {
              console.log("There was an error updating the document");
              console.log(d);
              scope.displayError("Try again to change this document's name");
            });
          }
        }
      }

      //If it is a chapter
      else{
        var chapterToUpdateId = $scope.itemToUpdate.id;

        if($scope.updateNameItem) {
          console.log("hello")
          // Uppercase the first letter
          result = result[0].toUpperCase() + result.slice(1);

          var nodeUpdate = {title: result, node_id: $scope.nodeEnd[0]}

          // Demo version
          if($scope.home || $scope.sandbox){
            $scope.itemToUpdate.title = result;
          }
          // Real version
          else{
            Restangular.one('chapters/' + chapterToUpdateId).put(nodeUpdate).then(function(d) {
              $scope.itemToUpdate.title = result;

              console.log("Object updated");
            }, function(d) {
              console.log("There was an error updating");
              console.log(d);
              scope.displayError("Try again to change this chapter's name");
            });
          }
        }
      }
    }







  }]);
})();
