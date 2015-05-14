(function () {
  'use strict';
  angular.module('mainApp.directives').directive('slide5', ['Restangular', function(Restangular) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide5.html',
      scope: {
      },
      link: function(scope) {


        

        // --------------------------
        // Contact page text hovering -------------------------------
        // --------------------------

        var contactHover ={
          init: function() {
            $('.icon-hover, .regular-link').click(function(e){
              e.stopPropagation();
            });

            $('.icon-hover').hover(
              function(e) {
                $(this).css('overflow', 'visible');
                $(this).find('.hover-text')
                  .show()
                  .css('opacity', 0)
                  .delay(200)
                  .animate(
                    {
                      paddingTop: '25px',
                      opacity: 1
                    },
                    'fast',
                    'linear'
                  );
              },
              function(e) {
                var obj = $(this);
                $(this).find('.hover-text')
                  .animate(
                    {
                      paddingTop: '0',
                      opacity: 0
                    },
                    'fast',
                    'linear',
                    function() {
                      $(this).hide();
                      $( obj ).css('overflow', 'hidden');
                    }
                  );
              }
            );
          }
        }



        contactHover.init();

      }
    }

  }]);
}());