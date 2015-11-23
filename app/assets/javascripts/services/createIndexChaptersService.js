(function () {

  angular
    .module('mainApp.services')
    .service('createIndexChaptersService', createIndexChaptersService)

  function createIndexChaptersService(){
    var service = {
      create: create
    }

    return service;

    function create(treeData){

      // console.log(treeData)
      var j = 1;
      var chap = [];
      var savedValueByDepth = [];
      var previousDepth = 0;

      function createChap(d){
        if(!d.document){
          var newValueByDepth = savedValueByDepth;

          // If we have a sibling chapter
          if(d.depth == previousDepth){
            // console.log("==");
            if(savedValueByDepth[[d.depth]] != undefined){
              newValueByDepth[d.depth] = savedValueByDepth[[d.depth]] + 1;
            } else{
              newValueByDepth[d.depth] = 1;
            }
            savedValueByDepth = newValueByDepth;
          }

          // If we have a sibling higher in the organization
          if(d.depth > previousDepth){
            // console.log(">");
            if(savedValueByDepth[[d.depth]] == undefined){
              newValueByDepth[d.depth] = 1;
            } else{
              newValueByDepth[d.depth] = savedValueByDepth[[d.depth]] + 1;
            }
            savedValueByDepth = newValueByDepth;
          }

          // If we have a child
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
    }

  }
}());
