(function () {

  angular
    .module('mainApp.controllers')
    .controller('createChapterCtrl', createChapterCtrl);

  createChapterCtrl.$inject = ['$scope', 'Restangular', 'Notification', 'ipCookie']
  function createChapterCtrl($scope, Restangular, Notification, ipCookie){

    $scope.newChapter = function() {
      newChapter()
    }

    function newChapter(){

      // If we have an activeChapter, it means we have a parent to create the chapter in
      if($scope.activeChapter){
        var parent_id = $scope.activeChapter.$modelValue.id;
      } else{
        var parent_id = 0;
      }

      var nodeToCreate ={
        node_id: $scope.nodeEnd[0],
        title: "New chapter",
        parent_id: parent_id
      }

      Restangular.all('chapters').post(nodeToCreate).then(function(newChapter) {
        Notification.success("Chapter created")

        // We save the depth of the new chapter
        if(parent_id == 0){
          depth = 0
        } else{
          depth = $scope.activeChapter.$modelValue.depth + 1;
        }
        var chapterToCreate = {title: "New chapter", node_id: newChapter.node_id, id: $scope.nodeEnd[0], items: [], depth: depth, user_id: newChapter.user_id}

        // If we have no parent, we create the chapter directly at the root
        if(parent_id == 0){
          $scope.listItems.push(chapterToCreate);
        }
        // If we have a parent we create the chapter in the parent items
        else{
          $scope.activeChapter.$modelValue.items.push(chapterToCreate);
        }

        // In case we create a chapter in a chapter that did have any items, we open this chapter and save it in cookies
        if(parent_id != 0 && $scope.chapterFolded.indexOf($scope.activeChapter.$modelValue.id) == -1){
          $scope.chapterFolded.push($scope.activeChapter.$modelValue.id);
          ipCookie('chapterFolded', $scope.chapterFolded);
        }

        // We remove the document absent view
        $scope.documentAbsent = false;

      }, function(d) {
        if (d.status == 403) {
          console.log('Ok: Chapter creation not allowed');
          Notification.warning("Error while creating the chapter, please refresh.");
        } else if(d.status == 404) {
          console.log("Ok: Chapter creation cancelled. Node doesn't exist anymore")
          Notification.warning('This action has been cancelled. One of you colleague deleted this node.')
          $scope.reloadNodes()
        } else{
          console.log("Error: Create a chapter");
          console.log(d);
          Notification.error("Error while creating the chapter, please refresh.");
        }
      });
    }
  }
})();
