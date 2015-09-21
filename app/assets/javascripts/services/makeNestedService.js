(function () {
  angular
    .module('mainApp.services')
    .service('makeNestedItemService', makeNestedItemService)

  function makeNestedItemService(){
    service = {
      create : create
    }

    return service

    function create(flatData){
      var dataMap = flatData.reduce(function(map, node) {
        map[node.id] = node;
        return map;
      }, {});

      var treeData = [];
      flatData.forEach(function(node) {

        node.depth = 0;
        node.savedTitle = node.title

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
      });

      flatData.forEach(function(node) {
        node.items = [];

        var parent = dataMap[node.parent];
        if (parent) {
          node.depth = node.depth + 1;
          (parent.items || (parent.items = [])).push(node);
        } else {
          treeData.push(node);
        }
      });

      return treeData;
    }
  }

}());
