(function () {

  angular.module('mainApp.directives').directive('slide', ['Restangular', 'Notification', '$translate', function(Restangular, Notification, $translate) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide.html',
      scope: {
        home: '=',
        deconnection: '=',
        superadmin: '=',
        admin: '=',
        university: '='
      },
      link: function(scope) {

        scope.viewhome = true

        scope.newContact = function() {
          if(scope.webEmail == undefined){
            Notification.error("You made a mistake in your email")
          } else if(scope.webUniversity == undefined){
            Notification.error("Please input your university")
          } else{
            Restangular.one('new_contact').get({email: scope.webEmail, university: scope.webUniversity, message: scope.webMessage}).then(function (res) {
              console.log(res)
              Notification.success("Thanks for contacting us. We will answer you soon.");
              scope.webEmail = ""
              scope.webUniversity = undefined
              scope.webMessage = undefined
              console.log("Ok: send contact request")
            }, function(d){
              console.log("Error: send contact request");
              console.log(d)
              Notification.error("Can you please refresh the page, there was an error");
            });
          }
        }
      }
    }

  }]);
}());
