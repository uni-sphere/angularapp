(function () {
  angular.module('mainApp.directives')
    .directive('assignment', assignment)

  assignment.$inject = ['$rootScope', 'Restangular', 'Notification', '$translate'];
  function assignment($rootScope, Restangular, Notification, $translate){
    var directive = {
      templateUrl: 'exam/assignment.html',
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope){
      
    }
  }

}());
