(function () {
  
  angular.module('mainApp.directives').directive('firstCo', ['$auth', function($auth) {
    return {
      restrict: 'E',
      templateUrl: 'main/first-co.html',
      scope: {
        help: '='
      },
      link: function(scope) {

        scope.leftAdvise = true
        // Function to change Node
        scope.TransitionRightAdvise = function(){
          scope.leftAdvise = false
          scope.rightAdvise = true
          scope.sidebarAdvise = false
        }

        scope.TransitionLeftAdvise = function(){
          scope.leftAdvise = true
          scope.rightAdvise = false
        }

        scope.TransitionSidebarAdvise = function(){
          scope.rightAdvise = false
          scope.sidebarAdvise = true
        }

        scope.closeAdvise = function(){
          scope.sidebarAdvise = false
          $('#first-connection').fadeOut(200)
          scope.help = false
          $auth.updateAccount({help: false})
          .then(function(resp) {
            console.log('help set to false')
          })
          .catch(function(resp) {
            console.log(resp)
          });
        }

      }
    }

  }]);
}());
