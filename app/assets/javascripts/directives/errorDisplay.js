(function () {
  'use strict';
  angular.module('mainApp.directives')
    .directive('errorDisplay', [function() {
      return {
        restrict: 'E',
        templateUrl: 'main/error-display.html',
        scope: {
          displayError: '=',
        },
        link: function(scope) {
          scope.displayError = function(errorString){
            if(scope.listError == undefined || scope.listError.length == 0){
               scope.listError = [errorString];
            } else{
              scope.listError.push(errorString);
            }
            scope.showError = true;
          }

          scope.hideError = function(){
            scope.listError = [];
            scope.showError = false;
          }

        }
      }

  }]);
}());