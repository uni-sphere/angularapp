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
        viewHome: '=',
        viewDashboard: '='
      }
    };

    return directive;

    function link(scope) {
      scope.triggerDeco = function(){
        if($rootScope.home || $rootScope.sandbox){
          scope.viewHome = true;
          scope.viewDashboard = false;
          $rootScope.admin = false;
          $rootScope.superadmin = false;
        } else{
          scope.deconnection()
        }
      }

      scope.showHome = function(){
        scope.viewDashboard = false;
        scope.viewHome = true;
      }

      scope.showDashboard = function(){
        scope.viewDashboard = true;
        scope.viewHome = false;
        $rootScope.help = false;
      }
    }
  }
})();
