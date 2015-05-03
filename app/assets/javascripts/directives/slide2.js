(function () {
  'use strict';
  angular.module('mainApp.directives').directive('slide2', ['Restangular', function(Restangular) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide2.html',
      scope: {
      },
      link: function(scope) {

        scope.newUni = "";
        scope.markerPerso = [];

        scope.universities = [
          {
            title: "Lycée Freppel",
            latitude: "48.46",
            longitude: "7.48",
            place_id: "ChIJCfuBlFtNkUcR-ZdZvh89L6I"
          },
          {
            title: "Lycée Couffignal",
            latitude: "48.560611",
            longitude: "7.748023999999987",
            place_id: "ChIJnXxeLaLJlkcRzlJLgTx2ws8"
          }
        ]


        var map;
        scope.marker = "";

        scope.$on('mapInitialized', function(evt, evtMap) {
          map = evtMap;
          putMarkers();
          // marker = map.markers[0];
        });

        function putMarkers(){
          scope.universities.forEach(function(node) {
            var pos = new google.maps.LatLng(node.latitude,node.longitude);
            // console.log(pos);
            var marker = new google.maps.Marker({
              position: pos,
              map: map,
              title: node.title,
              icon: 'assets/pin-colleg.png',
              place_id: node.place_id
            });
            scope.markerPerso.push(marker);
          });
        }

        scope.placeChanged = function() {
          scope.place = this.getPlace();
          
          // We move the map to the place searched
          map.panTo(this.getPlace().geometry.location);

          // We soom on the map
          map.setZoom(map.getZoom() + 1)
          zoomMap(10);

          // We remove the previous marker if there was one
          if(scope.selectedMarker){
            scope.selectedMarker.setMap(null);
          }

          // We remove the previous animation on the marker is there was one
          if(scope.selectedMarkerPerso){
            scope.selectedMarkerPerso.setAnimation(null);
          }

          // If the schools exist
          if(findPlace(this.getPlace())){
            console.log("school already uses unisphere");

            // We make the marker bounce
            scope.markerPerso.forEach(function(node){
              if(node.place_id == scope.place.place_id){
                scope.selectedMarkerPerso = node;
                node.setAnimation(google.maps.Animation.BOUNCE);
              }
            })
          } 
          // If the school doesn't exist 
          else{
            // We add a marker on the map
            scope.selectedMarker = new google.maps.Marker({
              position: this.getPlace().geometry.location,
              map: map
            });
            console.log("school doesnt use unisphere")
          }

          // console.log(this.getPlace());
        
          // console.log(findPlace(this.getPlace()));
        }

        scope.currentPosition = function(){
          map.panTo("currentLocation")
        }





        // Restangular.one('organizations').get().then(function(response) {
        //   scope.universities = response;
        // }, function() {
        //   console.log("error");
        // });

        scope.saveNewUni = function(){
          uniToPush = {name: scope.newUniName}
          uniToPost = {name: scope.newUniName, email: scope.newUniEmail, password: scope.newUniPassword}

          Restangular.all('organizations').post(uniToPost).then(function(d) {
            scope.universities.push(uniToPush);
            scope.newUniName = "";
            scope.newUniEmail = "";
            scope.newUniPassword = "";
          }, function(){
            console.log("error");
            scope.newUniPassword = "";
          });
        };

        function findPlace(place){
          var position = false;
          scope.universities.forEach(function(node) {
            if(node.place_id == place.place_id){
              position = true;
            }
          });
          return position
        }

        function zoomMap(zoom){
          if(map.getZoom() < zoom){
            map.setZoom(map.getZoom() + 1);
            setTimeout(function(){
              zoomMap(zoom)
            },1000);
          }
        }


        // Restangular.one('organizations').get().then(function(response) {
        //   scope.universities = response;
        // }, function(d) {
        //   console.log("Error while getting the organizations");
        //   console.log(d);
        // });

        // scope.saveNewUni = function(){
        //   var uniToPush = {name: scope.newUniName}
        //   var uniToPost = {name: scope.newUniName, email: scope.newUniEmail, password: scope.newUniPassword}

        //   Restangular.all('organizations').post(uniToPost).then(function(d) {
        //     scope.universities.push(uniToPush);
        //     scope.newUniName = "";
        //     scope.newUniEmail = "";
        //     scope.newUniPassword = "";
        //   }, function(d){
        //     console.log("Error while creating the organization");
        //     console.log(d.data);
        //     scope.newUniPassword = "";
        //   });

        // };

      }
    }

  }]);
}());