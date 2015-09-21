(function(){
angular
  .module('mainApp.controllers')
  .controller('AdminCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {

    // Restangular.one('connected').get().then(function (d) {
    //   $scope.active_data = d.activity
    // }, function(d){
    //   console.log(d)
    // });

    // setInterval(function(){
    //   Restangular.one('connected').get().then(function (d) {
    //     $scope.active_data = d.activity
    //   }, function(d){
    //     console.log(d)
    //   });
    // }, 5000);
  }])
})()
