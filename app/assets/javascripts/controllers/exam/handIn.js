(function(){
  angular
    .module('mainApp.controllers')
    .controller('handInCtrl', handInCtrl)

  handInCtrl.$digest = ['$timeout', '$rootScope', '$scope', 'Restangular', 'Notification', '$translate'];
  function handInCtrl($timeout, $rootScope, $scope, Restangular, Notification, $translate){
    var newAssignmentNoClass,
      newAssignmentNoTitle;

    $translate(['NEW_ASSIGNMENT_NO_CLASS', 'NEW_ASSIGNMENT_NO_TITLE']).then(function (translations) {
      newAssignmentNoClass = translations.NEW_ASSIGNMENT_NO_CLASS;
      newAssignmentNoTitle = translations.NEW_ASSIGNMENT_NO_TITLE;
    });

    // Get all hand-in
    $scope.studentDoubleArray = [{
        assignment_id: 0,
        assignment_array: [
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100},
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100},
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100},
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100},
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100}
        ]
      },{
        assignment_id: 1,
        assignment_array: [
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100},
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100},
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100},
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100},
          {id: 0, name: 'Gabriel Muller', date: 1288323623006, grade: 89, gradeRange: 100}
        ]
      }
    ]

    // We select the good assignment array
    $scope.studentDoubleArray.forEach(findHandInDoubleArray)

    /*----------  Utility function  ----------*/
    
    function findHandInDoubleArray(handInArray){
      if(handInArray.assignment_id == $scope.assignmentArray){
        $scope.assignmentArray = handInArray
      }
    }


    
  }
})();




