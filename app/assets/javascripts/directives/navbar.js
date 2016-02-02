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
      scope.dropDownLanguage = [
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
        // console.log(scope.languageUsed)
        if(scope.languageUsed != undefined){
          listener();
          // Set the default language
          if($translate.use().indexOf("fr") > -1){
            scope.selectedLanguage = {text: 'French', value: 'fr'};
          } else{
            scope.selectedLanguage = {text: 'English', value: 'en'};
          }
        }
      });

      scope.changeLanguage = function(language) {
        if(language.value == 'fr') {
          $translate.use('fr');
        } else {
          $translate.use('en');
        }
      }
    }
  }
})();
