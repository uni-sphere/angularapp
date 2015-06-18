(function () {
  'use strict';
  angular.module('mainApp.directives').directive('firstCo', [ function() {
    return {
      restrict: 'E',
      templateUrl: 'main/first-co.html',
      scope: {
        firstConnection: '='
      },
      link: function(scope) {

        scope.leftAdvise = true
        // Function to change Node
        scope.TransitionRightAdvise = function(){
          scope.leftAdvise = false
          scope.rightAdvise = true
        }

        scope.TransitionLeftAdvise = function(){
          scope.leftAdvise = true
          scope.rightAdvise = false
        }

        scope.closeAdvise = function(){
          scope.rightAdvise = false
          scope.firstConnection = false
        }

      }
    }

  }]);
}());
