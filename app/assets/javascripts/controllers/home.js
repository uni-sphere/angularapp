(function(){
angular
  .module('myApp.controllers')
  .controller('HomeCtrl', ['$scope', 'documents', 'nodes', '$cookies','$timeout', 'Restangular', function ($scope, documents, nodes, $cookies, $timeout, Restangular) {

    $scope.nodes = nodes;
    $scope.list = [{
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
          "document": true,
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

    var restAngularDocuments = Restangular.one('documents');

    /*==========  Periodical get  ==========*/
    
    // function retrieveNodes() {
    //   restAngularNode.get().then(function(response) {
    //     scope.branch = response;
    //     console.log("Objects get");
    //     $timeout(retrieveNodes, 5000);
    //   }, function() {
    //     console.log("There was an error getting");
    //   });
    // }

    // $timeout(retrieveNodes, 5000);


    // console.log($scope.list[0].$element)

    // function collaspseAll(d){

    // }

    /*==========  Cookie gestion  ==========*/

    var getCookies = $cookies.get('documentCookies');
    var postCookiesArray;
    var getCookieArray;
    
    if( typeof getCookies !== "undefined" ){
      getCookieArray = getCookies.split(',');
    }


    function isInArray(value, array) {
      return array.indexOf(value.toString()) > -1;
    }


    /*========================================
    =            Toogle documents            =
    ========================================*/

    $scope.toggleItems = function(scope) {
      if(scope.$childNodesScope.$$nextSibling != null){
        scope.toggle();
        addToCookie(scope.$modelValue.id);
      }
    };

    $scope.collapseItems = function(scope){
      if(getCookieArray == undefined){
        console.log("no cookie");
        scope.toggle();
      } else{
        console.log("cookie found: " + getCookieArray);
        if(!isInArray(scope.$modelValue.id,getCookieArray)){
          scope.toggle();
        };
      }
    }

    function addToCookie(nb){
      console.log(getCookieArray);
      if(getCookieArray == undefined){
        console.log("collapse - nothing defined yet")
        getCookieArray = [nb.toString()];
      } else if(isInArray(nb,getCookieArray)){
        console.log("retract")
        var index = getCookieArray.indexOf(nb.toString());
        console.log(index);
        getCookieArray.splice(index, 1);
      } else{
        console.log("new collapse");
        getCookieArray.push(nb.toString());
      };
      console.log(getCookieArray)
      $cookies.put('documentCookies', getCookieArray);
    }


    /*========================================
    =            Delete Documents            =
    ========================================*/

    $scope.removeItems = function(scope) {
      scope.remove();

      /*==========  Save deletion  ==========*/
      
      var nodeToDelete = scope.$modelValue.id;

      restAngularDocuments.post("delete", nodeToDelete).then(function() {
        console.log("Objects deleted");
      }, function() {
        console.log("There was an error deleting");
      });
    };


    /*===========================================
    =            Create new item                =
    ===========================================*/
    
    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      nodeData.items.push({
        id: nodeData.id * 10 + nodeData.items.length,
        title: nodeData.title + '.' + (nodeData.items.length + 1),
        items: []
      });
    };


    /*===========================================
    =            Create new document            =
    ===========================================*/
    
    $scope.newDocument = function(scope) {

    };
    
    
  }]);
})();