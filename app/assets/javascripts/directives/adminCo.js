(function () {
	'use strict';
	angular.module('mainApp.directives')
	.directive('adminCo', [ 'Restangular', '$cookies', '$auth', function(Restangular, $cookies, $auth) {
		return {
			restrict: 'E',
			templateUrl: 'application/admin-co.html',
			scope: {
				admin: '=',
				displayError: '=',
				hideError: '=',
			},
			link: function(scope) {
				
				////// SET INITIAL ADMIN
				if ($cookies.get('auth_headers') != undefined) {
					if ($cookies.get('auth_headers').indexOf("access-token") > -1) {
						scope.admin = true;
					}
				} else {
					scope.admin = false;
				}
				//////
				
				scope.toggleAdmin = function(){
					if(scope.open == true){
						scope.open = false;
					} else{
						scope.open = true;
					}
				}
				
				////// PASSWORD FORGOTTEN
				scope.passwordForgotten = function() {
					var credentials = {
						email: scope.emailInput,
					};
					
					$auth.requestPasswordReset(credentials)
					.then(function(resp) { 
						console.log(resp);
					})
					.catch(function(resp) { 
						console.log(resp);
					});
				}
				//////
				
				scope.validateAdmin = function(){

					////// LOGIN
					var credentials = {
						email: scope.emailInput,
						password: scope.passwordInput
					};
					$auth.submitLogin(credentials)
					.then(function(resp) {
						scope.admin = true;
						console.log(resp);
					})
					.catch(function(resp) {
						console.log(resp);
					});
					//////
					
				}
					
			}

		}
	}]);
}());