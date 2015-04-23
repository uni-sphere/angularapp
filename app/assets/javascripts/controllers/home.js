(function(){
angular
  .module('mainApp.controllers')
  .controller('HomeCtrl', ['$scope', '$cookies', 'Restangular', function ($scope, $cookies, Restangular) {

    $scope.newUni = "";

    Restangular.one('organizations').get().then(function(response) {
      $scope.universities = response;
    }, function() {
      console.log("error");
    });

    $scope.saveNewUni = function(){
      uniToPush = {name: $scope.newUniName}
      uniToPost = {name: $scope.newUniName, email: $scope.newUniEmail, password: $scope.newUniPassword}

      Restangular.all('organizations').post(uniToPost).then(function(d) {
        $scope.universities.push(uniToPush);
        $scope.newUniName = "";
        $scope.newUniEmail = "";
        $scope.newUniPassword = "";
      }, function(){
        console.log("error");
        $scope.newUniPassword = "";
      });

    };
  }]);
})();


