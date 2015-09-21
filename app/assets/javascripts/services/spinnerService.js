(function () {
  angular
    .module('mainApp.services')
    .service('spinnerService', spinnerService)

  function spinnerService(){
    var service = {
      begin: begin,
      stop: stop
    }

    return service

    function  begin(){
      usSpinnerService.spin('spinner-1');
      $('#grey-background').fadeIn()
    }

    function stop(){
      usSpinnerService.stop('spinner-1');
      $('#grey-background').fadeOut()
    }
  }

}());
