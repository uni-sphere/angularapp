// (function(){
// angular
//   .module('myApp')
//   .factory('chapters', ['$http', function($http){
//     return{
//       get: function(){
//         return $http.get('api/chapters.json').then(function(response){
//             return response.data;
//         });
//       }
//     }
//   }])
// })();

(function(){
  angular
  .module('myApp')
  .service('chapters', ['$http', function($http) {
    // delete $http.defaults.headers.common['X-Requested-With'];
    this.get = function() {
      return $http.get('api/chapters.json');
    }
  }]);
})();