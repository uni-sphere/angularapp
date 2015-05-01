
// SIGN UP

var credentials = {
	email: scope.emailInput,
	password: scope.passwordInput,
	password_confirmation: scope.passwordInput
};
			
Auth.register(credentials).then(function(registeredUser) {
	console.log('success');
	console.log(registeredUser); // => {id: 1, ect: '...'}
}, function(error) {
	console.log('error');
	console.log(error);
});

// IS AUTH ?

Auth.isAuthenticated()

// GET CURRENT USER

Auth.currentUser().then(function(user) {
	console.log(user);
}, function(error) {
	console.log(error);
});

// LOGOUT

Auth.logout().then(function(oldUser) {
	console.log(oldUser);
}, function(error) {
	console.log(error);
});
		
