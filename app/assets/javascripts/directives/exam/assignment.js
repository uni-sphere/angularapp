(function () {
  angular.module('mainApp.directives')
    .directive('assignment', assignment)

  function assignment(){
    var directive = {
      templateUrl: 'exam/assignment.html',
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope){
      
    }
  }

}());
