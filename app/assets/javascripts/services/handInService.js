(function () {
  angular
    .module('mainApp.services')
    .service('handInService', handInService)

  handInService.$inject = ['$translate', '$q', '$rootScope', 'Notification', 'Restangular']
  function handInService($translate, $q, $rootScope, Notification, Restangular){
    service = {
      getAllHandIn : getAllHandIn,
      getHandin: getHandin
    }

    $translate(['SEVERE_ERROR']).then(function (translations) {
      severeError = translations.SEVERE_ERROR;
    });

    return service

    function findAssignmentsHandin(assignmentId){
      var handInArray = []
      $rootScope.allHandInArray.forEach(function(handIn){
        if(handIn.assignment_id == assignmentId){
          handInArray.push(handIn)
        }
      })
      $rootScope.handInArray = handInArray
    }

    function getAllHandIn(){
      return $q(function(resolve, reject){
        Restangular.one('handins').get().then(function (res) {
          console.log("Ok: get all handin")
          $rootScope.allHandInArray = res.handin_array

          // count handin
          createDoubleArray()
          resolve()
        }, function(d){
          console.log("Error: get all handin");
          console.log(d)
          reject()
        });
      })
    }

    function getHandin(){
      // getAllHandIn().then(function(){
        // first we select the handin from the list we have saved
        findAssignmentsHandin($rootScope.assignmentSelected.id)

        // In the meantime we make a get to see if there is anything new
        Restangular.one('index_assignment').get({assignment_id: $rootScope.assignmentSelected.id}).then(function (res) {
          $rootScope.handInArray = res.handin_array
          console.log("Ok: get hand-in")
        }, function(d){
          console.log("Error: Get hand-in")
          console.log(d)
          Notification.error($rootScope.errorMessage);
        })
      // })
    }

    function createDoubleArray(){
      var doubleArray = []
      var assignmentId = []
      $rootScope.allHandInArray.forEach(function(handIn){
        if(assignmentId.indexOf(handIn.assignment_id) == -1){
          doubleArray.push({id: handIn.assignment_id, handInArray : [handIn]})
          assignmentId.push(handIn.assignment_id)
        } else{
          doubleArray[assignmentId.indexOf(handIn.assignment_id)].handInArray.push(handIn)
        }
      })

      countHandin(doubleArray)
    }

    function countHandin(doubleArray){
      $rootScope.assignmentArray.forEach(function(assignment){
        assignment.count = 0
        doubleArray.forEach(function(handInArray){
          if(handInArray.id == assignment.id){
            assignment.count = handInArray.handInArray.length
          }
        })
      })
    }
    
  }

}());
