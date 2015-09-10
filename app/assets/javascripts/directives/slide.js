(function () {

  angular.module('mainApp.directives').directive('slide', [function() {
    return {
      restrict: 'E',
      templateUrl: 'home/slide.html',
      scope: {
        sandbox: '=',
        home: '='
      },
      link: function(scope) {



      }
    }

  }]);
}());
