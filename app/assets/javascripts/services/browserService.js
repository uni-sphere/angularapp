(function () {
  angular
    .module('mainApp.services')
    .service('browserService', browserService)

  browserService.$inject = ['$window'];
  function browserService($window){
    service = {
      analyse: analyse
    }

    return service

    function analyse(){
      var userAgent = $window.navigator.userAgent;
      var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
      for(var key in browsers) {
        if (browsers[key].test(userAgent)) {
          return key;
        }
      };
      return "unknown";
    }
  }

}());
