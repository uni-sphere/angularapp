(function () {
  'use strict';
  angular.module('mainApp.directives').directive('sidebar', [function() {
    return {
      restrict: 'E',
      templateUrl: 'main/sidebar.html',
      scope: {
        adminDeco: '=',
        sidebarMinified: '='
      },
      link: function(scope) {

        var tid=setInterval(function(){
          if("complete"===document.readyState){

            clearInterval(tid);
            var a = document.querySelector.bind(document);
            var c = document.querySelector(".wrapper")

            scope.deconnection = function(){
              c.classList.add("wrapper__minify");
              scope.adminDeco();
            }

            var d = document.getElementById("js-menu")
            var e = d.querySelectorAll(".menu--item__has_sub_menu");

            a(".toggle_menu").onclick=function(){

              var b = document.querySelector(".vertical_nav")
              var c = document.querySelector(".wrapper")
              

              b.classList.toggle("vertical_nav__opened")
              c.classList.toggle("toggle-content")
            }

            a(".collapse_menu").onclick=function(){
              if(scope.sidebarMinified == true){
                scope.sidebarMinified = false;
              }else{
                scope.sidebarMinified = true;
              }
              scope.$apply();
              var b = document.querySelector(".vertical_nav")
              var c = document.querySelector(".wrapper")

              b.classList.toggle("vertical_nav__minify");
              c.classList.toggle("wrapper__minify");
              for(var a=0;a<e.length;a++)e[a].classList.remove("menu--subitens__opened")
            };

            for(var f=0;f<e.length;f++)e[f].classList.contains("menu--item__has_sub_menu")&&e[f].addEventListener("click",function(a){a.preventDefault();
            for(var b=0;b<e.length;b++)this!=e[b]&&e[b].classList.remove("menu--subitens__opened");
            this.classList.toggle("menu--subitens__opened")},!1)

          }
        },100);
      }
    }

  }]);
}());