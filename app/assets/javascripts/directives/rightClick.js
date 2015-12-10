(function () {
  angular.module('mainApp.directives')
    .directive('rightClick', rightClick)

  function rightClick(){
    var directive = {
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope, el){
      el.bind("contextmenu", function (e) {
        e.preventDefault();
      });
    }
  }

}());
