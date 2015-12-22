(function () {
  angular
    .module('mainApp.directives')
    .directive('metrics', metrics)

  metrics.$inject = ['$rootScope', 'Restangular', '$window'];
  function metrics($rootScope, Restangular, $window){
    var directive = {
      link: link,
      templateUrl: 'dashboard/metric.html',
      scope:{
        university: '=',
        viewdashboard: '=',
      }
    };

    return directive;

    function link(scope) {
      $rootScope.contentLoaded = true;
      $rootScope.$watch('viewdashboard', function(newVals, oldVals){
        if(oldVals == false && newVals == true){
          reloadGraph($('.test-app-content').width(),$('.test-app-content').height())
        }
      });

      if(scope.home){
        scope.graphOuterContainer = $('.test-app-content')
      } else{
        scope.graphOuterContainer = $('#metrics')
      }

      function reloadGraph(width, height){
        console.log("load graph")
        options1.width = width / 2 - 120,
        options1.height = height * 50 / 100,
        MG.data_graphic(options1);

        options2.width =  width / 2 - 120,
        options2.height =  height * 50 / 100,
        MG.data_graphic(options2);
      }

      angular.element($window).bind('resize', function() {
        if(window.location.pathname == '/dashboard' || (window.location.pathname == '/home' && $rootScope.viewdashboard)){
          // console.log("Ok: Window resize | reload graph")
          reloadGraph($('.test-app-content').width(),$('.test-app-content').height())
        }
      });

      // We save the node of the user, so we can propose to display them in the first chart
      Restangular.one('report/nodes').get().then(function(data) {
        scope.userNodes = data.plain();
        scope.userActiveNode = scope.userNodes[0];
      });

      function getMetricBreadcrumb(node){
        scope.metricBreadcrumb = []
        addToMetricBreadcrumb(node)
      }

      function addToMetricBreadcrumb(node){
        scope.metricBreadcrumb.push(node.name)
        if(node.parent && node.parent){
          plop(node.parent)
        }
      }
      /*==========  First chart download on different node  ==========*/

      // var current_time = Date.now() + 200000;

      // Options of the first chart
      var options1 = {
        width: scope.graphOuterContainer.width() / 2 - 120,
        height: scope.graphOuterContainer.height() * 50 / 100,
        target: '#chart-1',
        x_accessor: 'date',
        y_accessor: 'downloads',
        xax_start_at_min: 'true',
        interpolate: 'linear',
        x_extended_ticks: 'true',
        // max_x: current_time,

        mouseover: function(d, i) {
          var date = $('.mg-active-datapoint tspan').text().split(',')[0];
          $('.mg-active-datapoint tspan').text(date + " " +  ": " + d.downloads + " downloads")
        }
      };

      // Function to change Node
      scope.selectOtherNode = function(button) {
        scope.userActiveNode = button.node;
        getMetricBreadcrumb(button.node)
      }

      // When the node change we fetch the new data
      scope.$watch('userActiveNode', function(newVals, oldVals){
        if(newVals){
          Restangular.one('reports/firstchart').get({node_id: newVals.id}).then(function(rawData) {
            if (rawData.empty) {
              $('#chart-1').css('display', 'none');
              scope.graph1Empty = true;
            } else{
              if(rawData.plain().length != 1 && rawData.plain()[0] != 0){
                $('#chart-1').css('display', 'inline-block');
                scope.graph1Empty = false;
                var data = MG.convert.date(rawData.plain(), 'date');
                options1.data = data;
                MG.data_graphic(options1);
              } else {
                $('#chart-1').css('display', 'none');
                scope.graph1Empty = true;
              }
            }
          });
        }
      });

      /*==========  Second chart general stats  ==========*/

      // We define the stats we want to display
      scope.generalStats = [{name: "downloads"}, {name: "uploads"}, {name: "lecturers"}]

      // Options of the second chart
      var options2 = {
        width: scope.graphOuterContainer.width() / 2 - 120,
        height: scope.graphOuterContainer.height() * 50 / 100,
        target: '#chart-2',
        x_accessor: 'date',
        xax_start_at_min: 'true',
        interpolate: 'linear',
        y_accessor: 'downloads',
        x_extended_ticks: 'true',
        xax_count: 5,
      };


      // We save the data of the second chart
      Restangular.one('reports/secondchart').get().then(function(rawData) {
        var data = MG.convert.date(rawData.plain(), 'date');
        options2.data = data;
        scope.activeStat = "downloads"

        if (options2.data.length == undefined || options2.data.length == 1) {
          $('#chart-2').css('display', 'none');
          scope.graph2Empty = true;

        } else {
          MG.data_graphic(options2);
          scope.$watch('activeStat', function(newVals, oldVals){
            if(newVals){
              options2.y_accessor = newVals;
              MG.data_graphic(options2);
            }

            options2.mouseover = function(d, i) {
              var date = $('.mg-active-datapoint tspan').text().split(',')[0];
              $('.mg-active-datapoint tspan').text(date + " " +  ": " + d[newVals] + " " + newVals)
            }

          });
        }
      });

      // Function to change the chart
      scope.selectStat = function(button){
        scope.activeStat = button.stat.name;
      }

    }
  }
}());
