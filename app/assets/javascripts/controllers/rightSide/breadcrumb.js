(function () {

  angular
    .module('mainApp.controllers')
    .controller('breadcrumbCtrl', breadcrumbCtrl);

  breadcrumbCtrl.$inject = ['$scope', 'Restangular', 'Notification', 'ModalService']
  function breadcrumbCtrl($scope, Restangular, Notification, ModalService){
    $scope.nodeDropdownSelected = {};

    $scope.toggleProtection = function(){
      if($scope.nodeProtected){
        removeProtection()
      } else{
        ChangePasswordNode()
      }
    }

    $scope.actionNodeOptions = function(){
      if($scope.nodeDropdownSelected.value == 'change'){
        ChangePasswordNode()
      } else if($scope.nodeDropdownSelected.value == 'share'){
        shareNode()
      }
      $('.dropdown.active').removeClass('active')
    }

    /*=================================
    =            Functions            =
    =================================*/

    function ChangePasswordNode(){
      ModalService.showModal({
        templateUrl: "webapp/set-node-password-modal.html",
        controller: "SetNodePswCtrl",
        inputs:{
          name: $scope.nodeEnd[1]
        }
      }).then(function(modal) {
        modal.close.then(function(result) {
          if(result){
            Restangular.one('nodes/'+ $scope.nodeEnd[0]).put({password: result, lock: true}).then(function(res) {
              Notification.success("Your Password for the node " + $scope.nodeEnd[1] + " has been set")
              $scope.nodeProtected = true;
              $scope.nodeDropdownOptions = [{text: 'Change password',value: 'change'},{text: 'Share node',value: 'share'}];
              console.log("Ok: Password for node set");
            }, function(d) {
              if(d.status == 403){
                console.log("Ok: set password cancelled | This node is not yours")
                Notification.error("Error while setting the password for your node, please refresh.")
              } else{
                console.log("Error: Set password for node");
                console.log(d);
                Notification.error("Error while setting the password for your node, please refresh.")
              }
            });
          }
        });
      });
    }

    function removeProtection(){
      Restangular.one('nodes/'+ $scope.nodeEnd[0]).put({lock: false, password: ""}).then(function(res) {
        $scope.nodeProtected = false;
        $scope.nodeDropdownOptions = [{text: 'Share',value: 'share'}];
        console.log("Ok: " + $scope.nodeEnd[1] + " has been unlocked")
        Notification.success($scope.nodeEnd[1] + " has been unlocked.")
      }, function(d) {
        console.log("Error: unlock node")
        console.log(d);
        Notification.error("Error while unlocking your node, please refresh.")
      });
    }

    function shareNode(){
      Restangular.one('chapter/restrain_link').get({id: 0, node_id: $scope.nodeEnd[0]}).then(function(res){
        ModalService.showModal({
          templateUrl: "webapp/share-item-modal.html",
          controller: "ShareItemCtrl",
          inputs:{
            itemLink: res.link,
            itemTitle: $scope.nodeEnd[1]
          }
        }).then(function(modal) {
          modal.close.then(function(result) {
          })
        })
      },function(d){
        if(d.status == 404){
          console.log("Ok: node archived | cannot get share link")
          Notification.warning("Error while getting the share link, please refresh.")
          $scope.reloadNodes()
        } else{
          console.log(d);
          console.log("Error: download doc")
          Notification.error("Error while getting the share link, please refresh.")
        }
      });
    }

  }
})();
