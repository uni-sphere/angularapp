(function(){
  angular
    .module('mainApp.controllers')
    .controller('RestrainCtrl', RestrainCtrl)

  RestrainCtrl.$inject = ['$rootScope', '$scope', 'Restangular','Notification', '$state', '$translate'];
  function RestrainCtrl($rootScope, $scope, Restangular, Notification, $state, $translate){
    
    var error;
    
    $translate(['ERROR']).then(function (translations) {
      error = translations.ERROR;
    });
    
    var everythingLoaded = setInterval(function() {
      if (/loaded|complete/.test(document.readyState)) {
        console.log("INITIALISED")
        clearInterval(everythingLoaded);
        $rootScope.contentLoaded = true;
        $scope.$apply()
      }
    }, 50);

    Restangular.one('organization').get().then(function (university) {
      $scope.university = university.organization.name;
      console.log("Ok: Uni name")
    }, function(d){
      console.log("Error: Get uni name");
      console.log(d)
      Notification.error(error);
    });

    $scope.home = function(){
      $state.transitionTo('main.application');
    }
  }

})();
