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
        scope.showExistingSchool = false;
        scope.showNewSchool = false;
        scope.showNewSchoolUrl = false;

        scope.universities = [
          {
            title: "Lycée Freppel",
            latitude: "48.46",
            longitude: "7.48",
            place_id: "ChIJCfuBlFtNkUcR-ZdZvh89L6I",
            url: "sandbox.unisphere.eu"
          },
          {
            title: "Lycée Couffignal",
            latitude: "48.560611",
            longitude: "7.748023999999987",
            place_id: "ChIJnXxeLaLJlkcRzlJLgTx2ws8",
            url: "sandbox.unisphere.eu"
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
          scope.showExistingSchool = findPlace(this.getPlace());
          scope.showNewSchoolUrl = false;

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
          if(scope.showExistingSchool){
            console.log("school already uses unisphere");

            // Gestion of popup
            scope.showNewSchool = false;

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

            // Gestion of popup
            scope.showNewSchool = true;
            console.log(scope.place);

            // We add a marker on the map
            scope.selectedMarker = new google.maps.Marker({
              position: this.getPlace().geometry.location,
              map: map
            });
            console.log("school doesnt use unisphere")
          }

        }

        scope.currentPosition = function(){
          map.panTo("currentLocation")
        }

        scope.displaySchool = function(){
          scope.showSchool = true;
        }

        scope.hideSchool = function(){
          scope.showSchool = false;
        }

        scope.addSchool = function(){
          scope.showNewSchool = false;
          scope.showNewSchoolUrl = true;
        };



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

        scope.confirmSchool = function(url){
          console.log(scope.place);
          var newUni = {
            title: scope.place.name,
            latitude: scope.place.geometry.location.A,
            longitude: scope.place.geometry.location.F,
            place_id: scope.place.place_id,
            url: "freppel.unisphere.eu"
          }
          console.log(newUni);
        }

        function findPlace(place){
          var uni = false;
          scope.universities.forEach(function(node) {
            if(node.place_id == place.place_id){
              uni = node;
            }
          });
          return uni
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