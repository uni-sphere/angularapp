(function () {
  angular
    .module('mainApp.services')
    .service('assignmentService', assignmentService)

  assignmentService.$inject = ['$rootScope'];
  function assignmentService($rootScope){
    service = {
      newAssignment: newAssignment
    }

    return service

    function newAssignment(){
      console.log($rootScope.nodeEnd)
    }
  }

}());
