(function(){
angular
  .module('mainApp.controllers')
  .controller('CrudCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {

    /*========================================
    =            Delete Documents            =
    ========================================*/

    var dummyId = 30;

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
