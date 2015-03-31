(function () {

  'use strict';
  angular
    .module('myApp.directives').service('Config', function Config() {
    
      var _environments = {
        local: {
          host: 'localhost',
          config: {
            apiroot: 'http://eventphoto.dev/app_dev.php'
          }
        },
        dev: {
          host: 'dev.com',
          config: {
            apiroot: 'http://eventphoto.dev/app_dev.php'
          }
        },
        prod: {
          host: 'production.com',
          config: {
            apiroot: 'http://eventphoto.dev/app_dev.php'
          }
        }
      },
      _environment;

      return {
        getEnvironment: function(){
          var host = window.location.host;

          if(_environment){
            return _environment;
          }

          for(var environment in _environments){
            if(typeof _environments[environment].host && _environments[environment].host == host){
              _environment = environment;
              return _environment;
            }
          }

          return null;
        },
        get: function(property){
          return _environments[this.getEnvironment()].config[property];
        }
      }
    });



}());