(function () {

  angular
    .module('mainApp.services')
    .service('createIndexChaptersService', createIndexChaptersService)

  createIndexChaptersService.$inject = ['$q', '$timeout']
  function createIndexChaptersService($q, $timeout){
    var service = {
      create: create
    }

    return service;

    function create(treeData){
      return $q(function(resolve, reject){

        var lengthItem = findLengthObject(treeData)
        var length = 0
        var j = 1;
        var chap = [];
        var savedValueByDepth = [];
        var previousDepth = 0;
        var parent = 0;
        var filePos = 1;

        // We timeout the promise after one second
        if(lengthItem > 0){
          var timeoutPromise = $timeout(function() {
            console.log("creation of index timed out");
            reject();
          }, 1000);
        }

        function createChap(d){
          var newValueByDepth = savedValueByDepth;
          if(d.document){
            if(d.chapter_id != parent){
              filePos = 1
              parent = d.chapter_id
            }

            d.chapter = filePos;
            filePos += 1;
          } else{
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

          // We check how many items have been order to resolve at the good time :)
          length += 1;
          if(length == lengthItem){
            $timeout.cancel(timeoutPromise)
            resolve()
          }
        }

        function iterate(d, depth){
          d.depth = depth
          depth += 1
          createChap(d);
          if(d.items){
            angular.forEach(d.items, function(value, key){
              iterate(value, depth)
            })
          }
        }

        angular.forEach(treeData, function(value, key){
          iterate(value, 0)
        })
      })
    }

    function findLengthObject(obj){
      var i = 0;

      function iterate(d){
        i += 1;
        if(d.items){
          d.items.forEach(iterate);
        }
      }

      obj.forEach(iterate);
      return i
    }

  }
}());
