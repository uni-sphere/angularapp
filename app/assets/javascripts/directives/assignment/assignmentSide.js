(function () {
  angular.module('mainApp.directives')
    .directive('assignmentSide', assignmentSide)

  assignmentSide.$inject = ['$rootScope', 'Restangular', 'Notification', '$translate'];
  function assignmentSide($rootScope, Restangular, Notification, $translate){
    var directive = {
      templateUrl: 'assignment/assignmentSide.html',
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope){
      
    }
  }

}());
