(function(){
  angular
    .module('mainApp.controllers')
    .controller('handInCtrl', handInCtrl)

  handInCtrl.$digest = ['ModalService', 'uploadHandInService', 'handInService', '$timeout', '$rootScope', '$scope', 'Restangular', 'Notification', '$translate'];
  function handInCtrl(ModalService, uploadHandInService, handInService, $timeout, $rootScope, $scope, Restangular, Notification, $translate){
    var newAssignmentNoClass,
      newAssignmentNoTitle;

    $translate(['NEW_ASSIGNMENT_NO_CLASS', 'NEW_ASSIGNMENT_NO_TITLE']).then(function (translations) {
      newAssignmentNoClass = translations.NEW_ASSIGNMENT_NO_CLASS;
      newAssignmentNoTitle = translations.NEW_ASSIGNMENT_NO_TITLE;
    });


    /*----------  Utility function  ----------*/
    


    $scope.downloadHandIn = function(handIn){
      Restangular.one('handins', handIn.id).get().then(function(myHandIn){
        console.log("Ok: get Hand-in")
        console.log(myHandIn)
      }, function(d){
        console.log(d)
        console.log("Error: Get Hand-in")
        Notification.error($rootScope.errorMessage)
      })
    }

    
    
    // Restangular.one('handins', doc_id).get({node_id: node_id, chapter_id: chapter_id}).then(function(mydoc){

    // ModalService.showModal({
    //   templateUrl: "modal/download-handin-modal.html",
    //   controller: "DownloadHandInModalCtrl",
    //   inputs:{
    //     // node_id: node_id,
    //     // chapter_id: chapter_id,
    //     // doc_id: doc_id,
    //     // download: download
    //   }
    // }).then(function(modal) {
    //   modal.close.then(function(result) {
    //   });
    // });


    
  }
})();




