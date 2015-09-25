(function () {

  angular
    .module('mainApp.directives')
    .directive('sidebar', sidebar)

  sidebar.$inject = ['cookiesService', '$rootScope', '$state', '$auth']
  function sidebar(cookiesService, $rootScope, $state, $auth){
    var directive = {
      link: link,
      templateUrl: 'main/sidebar.html',
      scope:{
        deconnection: '=',
        viewhome: '=',
        viewdashboard: '='
      }
    };

    return directive;

    function link(scope) {
      scope.triggerDeco = function(){
        if(scope.home){
          $rootScope.viewhome = true;
          $rootScope.viewdashboard = false;
          scope.admin = false;
          scope.superadmin = false;
        } else{
          scope.deconnection()
        }
      }

      scope.showHome = function(){
        $rootScope.viewdashboard = false;
        $rootScope.viewhome = true;
        // cookiesService.reload()
      }

      scope.showDashboard = function(){
        $rootScope.viewdashboard = true;
        $rootScope.viewhome = false;
        // scope.reloadGraph($('.test-app-content').width(), $('.test-app-content').height());
      }
    }
  }
})();
