          function compareObjects(x, y) {
            var objectId = false;
            for(var propertyName in x) {
              if(y == undefined){
                objectId = x.num;
                break;
              }
              if(x[propertyName] !== y[propertyName]) {
                objectId = x.num;
                break;
              }
            }
            return objectId;
          }

          function isInArray(value, array) {
            return array.indexOf(value) > -1
          }

          function intInArray(value, array) {
            return array.indexOf(value) > -1;
          }

          function intInDoubleArray(value, doubleArray){
            var array = [];
            for( var i = 0; i < doubleArray.length; i++){
              array.push(doubleArray[i][0]);
            }
            return intInArray(value, array);
          }

          function isInDoubleArray(value, doubleArray){
            var array = [];
            for( var i = 0; i < doubleArray.length; i++){
              array.push(doubleArray[i][0]);
            }
            return isInArray(value, array);
          }

          function transformArrayInDouble(array){
            var doubleArray = [];

            function action(myArray){
              doubleArray.push([myArray[0],myArray[1]]);
              myArray.shift();
              myArray.shift();
              if(array.length != 0){
                action(myArray);
              }
            }
            action(array);

            return doubleArray;
          }

          function removeFromArray(arr, what) {
            var found = arr.indexOf(what);

            while (found !== -1) {
              arr.splice(found, 1);
              found = arr.indexOf(what);
            }
          }

          function compareObjectsArray(a,b){
            var objectId = false;

            if(a.length > b.length){
              for (var i=0; i < a.length; i ++){
                var idFound = false
                for(var j=0; j < b.length; j ++){
                  if(a[i].num == b[j].num){
                    idFound = true;
                  }
                }
                if(!idFound){
                  objectId = a[i].num;
                }
              }
              return objectId;
            }

            if(a.length == b.length){
              var objectId = false;
              for (var i=0; i < a.length; i ++){
                for(var j=0; j < b.length; j ++){
                  if(a[i].num == b[j].num){
                    var compare = compareObjects(a[i],b[j]);
                    if(compare){
                      objectId = compareObjects(a[i],b[j]);
                    };
                  }
                }
              }
              return objectId;
            }

            if(a.length < b.length){
              var listObjectsId =[];
              for (var j=0; j < b.length; j ++){
                var idFound = false;
                for(var i=0; i < a.length; i ++){
                  if(a[i].num == b[j].num){
                    idFound = true;
                  }
                }
                if(!idFound){
                  listObjectsId.push(b[j].num);
                }
              }
              return listObjectsId;
            }
          }

          /*==========  Periodical get  ==========*/

          function retrieveNodes() {
            Restangular.one('nodes').get().then(function(response) {

              var comparaison = compareObjectsArray(response.plain(),scope.copyFlatData.plain());

              $timeout(retrieveNodes, 5000);
            }, function() {
              console.log("There was an error getting");
            });
          }

          $timeout(retrieveNodes, 5000);
