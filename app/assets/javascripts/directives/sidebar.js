(function () {

  angular.module('mainApp.directives').directive('sidebar', ['$state', '$auth', function($state, $auth) {
    return {
      restrict: 'E',
      templateUrl: 'main/sidebar.html',
      scope: {
        admin: '=',
        accountEmail: '=',
        accountName: '='
      },
      link: function(scope) {
        scope.deconnection = function(){
          if(scope.sandbox){
            scope.admin = false;
            $state.transitionTo('main.application');
          } else{
            $auth.signOut().then(function(resp) {
              console.log("OK: deconnection successful")
              scope.admin = false;
              $state.transitionTo('main.application');

              scope.accountEmail = undefined;
              scope.accountName = undefined;

              if(window.location.host != 'localhost:3000'){
                FHChat.transitionTo('closed');
              }
            }, function(d){
              console.log(d)
              console.log("Impossible to deco")
              Notification.error('Error during deconnection. Please refresh.')
            });
          }
        }
      }
    }
  }]);
})();
