(function () {
  angular.module('mainApp.directives')
    .directive('adminPopup', ['Restangular','ipCookie', 'Notification', function(Restangular, ipCookie, Notification) {
      return {
        restrict: 'E',
        templateUrl: 'main/admin-popup.html',
        scope: {
          displayAdminPopup: '=',
          showGreyPanel: '=',
          admin: '=',
        },
        link: function(scope) {
          scope.displayAdminPopup = function(){
            scope.showAdmin = true;
            scope.showGreyPanel = true;
          }
          scope.hideAdminPopup = function(){
            scope.showGreyPanel =  false;
            scope.showAdmin = false;
          }
          scope.validateAdmin = function(){
            var connection = {email: scope.emailInput, password:scope.passwordInput}
            Restangular.all('users/login').post(connection).then(function(d) {
              ipCookie('unisphere_api_admin', d.cookie);
              scope.admin = true;
              scope.hideAdminPopup();
            }, function(d){
              scope.passwordInput = "";

              console.log("Impossible to connect");
              console.log(d);
              if(d.headers.status == 404){
                scope.displayError("You misstyped your email")
              } else if(d.headers.status == 403){
                scope.displayError("You misstyped your password");
              } else{
                scope.displayError("Please try again!");
              }

              scope.newUniPassword = "";
            });
          }
        }
      }

  }]);
}());
