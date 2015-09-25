(function () {

  angular
    .module('mainApp.controllers')
    .controller('breadcrumbCtrl', breadcrumbCtrl);

  breadcrumbCtrl.$inject = ['$rootScope', '$scope', 'Restangular', 'Notification', 'ModalService', '$translate', 'cookiesService']
  function breadcrumbCtrl($rootScope, $scope, Restangular, Notification, ModalService, $translate, cookiesService){

    var error,
      cancel_warning,
      success,
      forbidden;

    $translate(['ERROR', 'SUCCESS', 'NW_CANCEL', 'FORBIDDEN']).then(function (translations) {
      error = translations.ERROR;
      success = translations.SUCCESS;
      cancel_warning = translations.NW_CANCEL;
      forbidden = translations.FORBIDDEN;
    });

    $scope.nodeDropdownSelected = {};

    $scope.toggleProtection = function(){
      if($rootScope.nodeProtected){
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
          name: $rootScope.nodeEnd[1]
        }
      }).then(function(modal) {
        modal.close.then(function(result) {
          if(result){
            Restangular.one('nodes/'+ $rootScope.nodeEnd[0]).put({password: result, lock: true}).then(function(res) {
              $rootScope.nodeProtected = true;
              Notification.success(success)
              $scope.nodeDropdownOptions = [{text: 'Edit password',value: 'change'},{text: 'Share',value: 'share'}];
              console.log("Ok: Password for node set");
            }, function(d) {
              if(d.status == 403){
                console.log("Ok: set password cancelled | This node is not yours")
                Notification.error(forbidden)
              } else{
                console.log("Error: Set password for node");
                console.log(d);
                Notification.error(error)
              }
            });
          }
        });
      });
    }

    function removeProtection(){
      Restangular.one('nodes/'+ $rootScope.nodeEnd[0]).put({lock: false, password: ""}).then(function(res) {
        $rootScope.nodeProtected = false;
        $scope.nodeDropdownOptions = [{text: 'Share',value: 'share'}];
        console.log("Ok: " + $rootScope.nodeEnd[1] + " has been unlocked")
        Notification.success(success)
      }, function(d) {
        console.log("Error: unlock node")
        console.log(d);
        Notification.error(error)
      });
    }

    function shareNode(){
      Restangular.one('chapter/restrain_link').get({id: 0, node_id: $rootScope.nodeEnd[0]}).then(function(res){
        ModalService.showModal({
          templateUrl: "webapp/share-item-modal.html",
          controller: "ShareItemCtrl",
          inputs:{
            itemLink: res.link,
            itemTitle: $rootScope.nodeEnd[1]
          }
        }).then(function(modal) {
          modal.close.then(function(result) {
          })
        })
      },function(d){
        if(d.status == 404){
          console.log("Ok: node archived | cannot get share link")
          cookiesService.reload()
          Notification.warning(cancel_warning)
        } else{
          console.log(d);
          console.log("Error: download doc")
          Notification.error(error)
        }
      });
    }

  }
})();
