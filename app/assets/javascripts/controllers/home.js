(function(){
angular
  .module('myApp.controllers')
  .controller('HomeCtrl', ['$scope', 'nodesflat', '$cookies','$timeout', 'Restangular', '$upload', 'ngDialog', function ($scope, nodesflat, $cookies, $timeout, Restangular, $upload, ngDialog) {
    
    $scope.openPlain = function () {
      // $rootScope.theme = 'ngdialog-theme-plain';
      ngDialog.open({
        template: 'firstDialogId',
        className: 'admin-popup',
      });
    };

    /*==========  transform flat to nested data  ==========*/

    // var data = [
    // { "name" : "Level 2: A", "parent":"Top Level" },
    // { "name" : "Top Level", "parent":"null" },
    // { "name" : "Son of A", "parent":"Level 2: A" },
    // { "name" : "Daughter of A", "parent":"Level 2: A" },
    // { "name" : "Level 2: B", "parent":"Top Level" }
    // ];

    // console.log(data);


    function makeNested(flatData){

      var dataMap = flatData.reduce(function(map, node) {
        map[node.id] = node;
        return map;
      }, {});


      var treeData = [];
      flatData.forEach(function(node) {
        var parent = dataMap[node.parent];
        if (parent) {
          (parent.items || (parent.items = []))
            .push(node);
        } else {
          treeData.push(node);
        }
      });

      return treeData;
    }


    // console.log(makeNested(data));
    

    // console.log(nodesflat);
    // console.log(treeData[0]);

    // $scope.nodes = treeData[0];
    $scope.nodes = nodesflat;


    

    var plop = [{
      "id": 0,
      "items": [{
        "id": 2,
        "title": "2. moiré-vision",
        "items": [{
          "id": 21,
          "title": "2.1. tofu-animation",
          "items": [{
            "id": 211,
            "document": true,
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
      }]
    }];

    // var tree = angular.element('#tree-id').isolateScope().$nodesScope; 
    // console.log(angular.element('#tree-id').isolateScope().$nodesScope);

    // console.log(plop);
    // console.log([documents]);

    // $scope.nodes = nodes;

   
    // console.log( $scope.list);
    $scope.selectedItem = {};
    $scope.options = {};
    $scope.fileStore=[];
    $scope.$watch('fileStore.files', function () {
      upload($scope.fileStore.files,false);
    });
    var restAngularDocuments = Restangular.one('documents');

    $scope.$watch('files', function () {
      upload($scope.files, true);
    });

    $scope.storeClick = function(scope){
      $scope.lastClick = scope;
    }

    /*==========  Periodical get  ==========*/
    
    // function retrieveDocuments() {
    //   restAngularDocuments.get().then(function(response) {
    //     $scope.list = response;
    //     console.log("Objects get");
    //     $timeout(retrieveDocuments, 5000);
    //   }, function() {
    //     console.log("There was an error getting");
    //   });
    // }

    // $timeout(retrieveDocuments, 5000);

    /*==========  Cookie gestion  ==========*/

    getNodeEnd = $cookies.get('nodeEnd');


    if( getNodeEnd != undefined && getNodeEnd != 'false'){
      getNodeEndArray = getNodeEnd.split(',');
    }else{
      getNodeEndArray = false;
    }

    $scope.nodeEnd =  getNodeEndArray;

    console.log($scope.nodeEnd);

    function isInArray(value, array) {
      return array.indexOf(value.toString()) > -1;
    }

    var getCookies = $cookies.get('documentCookies');
    // console.log(getCookies);
    

    var postCookiesArray;
    var getCookieArray;
    
    if( getCookies != undefined ){
      getCookieArray = getCookies.split(',');
      if(!isInArray(0,getCookieArray)){
        getCookieArray.push("0");
      }
    }else{
      getCookieArray =["0"];
    }

   

    upload = function (files, dragAndDrop) {
      if (files && files.length) {
        console.log(files);
        for (var i = 0; i < files.length; i++) {
          var file = files[i];

          if(file.type != "directory"){
          
          // $upload.upload({
          //   url: 'upload/url',
          //   fields: {'username': $scope.username},
          //   file: file
          // }).progress(function (evt) {
          //   var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          //   console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          // }).success(function (data, status, headers, config) {
          //   console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
          // });

          }

          // CALLBACK DRAG AND DROP FOLDER, récupéré l'id et faire: $scope.lastDeployedPosition = cette id
 
          if(!dragAndDrop){
            var nodeData = $scope.lastClick.$modelValue;
          } else{
            if($scope.lastDeployedPosition == undefined){
              var nodeData = $scope.list[0];
            } else{
              var nodeData = $scope.lastDeployedPosition.$modelValue;
            }
          }
          // console.log(nodeData);

          if(file.type != "directory"){
            var nodeToCreate ={
              id: nodeData.id * 10 + nodeData.items.length,
              title: file.name,
              document: true,
              items: []
            }
          } else{
            var nodeToCreate ={
              id: nodeData.id * 10 + nodeData.items.length,
              title: file.name,
              items: []
            }
          }
          

          // restAngularDocuments.post("create", nodeToCreate).then(function() {
          //   console.log("Item created");
          // }, function() {
          //   console.log("There was an error creating the item");
          // });

          if(file.type != "directory"){
            nodeData.items.unshift(nodeToCreate);
          } else{
            nodeData.items.push(nodeToCreate);
          }

          if(!dragAndDrop){
            $scope.lastClick.expand(); 
          } else if($scope.lastDeployedPosition != undefined){
            $scope.lastDeployedPosition.expand();
          }
          
        }
      }
    };


    

   $scope.chaptersNumber = [];
   $scope.i = -1;


    /*========================================
    =            Toogle documents            =
    ========================================*/

    $scope.toggleItems = function(scope) {
      if(scope.$childNodesScope.$modelValue != undefined){
        scope.toggle();
        addToCookie(scope.$modelValue.id);

        // save latest collapse position in case of dropped file
        if(scope.collapsed && scope.$parentNodeScope!= undefined){
          $scope.lastDeployedPosition = scope.$parentNodeScope;
        } else{
          $scope.lastDeployedPosition = scope;
        }
      }
    };

    $scope.collapseItems = function(scope){
      if(getCookieArray == undefined){
        scope.toggle();
      } else{
        if(!isInArray(scope.$modelValue.id,getCookieArray)){
          // console.log(scope.$modelValue.title);
          scope.toggle();
          // if(!scope.$modelValue.document){
          //   scope.toggle();
          // }
        };
      }
    }

    $scope.initCounter = function(){
      $scope.j = 0;
      $scope.k = 0;
    }

    $scope.initI = function(){
      $scope.i ++;
    }

    $scope.$watch('nodeEnd', function(newVals, oldVals) {
      if(newVals){
        documentFlat = Restangular.one('chapters').get({node_id: newVals[0]}).then(function (document) {

          var documentsNested = makeNested(document);
          // console.log(documentsNested);
          // console.log( typeof documentsNested);
          $scope.list = [{
            "id": 0,
            "items": documentsNested
          }];

          console.log($scope.list);

          // console.log(plop);

          // $scope.$watch('list', function(newVals, oldVals) {
          //   var j = 1;
          //   var chap = [];
          //   var savedValueByDepth = [];
          //   var previousDepth = 0;

          //   createChap = function(d){
          //     if(!d.document){
          //       var depth = d.id.toString().split('').length
          //       newValueByDepth = savedValueByDepth;
          //       if(depth == previousDepth){
          //         // console.log("==");
          //         newValueByDepth[depth - 1] = savedValueByDepth[[depth - 1]] + 1;
          //         savedValueByDepth = newValueByDepth;
          //       }
          //       if(depth > previousDepth){
          //         // console.log(">");
          //         if(savedValueByDepth[[depth - 1]] == undefined){
          //           newValueByDepth[depth - 1] = 1;
          //         } else{
          //           newValueByDepth[depth - 1] = savedValueByDepth[[depth - 1]] + 1;
          //         }
          //         savedValueByDepth = newValueByDepth;
          //       }
          //       if(depth < previousDepth){
          //         var diff = previousDepth - depth;
          //         newValueByDepth[depth -1 ] = savedValueByDepth[depth - 1] + 1;
          //         for(i= 0; i < diff; i++){
          //           newValueByDepth.pop();
          //         }
                  
          //         savedValueByDepth[depth - 1] = savedValueByDepth[depth - 1];
          //       }

          //       previousDepth = depth;
          //       // console.log(newValueByDepth.join('.'));
          //       d.chapter = newValueByDepth.join('.');
          //     }
          //   }

          //   iterate = function (d){
          //     createChap(d);
          //     if(d.items){
          //       d.items.forEach(iterate);
          //     }
          //   }

          //   newVals.forEach(iterate);

          // }, true);



        });

      }
    });


    function addToCookie(nb){
      if(getCookieArray == undefined){
        getCookieArray = [nb.toString()];
      } else if(isInArray(nb,getCookieArray)){
        var index = getCookieArray.indexOf(nb.toString());
        getCookieArray.splice(index, 1);
      } else{
        getCookieArray.push(nb.toString());
      };
      $cookies.put('documentCookies', getCookieArray);
    }


    /*========================================
    =            Delete Documents            =
    ========================================*/

    $scope.removeItems = function(scope) {
      var nodeToDelete = scope.$modelValue.id;

      restAngularDocuments.post("delete", nodeToDelete).then(function() {
        console.log("Objects deleted");
      }, function() {
        console.log("There was an error deleting");
      });

      scope.remove();
    };


    /*===========================================
    =            Create new item                =
    ===========================================*/
    
    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      var nodeToCreate ={
        id: nodeData.id * 10 + nodeData.items.length,
        title: "new chapter",
        items: []
      }

      // Restangular.all('nodes').post(newBranch).then(function(d) {
        
      restAngularDocuments.post("create", nodeToCreate).then(function() {
        console.log("Item created");
       
      }, function() {
        console.log("There was an error creating the item");
      });

     
      nodeData.items.push(nodeToCreate);
      scope.expand();

      
    };


  }]);
})();