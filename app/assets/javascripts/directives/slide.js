(function () {

  angular
    .module('mainApp.directives')
    .directive('slide', slide)

  slide.$inject = ['$rootScope','Restangular', 'Notification', '$translate'];
  function slide($rootScope, Restangular, Notification, $translate){

    var directive = {
      link: link,
      templateUrl: 'home/slide.html',
      scope:{
        deconnection: '=',
      }
    };
    return directive;

    function link(scope, elem, attrs){

      var request_success,
        error;

      $translate(['ERROR', 'REQUEST_SUCCESS']).then(function (translations) {
        request_success = translations.REQUEST_SUCCESS;
        error = translations.ERROR;
      });

      $rootScope.viewhome = true
      $rootScope.viewdashboard = false

      scope.newContact = function() {
        if(scope.webEmail == undefined){
          Notification.error("You made a mistake in your email")
        } else if(scope.webUniversity == undefined){
          Notification.error("Please input your university")
        } else{
          Restangular.one('new_contact').get({email: scope.webEmail, university: scope.webUniversity, message: scope.webMessage}).then(function (res) {
            console.log(res)
            Notification.success(request_success);
            scope.webEmail = ""
            scope.webUniversity = undefined
            scope.webMessage = undefined
            console.log("Ok: send contact request")
          }, function(d){
            console.log("Error: send contact request");
            console.log(d)
            Notification.error(error);
          });
        }
      }
    }
  }

}());
