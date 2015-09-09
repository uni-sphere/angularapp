(function () {
  'use strict';
  angular.module('mainApp.directives').service('makeNested', ['usSpinnerService', function(usSpinnerService) {
    return function(flatData) {
      var dataMap = flatData.reduce(function(map, node) {
        map[node.id] = node;
        return map;
      }, {});

      var treeData = [];
      flatData.forEach(function(node) {

        node.depth = 0;

        if(node.chapter_id){
          if(node.title.substr(node.title.lastIndexOf('.')+1) == 'pdf'){
            node.pdf = true
          }
          node.parent = node.chapter_id
          node.doc_id = node.id
          node.document = true
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
  }]);
}());
