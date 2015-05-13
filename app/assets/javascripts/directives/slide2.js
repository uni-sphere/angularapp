(function () {
  'use strict';
  angular.module('mainApp.directives').directive('slide2', ['Restangular', '$auth', function(Restangular, $auth) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide2.html',
      scope: {
        displayError: '='
      },
      link: function(scope) {

        scope.newUni = "";
        scope.markerPerso = [];
        scope.showExistingSchool = false;
        scope.showNewSchool = false;
        scope.subdomainCreated = false;
        scope.signupShow = false;
        scope.geolocation = navigator.geolocation;

        // GET /organizations
        scope.universities = [
          {
            name: "Lycée Freppel",
            latitude: "48.46",
            longitude: "7.48",
            place_id: "ChIJCfuBlFtNkUcR-ZdZvh89L6I",
            url: "sandbox.unisphere.eu"
          },
          {
            name: "Lycée Couffignal",
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
              title: node.name,
              icon: 'assets/pin-colleg.png',
              place_id: node.place_id
            });
            scope.markerPerso.push(marker);
          });
        }

        scope.centerMap = function(){
          if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
              map.setCenter(pos);
              zoomMap(9);
            });
          } else {
            displayError("Your browser doesn't support geolocation");
          }
        }

        scope.placeChanged = function() {
          scope.place = this.getPlace();
          console.log(scope.place);
          scope.showExistingSchool = findPlace(this.getPlace());
          scope.showNewSchoolUrl = false;

          // We move the map to the place searched
          map.panTo(this.getPlace().geometry.location);

          // We zoom on the map
          zoomMap(9);

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
            // console.log(scope.place);

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


        /*=============================================
        =            Creation of a new uni            =
        =============================================*/
        
        
        // Step 1 - Look up for uni / extract url
        scope.findUrl = function(){
          scope.showNewSchool = false;
          scope.signupShow =  true
        };

        //Step 2 - Creation. Send info to backend
        scope.signup = function(){
          // console.log(scope.place);

          var newUni = {
            name: scope.place.name,
            latitude: scope.place.geometry.location.A,
            longitude: scope.place.geometry.location.F,
            place_id: scope.place.place_id,
            website: scope.place.website
          }

          console.log(newUni);

          Restangular.all('organizations').post(newUni).then(function(d) {
            console.log(d);

            // We push the new uni to our local storage
            // newUni.url = d.url;
            // scope.universities.push(newUni);

            // Sign up
            var credentials = {
              name: scope.adminName,
              email: scope.adminEmail,
              password: scope.adminPassword,
              password_confirmation: scope.adminPassword
            };

            $auth.submitRegistration(credentials)
            .then(function(resp) { 
              console.log(resp);
            })
            .catch(function(resp) { 
              console.log(resp);
            });

            //We change popup
            scope.signupShow = false;
            scope.subdomainCreated =  true;

          }, function(d){
            console.log("error");
            console.log(d);

            scope.displayError("try again to create " + scope.place.name);



            scope.adminPassword = "";
          });
        }

        /*=================================
        =            functions            =
        =================================*/
        
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