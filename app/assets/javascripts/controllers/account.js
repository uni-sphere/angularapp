(function(){
	angular
	.module('mainApp.controllers')
	.controller('AccountCtrl', ['$scope', 'Restangular', '$auth',  function ($scope, Restangular, $auth) {

		// // Get the profile
		// Restangular.one('user').get().then(function (user) {
			//   $scope.accountEmail = user.name;
			// }, function(d){
				//   console.log(d);
				//   console.log("Cannot get user profile");
				// });

				var top = $('#panel-orgnanization').offset().top - 50
				console.log(top);
				$('#panel-user-to-invite').css("top", top);

				////// SIGNOUT
				$scope.deconnection = function(){
					$auth.signOut()
					.then(function(resp) { 
						c.classList.add("wrapper__minify");
						scope.admin = false;
					})
					.catch(function(resp) { 
						// handle error response
					});
				}
				////// UPDATE USER
				
				////// UPDATE USER
				$scope.updateAccount = function() {
					var credentials = {
						name: $scope.updatedName,
						email: $scope.updatedEmail
					};
					console.log(credentials);
					$auth.updateAccount(credentials)
					.then(function(resp) { 
						console.log(resp);
					})
					.catch(function(resp) { 
						console.log(resp);
					});
				}
				//////
		
				////// UPDATE PASSWORD
				$scope.updatePsw = function() {
					var credentials = {
						password: $scope.newPsw,
						password_confirmation: $scope.confirmPsw
					};

					$auth.updatePassword(credentials)
					.then(function(resp) {
						console.log(resp);
					})
					.catch(function(resp) {
						console.log(resp);
						$scope.displayError("Try again to change your password");
					});
				}
				//////
		
		
				$scope.listUser = ["clement.muller@unisphere.eu"]
				
				$scope.addUser = function(){
					if(organizationForm.$valid){
						$scope.listUser.push($scope.newUser);
						console.log($scope.newUser + " sucessfully addded");
						$scope.newUser = "";
					} else{
						console.log("There was an error adding this user");
						$scope.displayError($scope.newUser + " is not a valid email");
					}
				}

				// Invite users
				$scope.inviteUsers = function(){
					Restangular.all('users/invite').post({emails: $scope.listUser}).then(function () {
						$scope.listUser = [];
						console.log("New user added");
					}, function(d){
						console.log(d);
						console.log("There was an error adding users");
						$scope.displayError("Try again to invite lecturers");
					});;
				}


			}]);
		})();
