(function(){
  angular
    .module('mainApp.controllers')
    .controller('WebappCtrl', WebappCtrl)

  WebappCtrl.$inject = ['$scope', 'Restangular', 'Notification', 'ipCookie', 'browserService']
  function WebappCtrl($scope, Restangular, Notification, ipCookie, browserService){


  }
})();






