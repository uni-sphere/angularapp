(function(){
angular
  .module('myApp.controllers')
  .controller('HomeCtrl', ['$scope', 'documents', 'nodes', function ($scope, documents, nodes) {

    $scope.hello = "hellasdadasdo";
    $scope.nodes = nodes;
    $scope.list = [{
      "id": 1,
      "title": "1. dragon-breath",
      "items": []
    }, {
      "id": 2,
      "title": "2. moiré-vision",
      "items": [{
        "id": 21,
        "title": "2.1. tofu-animation",
        "items": [{
          "id": 211,
          "title": "2.1.1. spooky-giraffe",
          "items": []
        }, {
          "id": 212,
          "title": "2.1.2. bubble-burst",
          "items": []
        }],
      }, {
        "id": 22,
        "title": "2.2. barehand-atomsplitting",
        "items": []
      }],
    }, {
      "id": 3,
      "title": "3. unicorn-zapper",
      "items": []
    }, {
      "id": 4,
      "title": "4. romantic-transclusion",
      "items": []
    }];
    $scope.selectedItem = {};
    $scope.options = {
    };


    $scope.removeItems = function(scope) {
      scope.remove();
    };

    $scope.toggleItems = function(scope) {
      console.log("sdfdsf");
      scope.toggle();
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      console.log(nodeData);
      nodeData.items.push({
        id: nodeData.id * 10 + nodeData.items.length,
        title: nodeData.title + '.' + (nodeData.items.length + 1),
        items: []
      });
    };

    // console.log($scope.documents);


  }]);
})();