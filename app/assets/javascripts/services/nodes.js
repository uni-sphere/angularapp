(function(){
  angular
  .module('myApp')
  .service('Nodes', ['$http', function($http) {
    this.get = function() {
      return $http.get('api/nodes.json');
    }
  }]);
})();