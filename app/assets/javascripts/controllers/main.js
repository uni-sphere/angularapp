(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope', 'browser', 'nodesflat', '$cookies','$timeout', 'Restangular', '$upload', 'ngDialog', '$translate', function ($scope, browser, nodesflat, $cookies, $timeout, Restangular, $upload, ngDialog, $translate) {
    
    // var FHChat = {product_id: "6227bca7722d"};
    // FHChat.transitionTo('closed');

    //Check if the user is admin
    var admin = $cookies.get('unisphere_api_admin');
   
    if(admin != undefined){
      $scope.admin = true;
    }

    $scope.adminDeco = function(){
      $scope.admin = false;
    }

    // console.log($scope.admin);

    // $scope.openAdmin = function(){
    //   $scope.showAdmin = true;
    //   // $scope.showGreyPanel = true;
    // }

    // We sent nodes to d3
    $scope.nodes = nodesflat;


    // $scope.helpChat = function(){
    //   var FHChat = {product_id: "6227bca7722d"};
    //   FHChat.properties={};FHChat.set=function(key,data){this.properties[key]=data};!function(){var a,b;return b=document.createElement("script"),a=document.getElementsByTagName("script")[0],b.src="https://chat-client-js.firehoseapp.com/chat-min.js",b.async=!0,a.parentNode.insertBefore(b,a)}();
    // }

    checkLocation = function(){
      var host = window.location.host;
      var pathname = window.location.pathname
      if(pathname == '/home' || host == 'unisphere.eu'){
        $scope.home = true
      } else{
        $scope.home = false;
      }
    }();

    // Languages options
		
		// console.log($translate.use());
		
    $scope.ddSelectOptions = [
      {
        text: 'French',
        value: 'fr'
      },
      {
        text: 'English',
        value: 'en'
      }
    ];

    // Set the default language
    if($translate.use().indexOf("fr") > -1){
      $scope.ddSelectSelected = {text: 'French', value: 'fr'};
    } else{
      $scope.ddSelectSelected = {text: 'English', value: 'en'};
    }

    $scope.changeLanguage = function() {
      if ($scope.ddSelectSelected.value == 'fr') {
        $translate.use('fr');
      } else {
        $translate.use('en');
      }
			console.log($translate.use());
    }
      
    // get university name for navbar
    Restangular.one('organization').get().then(function (university) {
      $scope.university = university['name'];
    }, function(){
      console.log("There getting the university name");
      $scope.displayError("Sorry there was a mistake, refresh please");
    });;

    $scope.IsChrome = checkIfChrome();


    /*=================================
    =            Fonctions            =
    =================================*/


    function checkIfChrome(){
      if(browser().browserName == "chrome"){
        return true;
      } else{
        return false;
      }
    }






  }]);
})();