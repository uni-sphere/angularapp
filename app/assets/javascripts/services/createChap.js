(function () {
  'use strict';
  angular.module('mainApp.directives').service('createChap', ['usSpinnerService', function(usSpinnerService) {
    return function(treeData) {

      if(treeData.length == 0){
        scope.documentAbsent = true;
      } else{
        scope.documentAbsent = false;
      }

      var j = 1;
      var chap = [];
      var savedValueByDepth = [];
      var previousDepth = 0;

      function createChap(d){
        if(!d.document){
          var newValueByDepth = savedValueByDepth;
          if(d.depth == previousDepth){
            // console.log("==");
            if(savedValueByDepth[[d.depth]] != undefined){
              newValueByDepth[d.depth] = savedValueByDepth[[d.depth]] + 1;
            } else{
              newValueByDepth[d.depth] = 1;
            }
            // console.log(newValueByDepth);
            savedValueByDepth = newValueByDepth;
          }
          if(d.depth > previousDepth){
            // console.log(">");
            if(savedValueByDepth[[d.depth]] == undefined){
              newValueByDepth[d.depth] = 1;
            } else{
              newValueByDepth[d.depth] = savedValueByDepth[[d.depth]] + 1;
            }
            savedValueByDepth = newValueByDepth;
          }
          if(d.depth < previousDepth){
            // console.log("<")
            var diff = previousDepth - d.depth;
            newValueByDepth[d.depth] = savedValueByDepth[d.depth] + 1;
            for(var i= 0; i < diff; i++){
              newValueByDepth.pop();
            }

            savedValueByDepth[d.depth] = savedValueByDepth[d.depth];
          }

          previousDepth = d.depth;
          d.chapter = newValueByDepth.join('.') + ".";
        }
      }

      function iterate(d){
        createChap(d);
        if(d.items){
          d.items.forEach(iterate);
        }
      }

      treeData.forEach(iterate);

      return treeData

    }
  }]);
}());
