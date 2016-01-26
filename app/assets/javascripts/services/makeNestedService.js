(function () {
  angular
    .module('mainApp.services')
    .service('makeNestedService', makeNestedService)

  makeNestedService.$inject = ['$translate', '$q','$rootScope','Notification']
  function makeNestedService($translate, $q,$rootScope,Notification){
    service = {
      item : item,
      node: node
    }

    $translate(['SEVERE_ERROR']).then(function (translations) {
      severeError = translations.SEVERE_ERROR;
    });

    return service

    function node(flatData){
      // console.log(flatData)
      return $q(function(resolve, reject){
        $rootScope.chaptersId = []
        angular.forEach(flatData, function(value, key){
          if(value.node_data.length > 1){
            angular.forEach(value.node_data, function(value, key){
              if(!value.chapter_id){
                $rootScope.chaptersId.push(value.id)
              }
            })
          } 
        })

        var dataMap = flatData.reduce(function(map, node) {
          map[node.num] = node;
          return map;
        }, {});

        var treeData = [];

        flatData.forEach(function(node) {

          var parent = dataMap[node.parent];
          if (parent) {
            if(parent.children == undefined){
              parent.children = [node]
            } else{
              parent.children.push(node);
            }
          } else {
            treeData.push(node);
          }
        });
        resolve(treeData[0]);
      })
    }

    function item(flatData){
      var dataMap = flatData.reduce(function(map, node) {
        map[node.id] = node;
        return map;
      }, {});

      var treeData = [];
      var main = flatData.shift()

      var mainId = main.id
      var flatChapter = []
      var flatDocument = []

      flatData.forEach(function(node) {

        node.depth = 0;
        node.savedTitle = node.title
        node.items = [];

        if(node.chapter_id){
          node.parent = node.chapter_id
          node.doc_id = node.id
          node.document = true
          if(node.title.indexOf('.') > -1){
            node.extension = node.title.split('.')[1].toLowerCase();
          }
          delete node.id
          // delete node.chapter_id
          delete node.url
          flatChapter.push(node)

        } else{
          node.parent = node.parent_id
          flatDocument.push(node)
          // delete node.parent_id
        }

        if(node.parent == mainId){
          delete node.parent
          node.main = mainId
        }

      });

      flatChapter.forEach(function(node) {
        var parent = dataMap[node.parent];
        if(parent) {
          // node.depth = node.depth + 1;
          parent.items.push(node);
        } else {
          treeData.push(node)
        }
      });

      flatDocument.forEach(function(node) {
        var parent = dataMap[node.parent];
        if(parent) {
          // node.depth = node.depth + 1;
          parent.items.push(node);
        } else {
          treeData.push(node)
        }
      });

      // console.log(treeData)
      return treeData;
    }
  }

}());
