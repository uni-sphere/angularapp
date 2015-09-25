(function () {
  angular
    .module('mainApp.services')
    .service('makeNestedService', makeNestedService)

  makeNestedService.$inject = ['$q','$rootScope']
  function makeNestedService($q,$rootScope){
    service = {
      item : item,
      node: node
    }

    return service

    function node(flatData){
      return $q(function(resolve, reject){
        $rootScope.chaptersId = []
        angular.forEach(flatData, function(key, value){
          if(key.node_data.length > 1){
            key.items = item(key.node_data)
            angular.forEach(key.node_data, function(value, key){
              if(!value.document){
                $rootScope.chaptersId.push(value.id)
              }
            })
          } else{
            key.items = []
          }
        })

        var dataMap = flatData.reduce(function(map, node) {
          map[node.num] = node;
          return map;
        }, {});

        var treeData = [];

        flatData.forEach(function(node) {
          node.children = []

          var parent = dataMap[node.parent];
          if (parent) {
            parent.children.push(node);
          } else {
            treeData.push(node);
          }
        });
        resolve(treeData[0]);
      })
    }

    function item(flatData){
      // console.log(flatData)
      var dataMap = flatData.reduce(function(map, node) {
        map[node.id] = node;
        return map;
      }, {});

      var treeData = [];
      var mainId = flatData.shift().id
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
          delete node.chapter_id
          delete node.url
        } else{
          node.parent = node.parent_id
          delete node.parent_id
        }

        if(node.parent == mainId){
          delete node.parent
        }

      });

      flatData.forEach(function(node) {
        var parent = dataMap[node.parent];
        if(parent) {
          node.depth = node.depth + 1;
          parent.items.push(node);
        } else {
          treeData.push(node)
        }
      });

      return treeData;
    }
  }

}());
