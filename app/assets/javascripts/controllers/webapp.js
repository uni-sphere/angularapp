(function(){
angular
  .module('mainApp.controllers')
  .controller('WebAppCtrl', ['$scope', '$auth', function ($scope, $auth) {
    console.log("hello")
    if(window.location.host == 'sandbox.unisphere.eu'){
      console.log("Sandbox")
      $scope.sandbox = true
      $scope.admin = true
    } else{
      $auth.validateUser().then(function(){
        $scope.admin = true;
      }, function(){
        $scope.admin = false
      })
    }

  }]);
})();


