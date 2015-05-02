(function () {
	'use strict';
	angular.module('mainApp.directives')
	.directive('adminCo', [ 'Restangular', '$cookies', 'Auth', function(Restangular, $cookies, Auth) {
		return {
			restrict: 'E',
			templateUrl: 'application/admin-co.html',
			scope: {
				admin: '=',
				displayError: '=',
				hideError: '=',
			},
			link: function(scope) {
				
		    //Check if the user is admin
		    scope.admin = Auth.isAuthenticated();
				
				console.log(scope.admin);
				
				scope.toggleAdmin = function(){
					if(scope.open == true){
						scope.open = false;
					} else{
						scope.open = true;
					}
				}
				
				scope.validateAdmin = function(){
					
					////// LOGIN
					var credentials = {
						email: scope.emailInput,
						password: scope.passwordInput
					};

					Auth.login(credentials).then(function(user) {
						console.log(user);
						scope.admin = Auth.isAuthenticated();
						console.log(Auth.isAuthenticated());
					}, function(error) {
						console.log(error);
					});

					// $scope.$on('devise:login', function(event, currentUser) {
// 						// after a login, a hard refresh, a new tab
// 					});
//
// 					$scope.$on('devise:new-session', function(event, currentUser) {
// 						// user logged in by Auth.login({...})
// 					});
					//////
					
				}
					
			}

		}
	}]);
}());