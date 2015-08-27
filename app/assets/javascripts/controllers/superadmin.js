(function(){
angular
  .module('mainApp.controllers')
  .controller('SuperadminCtrl', ['$scope', function ($scope) {

    $scope.superadminEmailRename = function(index){
      var result = prompt('Change the email '+ $scope.listUser[index].name);
      if(result) {
        $scope.listUser[index].email = result;
      }
    }

    $scope.superadminNameRename = function(index){
      var result = prompt('Change the name ' + $scope.listUser[index].name);
      if(result) {
        Restangular.one('user/'+ index).put({'name': result}).then(function(d) {
          $scope.listUser[index].name = result;
          Notification.success("Ok: name changed")
          console.log("Ok: name changed");
        }, function(d) {
          console.log("Error: name changed");
          console.log(d)
          Notification.success("Error: name changed")
        });
      }
    }

    $scope.superadminUserDelete = function(index){
      $scope.listUser.splice(index,1)
    }

  }]);
})();


