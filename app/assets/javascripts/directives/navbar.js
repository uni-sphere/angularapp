(function () {

  angular.module('mainApp.directives').directive('navbar', [ '$translate', function($translate) {
    return {
      restrict: 'E',
      templateUrl: 'main/navbar.html',
      scope: {
        university: '=',
        accountEmail: '='
      },
      link: function(scope) {
        // Languages options
        scope.ddSelectOptions = [
          {
            text: 'Français',
            value: 'fr'
          },
          {
            text: 'English',
            value: 'en'
          }
        ];

        // Set the default language
        if($translate.use().indexOf("fr") > -1){
          scope.ddSelectSelected = {text: 'French', value: 'fr'};
        } else{
          scope.ddSelectSelected = {text: 'English', value: 'en'};
        }

        scope.changeLanguage = function() {
          if (scope.ddSelectSelected.value == 'fr') {
            $translate.use('fr');
          } else {
            $translate.use('en');
          }
          console.log($translate.use());
        }

      }
    }
  }]);
})();
