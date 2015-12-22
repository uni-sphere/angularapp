(function () {
  angular.module('mainApp.directives')
    .directive('studentHandInSide', studentHandInSide)

  studentHandInSide.$inject = ['$rootScope', 'Restangular', 'Notification', '$translate'];
  function studentHandInSide($rootScope, Restangular, Notification, $translate){
    var directive = {
      templateUrl: 'assignment/studentHandInSide.html',
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope){
      
    }
  }

}());
