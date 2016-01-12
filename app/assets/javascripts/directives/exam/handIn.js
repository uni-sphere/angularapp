(function () {
  angular.module('mainApp.directives')
    .directive('handIn', handIn)

  function handIn(){
    var directive = {
      templateUrl: 'exam/handIn.html',
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope){
      
    }
  }

}());
