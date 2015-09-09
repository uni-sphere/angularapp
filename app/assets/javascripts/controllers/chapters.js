(function(){
angular
  .module('mainApp.controllers')
  .controller('ChaptersCtrl', ['$scope', 'Restangular','Notification', 'chapter_id', function ($scope, Restangular, Notification, chapter_id) {

    Restangular.one('chapters', chapter_id).get().then(function(flatChapters){
      console.log(flatChapters)
    },function(d){
      console.log(d);
      console.log("Error: getting restrained chapters")
      Notification.error("Error while getting the chapters")
    });



  }]);
})();
