(function () {
  angular
    .module('mainApp.services')
    .service('assignmentService', assignmentService)

  assignmentService.$inject = ['handInService', 'Notification', '$rootScope', 'Restangular'];
  function assignmentService(handInService, Notification, $rootScope, Restangular){
    service = {
      getIndex: getIndex
    }

    return service

    function getIndex(conditions){
      Restangular.one('assignments').get(conditions).then(function (res) {
        console.log("Ok: get assignments")
        // We initialize count
        res.assignment_array.forEach(function(assignment){
          assignment.count = 0
        })
        $rootScope.assignmentArray = res.assignment_array

        // Whoever we are we select the first assignment (for student it will be the one we clicked on for teacher the new one)
        $rootScope.assignmentSelected = $rootScope.assignmentArray[0]

        /*----------  ADMIN  ----------*/
        if($rootScope.admin){
          // If there are no assignment we propose to create a new one
          if( $rootScope.assignmentArray.length == 0){
            $rootScope.newAssignment = true;
          } 
          // If there are assignments we get the handins
          else{
            if($rootScope.admin){
              handInService.getAllHandIn().then(function(){
                handInService.getHandin()
              })
            }
          }
        }

      }, function(d){
        Notification.error($rootScope.errorMessage)
        console.log("Error: get assignments");
        console.log(d)
      });
    }
  }

}());
