(function(){
  angular
    .module('mainApp.controllers')
    .controller('assignmentCtrl', assignmentCtrl)

  assignmentCtrl.$digest = ['dateFilter', '$timeout', '$rootScope', '$scope', 'Restangular', 'Notification', '$translate'];
  function assignmentCtrl(dateFilter, $timeout, $rootScope, $scope, Restangular, Notification, $translate){
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

    $scope.newAssignmentTime =  dateFilter(tomorrow, "dd MMMM, HH:mm")


    /*----------  GET ASSIGNMENT  ----------*/
    
    $scope.assignmentArray = [
      {id: 0, title: "What did I do this summer", subject: "Tell me in 1 paragraph what you did this summer.", count: 3, date: 1288323623006, node_id: 1, node_name: "Terminal > L"},
      {id: 1, title: "What did I do this summer", subject: "Tell me in 1 paragraph what you did this summer.", count: 3, date: 1288323623006, node_id: 2, node_name: "Première > S"}
    ]

    // If there are no assignment we propose to create a new one
    if($scope.assignmentArray.length == 0){
      $scope.newAssignment = true;
    } 
    // If there are assignments, we select the first one
    else{
      $scope.assignmentSelected = $scope.assignmentArray[0].id
    }

    /*----------  scope functions  ----------*/

    $scope.createNewAssignment = function(){
      $scope.newAssignment = true;
      $timeout(function(){
        $('#newAssignmentTitle').focus()
      })
    }

    $scope.selectAssignment = function(assignment){
      $scope.assignmentSelected = assignment.id
      $scope.newAssignment = false
    }

    $scope.submitAssignment = function(){
      if($scope.newAssignmentTitle == undefined){
        Notification.error(newAssignmentNoTitle)
      } else if($scope.ddAssignmentClassModel.value == 0){
        Notification.error(newAssignmentNoClass)
      } else{
        var assignment = {
          title: $scope.newAssignmentTitle, 
          subject: $scope.newAssignmentSubject, 
          date: $scope.newAssignmentTime, 
          node_name: $scope.ddAssignmentClassModel.text,
          node_id: $scope.ddAssignmentClassModel.value
        }
        Restangular.all('assignments').post(assignment).then(function(newAssignment) {
          assignment.id = newAssignment.id
          $scope.assignmentArray.unshift(assignment)
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
      $scope.newAssignmentTime =  dateFilter(tomorrow, "dd MMMM, HH:mm")
    }

    function addNodeToDd(node){
      $scope.ddAssignmentClassOptions.unshift({text: node.parentName + ' > ' + node.name, value: node.num})
    }

  }
})();




