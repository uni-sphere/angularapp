(function(){
angular
  .module('mainApp.controllers')
  .controller('RestrainCtrl', ['$scope', 'Restangular','Notification', '$state', function ($scope, Restangular, Notification, $state) {

    Restangular.one('organization').get().then(function (university) {
      $scope.university = university.organization.name;
      console.log("Ok: Uni name")
    }, function(d){
      console.log("Error: Get uni name");
      console.log(d)
      Notification.error("Can you please refresh the page, there was an error");
    });

    $scope.home = function(){
      $state.transitionTo('main.application');
    }

  }]);
})();
