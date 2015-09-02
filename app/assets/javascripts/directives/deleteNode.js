(function () {
  angular.module('mainApp.directives').directive('deleteNode', [function() {
    return {
      restrict: 'E',
      templateUrl: 'webapp/delete-node.html',
      scope: {
        deleteNodeAll: '=',
        deleteNodeTransfer: '=',
        deleteNodeCancel: '=',
        allowTransfer: '=',
        nodeSelectedToDelete: '='
      },
      link: function(scope) {
      }
    }
  }]);
}());
