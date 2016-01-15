(function () {
  angular
    .module('mainApp.services')
    .service('uploadHandInService', uploadHandInService);
  uploadHandInService.$inject = ['handInService', '$rootScope', 'Restangular', 'Notification', 'ipCookie', 'spinnerService', 'Upload', 'createIndexChaptersService', 'cookiesService', '$translate', '$q'];
  function uploadHandInService(handInService, $rootScope, Restangular, Notification, ipCookie, spinnerService, Upload, createIndexChaptersService, cookiesService, $translate, $q){
    var service = {
      upload: upload
    }
    return service;

    var cancel_warning,
      forbidden


      $translate(['ERROR', 'SUCCESS', 'NW_CANCEL', 'FORBIDDEN']).then(function (translations) {
        cancel_warning = translations.NW_CANCEL;
        forbidden = translations.FORBIDDEN;
      });

    function upload(theFile, nodeId, assignmentId){
      return $q(function(resolve, reject){
        // Begin the spinner
        spinnerService.begin()

        Upload.upload({
          url: getEnvironment() + '/handins',
          file: theFile,
          fields: {
            user_id: $rootScope.userId,
            node_id: nodeId,
            assignment_id: assignmentId,
            name_user: $rootScope.accountEmail
          }
        }).then(function(handInUploaded) {

          // Notification
          console.log("OK document uploaded");
          spinnerService.stop()

          // We had the handin to the list handInArray and to the handInDoubleArray
          $rootScope.handInArray.push(handInUploaded)

          resolve();
        }, function(d) {
          reject()
          spinnerService.stop()
          console.log(d)
          Notification.error($rootScope.errorMessage);
          console.log("Error: Upload handin failed");
        });
      })
    }

    function getEnvironment(){
      var host = window.location.host;
      if(host == 'localhost:3000'){
        return "http://api.unisphere-dev.com:3000"
      } else if(host.indexOf('dev.') > -1){
        return "http://apidev.unisphere.eu"
      } else{
        return "http://api.unisphere.eu"
      }
    }
  }

})();
