(function () {

  angular
    .module('mainApp.directives')
    .directive('navbar', navbar)

  function navbar($translate){
     var directive = {
      templateUrl: 'main/navbar.html',
      scope: {
      },
      link: link
    };
    return directive;

    function link(scope){
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

      scope.languageUsed = $translate.use()

      var listener = scope.$watch('languageUsed', function (newVals, oldVals) {
        console.log(scope.languageUsed)
        if(scope.languageUsed != undefined){
          listener();
          // Set the default language
          if($translate.use().indexOf("fr") > -1){
            scope.ddSelectSelected = {text: 'French', value: 'fr'};
          } else{
            scope.ddSelectSelected = {text: 'English', value: 'en'};
          }
        }
      });



      scope.changeLanguage = function() {
        if (scope.ddSelectSelected.value == 'fr') {
          $translate.use('fr');
        } else {
          $translate.use('en');
        }
      }
    }
  }
})();
