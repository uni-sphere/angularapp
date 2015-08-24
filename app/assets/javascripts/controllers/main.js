(function(){
angular
  .module('mainApp.controllers')
  .controller('MainCtrl', ['$scope','$timeout', 'Restangular', '$translate', '$auth', '$state',
   'usSpinnerService', 'Notification', 'ipCookie', function ($scope, $timeout, Restangular, $translate,
    $auth, $state, usSpinnerService, Notification, ipCookie) {

    function makeNested(flatData){
      var dataMap = flatData.reduce(function(map, node) {
        map[node.num] = node;
        return map;
      }, {});

      var treeData = [];
      flatData.forEach(function(node) {
        var parent = dataMap[node.parent];
        if (parent) {
          (parent.children || (parent.children = []))
            .push(node);
        } else {
          treeData.push(node);
        }
      });
      return treeData[0];
    }

    // First we get the nodes
    Restangular.one('nodes').get().then(function (nodes) {
      $scope.flatNode = nodes.plain();
      var nodeIDs = []
      angular.forEach($scope.flatNode, function(value,key){
        nodeIDs.push(value.num)
      });

      $scope.nodes = makeNested($scope.flatNode)
      // Cookies gestion
      if($scope.home || $scope.sandbox){
        $scope.foldedNodes = [4];
        $scope.activeNodes = [[17,"Histoire"],[9,"S"],[3,"Premiere"],[1,"Sandbox"]];
        $scope.nodeEnd = [17,"Histoire"];
      } else{

        console.log(ipCookie('nodeEnd'))
        console.log(ipCookie('activeNodes'))

        // We look if the node in the cookies still exist
        if(!ipCookie('nodeEnd') || nodeIDs.indexOf(ipCookie('nodeEnd')[0]) > -1){
          console.log("We found good cookies -----------")
          $scope.activeNodes = ipCookie('activeNodes');
          $scope.nodeEnd = ipCookie('nodeEnd');
        } else{
          console.log("We found bad cookies ------------")
          if(!$scope.nodes.children[0].children && !$scope.nodes.children[0]._children){
            $scope.nodeEnd = [$scope.flatNode[1].num,$scope.flatNode[1].name]
          }
          $scope.activeNodes = [[$scope.flatNode[0].num,$scope.flatNode[0].name],[$scope.flatNode[1].num,$scope.flatNode[1].name]]
          $scope.breadcrumb = [$scope.nodes.children[1].name]
        }

        $scope.foldedNodes = [];
        angular.forEach(ipCookie('foldedNodes'), function(value,key){
          if(nodeIDs.indexOf(value) > -1){
            $scope.foldedNodes.push(value)
          }
        });


      }

      // $scope.$watch('help', function(newVals, oldVals){
      //   if($scope.help){
      //     console.log("Ok: First co cookies")
      //     $scope.nodeEnd = [$scope.flatNode[1].num,$scope.flatNode[1].name]
      //     $scope.activeNodes = [[$scope.flatNode[0].num,$scope.flatNode[0].name],[$scope.flatNode[1].num,$scope.flatNode[1].name]]
      //     $scope.breadcrumb = [$scope.flatNode[1].name]
      //     ipCookie('activeNodes', $scope.activeNodes);
      //     ipCookie('nodeEnd', $scope.nodeEnd);
      //   }
      // });

    },
      function(d){
      Notification.error("Can not display your tree")
      console.log("Error: Get nodes");
      console.log(d)
    });

    /*==========  Location variable  ==========*/

    // function exploreNode(node, id){

    // }

    $scope.lookForNode = function(id,node){
      if(node == undefined){
        node = $scope.nodes
      }
      if(node.num == id){
      console.log(node)
        return node
      } else{
        angular.forEach(node.children, function(value, key){
          $scope.lookForNode(id, value)
        })
      }
    }



    if(window.location.host == 'sandbox.unisphere.eu' || window.location.host == 'dev.unisphere.eu'){
      console.log("sandbox")
      $scope.sandbox = true
      $scope.admin = true
      // $('#first-connection').fadeIn(2000)
      $scope.university = "My university"
    } else if(window.location.host == 'www.unisphere.eu' || window.location.host == 'home.dev.unisphere.eu' || window.location.pathname == '/home'){
      console.log("home")
      $scope.home = true
    } else{
      console.log("Normal app")

      // We get the actual uni
      Restangular.one('organization').get().then(function (university) {
        $scope.university = university.organization.name;
        $scope.universityId = university.organization.id;
        console.log("Ok: Uni name")
      }, function(d){
        console.log("Error: Get uni name");
        console.log(d)
        Notification.error("Can you please refresh the page, there was an error");
      });

      // We authentificated the user
      console.log("Validation attempt: main.js")
      $auth.validateUser().then(function(){
        console.log("Ok: admin co")
        $scope.admin = true;

        // Help Center
        if(window.location.host != 'localhost:3000'){
          FHChat = {product_id: "6227bca7722d"};
          // FHChat.properties={};
          // FHChat.set=function(key,data){this.properties[key]=data};
          !function(){
            var a,b;
            return b=document.createElement("script"),a=document.getElementsByTagName("script")[0],b.src="https://chat-client-js.firehoseapp.com/chat-min.js",b.async=!0,a.parentNode.insertBefore(b,a)
          }();
        }

        $scope.getBasicInfo()
      }, function(){
        console.log("Ok: Student co")
        $scope.admin = false
      })
    }



    if(window.location.host == 'localhost:3000'){
      $scope.local = true
    }

    /*==========  Admin deco  ==========*/

    $scope.adminDeco = function(){
      if($scope.sandbox){
        $scope.admin = false;
        $state.transitionTo('main.application');
      } else{
        $auth.signOut()
        .then(function(resp) {
          $scope.admin = false;
          $state.transitionTo('main.application');

          $scope.accountEmail = undefined;
          $scope.accountName = undefined;

          if(window.location.host != 'localhost:3000'){
            FHChat.transitionTo('closed');
          }
        })
        .catch(function(resp) {
          console.log(resp)
        });
      }
    }

    /*==========  Languages stuff  ==========*/

    // Languages options
    $scope.ddSelectOptions = [
      {
        text: 'Français',
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

    /*==========  Spinner  ==========*/

    // $scope.activateSpinner = function(){
    //   usSpinnerService.spin('spinner-1');
    //   $scope.greyBackground = true
    // }

    // $scope.desactivateSpinner = function(){
    //   usSpinnerService.stop('spinner-1');
    //   $scope.greyBackground = false
    // }

    /*==========  Function  ==========*/

    $scope.getBasicInfo = function(){

      // We get the user email and name to display them
      Restangular.one('user').get().then(function (d) {
        $scope.accountEmail = d.email
        $scope.accountName = d.name
        $scope.help = d.help

        console.log("Ok: User info")
        if($scope.help) {
          // $('#first-connection').fadeIn(2000)
        }

        // We get the list of user in the organization
        Restangular.one('users').get().then(function (d) {
          $scope.listUser = d.users
          console.log("Ok: Organization info")
        }, function(d){
          console.log("Error: Organization info");
          console.log(d)
        });

      }, function(d){
        console.log("Error: User info");
        console.log(d)
      });
    }




  }]);
})();
