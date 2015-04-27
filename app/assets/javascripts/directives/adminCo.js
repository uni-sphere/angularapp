(function () {
  'use strict';
  angular.module('mainApp.directives')
    .directive('adminCo', [ 'Restangular', '$cookies', function(Restangular, $cookies) {
      return {
        restrict: 'E',
        templateUrl: 'application/admin-co.html',
        scope: {
          admin: '=',
          displayError: '=',
          hideError: '='
        },
        link: function(scope) {
          scope.toggleAdmin = function(){
            if(scope.open == true){
              scope.open = false;
            } else{
              scope.open = true;
            }
          }
          scope.validateAdmin = function(){
            var connection = {email: scope.emailInput, password:scope.passwordInput}
            Restangular.all('users/login').post(connection).then(function(d) {
              // console.log(d);
              $cookies.put('unisphere_api_admin', d.cookie);
              scope.admin = true;
            }, function(d){
              scope.passwordInput = "";

              console.log("Impossible to connect");
              console.log(d);
              if(d.status == 404){
                scope.displayError("You misstyped your email")
              } else if(d.status == 403){
                scope.displayError("You misstyped your password");
              } else{
                scope.displayError("Please try again!");
              }

              scope.newUniPassword = "";
            });
          }
        }

      }
  }]);
}());