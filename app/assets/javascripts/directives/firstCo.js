(function () {
  'use strict';
  angular.module('mainApp.directives').directive('firstCo', [ function() {
    return {
      restrict: 'E',
      templateUrl: 'main/first-co.html',
      scope: {
      },
      link: function(scope) {

        scope.leftAdvise = true
        // Function to change Node
        scope.TransitionRightAdvise = function(){
          scope.leftAdvise = false
          scope.rightAdvise = true
          scope.sidebarAdvise = false
        }

        scope.TransitionLeftAdvise = function(){
          scope.leftAdvise = true
          scope.rightAdvise = false
        }

        scope.TransitionSidebarAdvise = function(){
          scope.rightAdvise = false
          scope.sidebarAdvise = true
        }

        scope.closeAdvise = function(){
          scope.sidebarAdvise = false
          $('#first-connection').fadeOut(200)
        }

      }
    }

  }]);
}());
