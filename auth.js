////// SIGNUP
var credentials = {
	email: scope.emailInput,
	password: scope.passwordInput,
	password_confirmation: scope.passwordInput
};

$auth.submitRegistration(credentials)
.then(function(resp) { 
	console.log(resp);
})
.catch(function(resp) { 
	console.log(resp);
});
//////

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


