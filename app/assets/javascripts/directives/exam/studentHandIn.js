(function () {
  angular.module('mainApp.directives')
    .directive('studentHandIn', studentHandIn)

  studentHandIn.$inject = ['$rootScope', 'Restangular', 'Notification', '$translate'];
  function studentHandIn($rootScope, Restangular, Notification, $translate){
    var directive = {
      templateUrl: 'exam/studentHandIn.html',
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope){
      
    }
  }

}());
