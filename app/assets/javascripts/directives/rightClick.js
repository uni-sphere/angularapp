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
        // console.log(scope)
        scope.$parent.$element.closest("dropdown").addClass('active')
        // console.log(el.context)
        // console.log(el.context.firstElementChild)
        // console.log(el.context.firstElementChild.closest("dropdown"))
      });
    }
  }

}());
