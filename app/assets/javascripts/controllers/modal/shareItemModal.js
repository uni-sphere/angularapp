(function(){
  angular
    .module('mainApp.controllers')
    .controller('ShareItemCtrl', ShareItemCtrl)

  ShareItemCtrl.$inject = ['Restangular', '$scope', 'close', 'itemTitle', 'itemLink', '$timeout', 'Notification'];
  function ShareItemCtrl(Restangular, $scope, close, itemTitle, itemLink, $timeout, Notification){
    Notification.clearAll()

    $scope.itemLink = itemLink;
    $scope.itemTitle = itemTitle;

    $timeout(function() {
      $('.modal-container').removeClass("modal-ready-to-appear");

      selectElementText($('#share-link')[0])

    }, 1000);

    $scope.dismissModal = function(){
      $('.modal-container').addClass("modal-ready-to-disappear")
      close('',300);
    }



    function selectElementText(el) {
      if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select();
      }
      else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(el);
        window.getSelection().addRange(range);
      }
    }

  }
})()
