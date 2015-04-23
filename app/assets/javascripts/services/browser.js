// (function () {
//   'use strict';
//   angular
//   .module('mainApp.directives').service('browser', ['$window', function($window) {
//     return function() {
//       var info = [];



//       function findLanguage(){
//         var language = $window.navigator.language;

//         if(language.indexOf("fr") > -1){
//           return "fr"
//         } else{
//           return "en";
//         }

//       }



//       var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
//       for(var key in browsers) {
//         if (browsers[key].test(userAgent)) {
//           return key;
//         }
//       };
//       return 'unknown';

//       return info;


//     }
//   }]);
// }());







(function () {
  'use strict';
  angular
  .module('mainApp.directives').service('browser', ['$window', function($window) {
    return function() {

      var userAgent = $window.navigator.userAgent;
      var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
      for(var key in browsers) {
        if (browsers[key].test(userAgent)) {
          return key;
        }
      };

      return "unknown";

    }
  }]);
}());