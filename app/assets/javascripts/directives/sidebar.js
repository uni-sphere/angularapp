(function () {

  angular.module('mainApp.directives').directive('sidebar', ['$state', '$auth', function($state, $auth) {
    return {
      restrict: 'E',
      templateUrl: 'main/sidebar.html',
      scope: {
        deconnection: '=',
        superadmin: '='
      },
      link: function(scope) {

      }
    }
  }]);
})();
