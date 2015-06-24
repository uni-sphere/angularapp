(function () {
  
  angular.module('mainApp.directives').directive('slide1', ['Restangular', function(Restangular) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide1.html',
      scope: {
      },
      link: function(scope) {
        // $('#call-to-action-wrapper').click(function(){
        //   $(this).toggleClass("call-to-action-hovered");
        // })
      }
    }

  }]);
}());