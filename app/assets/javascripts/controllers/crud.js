(function(){
angular
  .module('mainApp.controllers')
  .controller('CrudCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {

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

          if($scope.list.length == 0){
            $scope.documentAbsent = true;
          }

        }, function(d) {
          console.log("There was an error deleting the file");
          console.log(d);
          scope.displayError("Try again to delete the document: " + nodeToDelete.$modelValue.title);
        });
      }

      //delete the chapters
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
    };

    /*===========================================
    =            Create new item                =
    ===========================================*/
    
    $scope.newSubItem = function(scope) {

      console.log(scope);

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

          console.log(result);

          // We check the user didn't change the extension
          if(result.indexOf('.') > -1){
            result = result.split('.')[0];
          }

          console.log(result);

          var nodeUpdate = {title: result + "." + extension}

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

      //If it is a chapter 
      else{
        var chapterToUpdateId = itemToUpdate.id;


        var result = prompt('Change the name of the chapter',scope.title);
        if(result) {

          // Uppercase the first letter
          result = result[0].toUpperCase() + result.slice(1);

          var nodeUpdate = {title: result, node_id: $scope.nodeEnd[0]}

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







  }]);
})();