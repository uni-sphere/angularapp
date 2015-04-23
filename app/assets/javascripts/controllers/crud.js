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

          if($scope.list.length == 0){
            $scope.documentAbsent = true;
          }

        }, function() {
          scope.displayError("There was an error deleting: " + nodeToDelete.$modelValue.title);
          console.log("There was an error deleting: " + nodeToDelete.$modelValue.title);
        });
      }
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

      var nodeToCreate ={
        node_id: $scope.nodeEnd[0],
        title: "new chapter",
        parent_id: nodeData.id,
      }

      Restangular.all('chapters').post(nodeToCreate).then(function(d) {
        var a = {title: "new chapter", id: d.id, items: [], depth: nodeData.depth + 1}

        if(nodeData.items == undefined){
          nodeData.items = [a];
        } else{
          nodeData.items.push(a);
        }
        // addToDocumentFoldedCookie(nodeData.id);

        // console.log(scope);
        // console.log(scope.$childNodesScope)
        // console.log(scope.$childNodesScope.$nodesMap)
        // console.log(scope.$childNodesScope.$nodesMap);

        // console.log(scope.$childNodesScope)

        // Expands the containing folder
        if(!$scope.documentAbsent && scope!= undefined){
          scope.expand();
        } 
        // Don't do it if we upload at the root
        else{
          $scope.documentAbsent = false;
        }

      }, function(d) {
        $scope.displayError("Try again to create a chapter");
        console.log("There was an error saving");
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
          var nodeUpdate = {title: result + "." + extension}

          Restangular.one('awsdocuments/' + documentToUpdateId).put(nodeUpdate).then(function(d) {
            itemToUpdate.title = result + "." + extension;

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







  }]);
})();