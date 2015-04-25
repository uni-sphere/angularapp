(function () {
  'use strict';
  angular.module('mainApp.directives').directive('slide3', ['Restangular', function(Restangular) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide3.html',
      scope: {
      },
      link: function(scope) {

        Restangular.one('organizations').get().then(function(response) {
          scope.universities = response;
        }, function(d) {
          console.log("Error while getting the organizations");
          console.log(d);
        });

        scope.saveNewUni = function(){
          var uniToPush = {name: scope.newUniName}
          var uniToPost = {name: scope.newUniName, email: scope.newUniEmail, password: scope.newUniPassword}

          Restangular.all('organizations').post(uniToPost).then(function(d) {
            scope.universities.push(uniToPush);
            scope.newUniName = "";
            scope.newUniEmail = "";
            scope.newUniPassword = "";
          }, function(d){
            console.log("Error while creating the organization");
            console.log(d.data);
            scope.newUniPassword = "";
          });

        };

      }
    }

  }]);
}());