(function () {
  'use strict';

  angular.module('mainApp.directives')
  .directive('accountGestion', [ function() {
    
    return {
      restrict: 'E',
      templateUrl: 'main/account-gestion.html',
      scope: {
        admin: '=',
        displayError: '=',
        hideError: '=',
        accountForgotten: '=',
        accountSignup: '='
      },
      link: function(scope, element) {

        scope.closeAccountSignup = function(){
          scope.accountSignup = false;
        }
        scope.closeAccountForgotten = function(){
          scope.accountForgotten = false;
        }
      }
    };
  }]);
}());