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
      }
    };

    return directive;

    function link(scope) {

      scope.triggerDeco = function(){
        // $rootScope.stopWatch()
        if($rootScope.home || $rootScope.sandbox){
          scope.viewHome = true;
          scope.viewDashboard = false;
          $rootScope.admin = false;
          $rootScope.superadmin = false;
        } else{
          $rootScope.deconnection()
        }
      }

      scope.showHome = function(){
        allViewFalse()
        $rootScope.viewHome = true;
      }

      scope.showDashboard = function(){
        allViewFalse()
        $rootScope.help = false;
        $rootScope.viewDashboard = true;
      }

      scope.showExam = function(){
        allViewFalse()
        $rootScope.viewExam = true;
      }

      function allViewFalse(){
        $rootScope.viewExam = false;
        $rootScope.viewHome = false;
        $rootScope.viewDashboard = false;
      }

    }
  }
})();
