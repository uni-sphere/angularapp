(function(){
angular
  .module('mainApp.controllers')
  .controller('HomeCtrl', ['$scope', function ($scope) {
    
    $scope.sandboxNodes = [
      { name: "Sandbox",
        num: 1,
        parent: 0
      },
      { name: "Première",
        num: 2,
        parent: 1
      },
      { name: "S",
        num: 3,
        parent: 2
      },
      { name: "ES",
        num: 4,
        parent: 2
      },
      { name: "Terminal",
        num: 5,
        parent: 1
      },
      { name: "L",
        num: 6,
        parent: 5
      },
      { name: "S",
        num: 7,
        parent: 5
      }
    ]

  }]);
})();


