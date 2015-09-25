(function(){
  angular
    .module('mainApp.controllers')
    .controller('DownloadProtectedProtectedDocModal', DownloadProtectedProtectedDocModal)

  DownloadProtectedProtectedDocModal.$inject = ['$scope', 'Restangular', 'close', 'node_id', 'chapter_id', '$timeout', 'Notification', 'preview', 'doc_id', '$translate'];
  function DownloadProtectedProtectedDocModal($scope, Restangular, close, node_id, chapter_id, $timeout, Notification, preview, doc_id, $translate){

    var error,
      forbidden;

    $translate(['ERROR', 'FORBIDDEN']).then(function (translations) {
      error = translations.ERROR;
      forbidden = translations.FORBIDDEN;
    });

    Notification.clearAll()
    $scope.protectedNode = true;
    $scope.node_id = node_id;
    $scope.chapter_id = chapter_id;
    $scope.preview = preview;
    $scope.doc_id = doc_id

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear")
      $('.modal-input').focus()
    }, 1000);

    $scope.dismissModal = function(result) {
      $('.modal-container').addClass("modal-ready-to-disappear")
      close(result, 300);
    };

    $scope.unlockNode = function(password){
      Restangular.one('awsdocuments', $scope.doc_id).get({node_id: $scope.node_id, chapter_id: $scope.chapter_id, password: password}).then(function(mydoc){
        $scope.protectedNode = false
        $scope.linkUrl = mydoc
        $('#modal-download-protected-doc .modal-input').prop('disabled', true)
        $('#modal-download-protected-doc .modal-button').prop('disabled', true)
      },function(d){
        if(d.status == 403){
          console.log("Ok: wrong password to unlock the node")
          Notification.error(forbidden)
          $('.modal-input').focus()
        } else{
          console.log(d);
          console.log("Error: download doc")
          Notification.error(error)
        }
      });
    }

  }
})()
