(function () {
  
  angular.module('mainApp.directives').directive('slide4', ['Restangular', function(Restangular) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide4.html',
      scope: {
      },
      link: function(scope) {

      }
    }
  }]);
}());