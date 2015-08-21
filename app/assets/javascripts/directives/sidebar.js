(function () {

  angular.module('mainApp.directives').directive('sidebar', [function() {
    return {
      restrict: 'E',
      templateUrl: 'main/sidebar.html',
      scope: {
        adminDeco: '=',
      },
      link: function(scope) {
        scope.deconnection = function(){
          scope.adminDeco();
        }


      }
    }
  }]);
})();
