(function(){
  angular
    .module('mainApp.controllers')
    .controller('assignmentCtrl', assignmentCtrl)

  assignmentCtrl.$digest = ['assignmentService', 'handInService', 'dateFilter', '$timeout', '$rootScope', '$scope', 'Restangular', 'Notification', '$translate'];
  function assignmentCtrl(assignmentService, handInService, dateFilter, $timeout, $rootScope, $scope, Restangular, Notification, $translate){
    var newAssignmentNoClass,
      newAssignmentNoTitle;

    $translate(['NEW_ASSIGNMENT_NO_CLASS', 'NEW_ASSIGNMENT_NO_TITLE']).then(function (translations) {
      newAssignmentNoClass = translations.NEW_ASSIGNMENT_NO_CLASS;
      newAssignmentNoTitle = translations.NEW_ASSIGNMENT_NO_TITLE;
    });

    /// Node
    $scope.ddAssignmentClassModel = {text: 'undefined', value: 0}
    $scope.ddAssignmentClassOptions = [];

    // We list the leaf nodes
    $rootScope.$watch('leafs', function(newVals, oldVals){
      if(newVals != undefined){
        newVals.forEach(addNodeToDd)
      }
    })

    // Date
    var today = new Date();
    var tomorrow = today;
    tomorrow.setHours(8)
    tomorrow.setMinutes(0)
    tomorrow.setDate(today.getDate() + 1)

    $scope.newAssignmentTime =  dateFilter(tomorrow, "EEE dd MMM, HH:mm")


    /*----------  GET ASSIGNMENT  ----------*/
    // If we are a lecturer we get all assignments of this lecturer
    var watchAdmin = $rootScope.$watch('admin', function(newVals, oldVals){
      if(newVals != undefined){
        watchAdmin()
        if($rootScope.admin){
          assignmentService.getIndex()
        }
      }
    })
    
    // If we are a student we get all assignments we have given back
    // else{
    //   Restangular.one('assignments').get({user_id: $rootScope.userId}).then(function (res) {
    //     console.log("Ok: get assignments")
    //     res.assignment_array.forEach(function(assignment){
    //       assignment.count = 0
    //     })
    //     $rootScope.assignmentArray = res.assignment_array

    //     // If there are no assignment we propose to create a new one
    //     if($rootScope.assignmentArray.length == 0){
    //       $scope.newAssignment = true;
    //     }

    //     // If there are assignments, we select the first one
    //     else{
    //       $rootScope.assignmentSelected = $rootScope.assignmentArray[0]
    //       handInService.getAllHandIn().then(function(){
    //         handInService.getHandin()
    //       })
    //     }
    //   }, function(d){
    //     Notification.error($rootScope.errorMessage)
    //     console.log("Error: get assignments");
    //     console.log(d)
    //   });
    // }


    /*----------  scope functions  ----------*/

    $scope.createNewAssignment = function(){
      $scope.newAssignment = true;
      $timeout(function(){
        $('#newAssignmentTitle').focus()
      })
    }

    $scope.selectAssignment = function(assignment){
      $rootScope.assignmentSelected = assignment
      handInService.getHandin()
      $scope.newAssignment = false
    }

    $scope.submitAssignment = function(){
      if($scope.newAssignmentTitle == undefined){
        Notification.error(newAssignmentNoTitle)
      } else if($scope.ddAssignmentClassModel.value == 0){
        Notification.error(newAssignmentNoClass)
      } else{
        console.log($rootScope.userId)
        var assignment = {
          title: $scope.newAssignmentTitle, 
          subject: $scope.newAssignmentSubject, 
          due_date: $scope.newAssignmentTime, 
          node_name: $scope.ddAssignmentClassModel.text,
          node_id: $scope.ddAssignmentClassModel.value
        }
        Restangular.all('assignments').post(assignment).then(function(newAssignment) {
          assignment.id = newAssignment.id
          $rootScope.assignmentArray.unshift(assignment)
          resetNewAssignment()
          console.log("Ok: New assignment created")
        }, function(d) {
          console.log("Error: Creation new assigment")
        })
      }
    }

    /*----------  Helper functions  ----------*/
    
    function resetNewAssignment(){
      $scope.newAssignment = false;
      $scope.newAssignmentTitle = undefined
      $scope.newAssignmentSubject = undefined
      $scope.ddAssignmentClassModel = {text: 'undefined', value: 0}
      $scope.newAssignmentTime =  dateFilter(tomorrow, "EEE dd MMM, HH:mm")
    }

    function addNodeToDd(node){
      $scope.ddAssignmentClassOptions.unshift({text: node.parentName + ' > ' + node.name, value: node.num})
    }

  }
})();




