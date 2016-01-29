(function () {

  angular
    .module('mainApp.controllers')
    .controller('createChapterCtrl', createChapterCtrl);

  createChapterCtrl.$inject = ['cookiesService', '$rootScope', '$scope', 'Restangular', 'Notification', 'ipCookie', 'createIndexChaptersService', '$translate']
  function createChapterCtrl(cookiesService, $rootScope, $scope, Restangular, Notification, ipCookie, createIndexChaptersService, $translate){
    
    var error,
      success,
      forbidden,
      cancel_warning,
      new_chapter;
      
    $translate(['ERROR', 'NW_CANCEL', 'SUCCESS', 'FORBIDDEN', 'NEW_CHAPTER_NAME']).then(function (translations) {
      error = translations.ERROR;
      forbidden = translations.FORBIDDEN;
      cancel_warning = translations.NW_CANCEL;
      new_chapter = translations.NEW_CHAPTER_NAME;
    });
    
    $scope.newChapter = function() {

      // If we have an activeChapter, it means we have a parent to create the chapter in
      if($scope.activeChapter){
        var parent_id = $scope.activeChapter.$modelValue.id;
      } else{
        var parent_id = 0;
      }

      var nodeToCreate ={
        node_id: $rootScope.nodeEnd[0],
        title: new_chapter,
        parent_id: parent_id
      }

      Restangular.all('chapters').post(nodeToCreate).then(function(newChapter) {

        // We save the depth of the new chapter
        if(parent_id == 0){
          depth = 0
        } else{
          depth = $scope.activeChapter.$modelValue.depth + 1;
        }

        var chapterToCreate = {title: new_chapter, node_id: $rootScope.nodeEnd[0],id: newChapter.id, items: [], depth: depth, user_id: newChapter.user_id}

        // If we have no parent, we create the chapter directly at the root
        if(parent_id == 0){
          $rootScope.listItems.push(chapterToCreate);
        }
        // If we have a parent we create the chapter in the parent items
        else{
          $scope.activeChapter.$modelValue.items.push(chapterToCreate);
        }

        // In case we create a chapter in a chapter that did have any items, we open this chapter and save it in cookies
        if(parent_id != 0 && $rootScope.foldedChapters.indexOf($scope.activeChapter.$modelValue.id) == -1){
          $rootScope.foldedChapters.push($scope.activeChapter.$modelValue.id);
          ipCookie('foldedChapters', $rootScope.foldedChapters);
        }

        // We index the chapters
        createIndexChaptersService.create($rootScope.listItems)

      }, function(d) {
        if(d.status == 403) {
          console.log('Ok: Chapter creation not allowed');
          Notification.warning(forbidden);
        } else if(d.status == 404) {
          console.log("Ok: Chapter creation cancelled. Node doesn't exist anymore")
          Notification.warning(cancel_warning)
          cookiesService.reload()
        } else{
          console.log("Error: Create a chapter");
          Notification.error(error);
        }
        console.log(d);
      });
    }
  }
})();
