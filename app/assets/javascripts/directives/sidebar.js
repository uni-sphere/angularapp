(function () {

  angular.module('mainApp.directives').directive('sidebar', ['$state', '$auth', function($state, $auth) {
    return {
      restrict: 'E',
      templateUrl: 'main/sidebar.html',
      scope: {
        deconnection: '=',
        superadmin: '=',
        sandbox: '=',
        viewhome: '=',
        viewdashboard: '=',
        home: '=',
        admin: '=',
        reloadNodes: '=',
        reloadGraph: '='
      },
      link: function(scope) {

        scope.triggerDeco = function(){
          if(scope.home){
            scope.viewhome = true;
            scope.viewdashboard = false;
            scope.admin = false;
            scope.superadmin = false;

          } else{
            scope.deconnection()
          }
        }

        scope.showHome = function(){
          scope.viewdashboard = false;
          scope.viewhome = true;
          scope.reloadNodes();
        }

        scope.showDashboard = function(){
          scope.viewdashboard = true;
          scope.viewhome = false;
          scope.reloadGraph($('.test-app-content').width(), $('.test-app-content').height());
        }
      }
    }
  }]);
})();
