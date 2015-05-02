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
				
				//Check if the user is admin
				scope.admin = true;
				
				console.log(scope.admin);
				
				scope.toggleAdmin = function(){
					if(scope.open == true){
						scope.open = false;
					} else{
						scope.open = true;
					}
				}
				
				scope.passwordForgotten = function() {
					var credentials = {
						email: scope.passwordForgottenInput,
					};
					
					$auth.requestPasswordReset(credentials)
					.then(function(resp) { 
						console.log(resp);
					})
					.catch(function(resp) { 
						console.log(resp);
					});
				}
				
				scope.updatePassword = function() {
					var credentials = {
						name: scope.updatedName
						email: scope.updatedEmail
					};
					
					$auth.updatePassword(credentials)
					.then(function(resp) { 
						console.log(resp);
					})
					.catch(function(resp) { 
						console.log(resp);
					});
				}
				
				scope.updateUser = function() {
					var credentials = {
						password: scope.oldPsw
						password_confirmation: scope.newPsw
					};
					
					$auth.updateAccount(credentials)
					.then(function(resp) { 
						console.log(resp);
					})
					.catch(function(resp) { 
						console.log(resp);
					});
				}
				
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