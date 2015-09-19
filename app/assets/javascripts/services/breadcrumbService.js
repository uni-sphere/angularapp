// storage.js
(function() {
  angular
    .module('mainApp.services')
    .service('breadcumbService', breadcumbService);

  function breadcumbService() {
    var service = {
      setNodeName: setNodeName,
      openNode: openNode
    };

    return service;

    ////////////

    function setNodeName(node, name) {

    }

    function openNode() {
      console.log("hello")
    }

  }
})();
