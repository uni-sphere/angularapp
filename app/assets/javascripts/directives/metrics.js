(function () {
	'use strict';

	angular.module('mainApp.directives')
	.directive('metrics', [ 'Restangular', function(Restangular) {
		
		return {
			restrict: 'E',
			templateUrl: 'dashboard/metric.html',
			scope: {},
			link: function(scope, element) {


				var globals = {};


				var plop = 
			    [
			        {
			            "date": "2014-01-01",
			            "release": 110000000,
			            "beta": 4200000,
			            "alpha": 2600000
			        },
			        {
			            "date": "2014-01-02",
			            "release": 110379978,
			            "beta": 5379978,
			            "alpha": 2779978
			        },
			        {
			            "date": "2014-01-03",
			            "release": 110493749,
			            "beta": 5493749,
			            "alpha": 2893749
			        },
			        {
			            "date": "2014-01-04",
			            "release": 110785250,
			            "beta": 5785250,
			            "alpha": 2485250
			        },
			        {
			            "date": "2014-01-05",
			            "release": 113901904,
			            "beta": 13901904,
			            "alpha": 23901904
			        },
			        {
			            "date": "2014-01-06",
			            "release": 111576838,
			            "beta": 6576838,
			            "alpha": 5576838
			        },
			        {
			            "date": "2014-01-07",
			            "release": 114413854,
			            "beta": 7413854,
			            "alpha": 6413854
			        },
			        {
			            "date": "2014-01-08",
			            "release": 115177211,
			            "beta": 8177211,
			            "alpha": 5977211
			        },
			        {
			            "date": "2014-01-09",
			            "release": 116622100,
			            "beta": 9622100,
			            "alpha": 9122100
			        },
			        {
			            "date": "2014-01-10",
			            "release": 117381072,
			            "beta": 11381072,
			            "alpha": 11381072
			        },
			        {
			            "date": "2014-01-11",
			            "release": 118802310,
			            "beta": 10802310,
			            "alpha": 8802310
			        },
			        {
			            "date": "2014-01-12",
			            "release": 115531790,
			            "beta": 8531790,
			            "alpha": 8131790
			        },
			        {
			            "date": "2014-01-13",
			            "release": 115748881,
			            "beta": 8748881,
			            "alpha": 8848881
			        },
			        {
			            "date": "2014-01-14",
			            "release": 118706437,
			            "beta": 10706437,
			            "alpha": 10006437
			        },
			        {
			            "date": "2014-01-15",
			            "release": 119752685,
			            "beta": 12752685,
			            "alpha": 12752685
			        },
			        {
			            "date": "2014-01-16",
			            "release": 121016418,
			            "beta": 13016418,
			            "alpha": 13016418
			        },
			        {
			            "date": "2014-01-17",
			            "release": 125622924,
			            "beta": 17622924,
			            "alpha": 17622924
			        },
			        {
			            "date": "2014-01-18",
			            "release": 125337480,
			            "beta": 17337480,
			            "alpha": 12337480
			        },
			        {
			            "date": "2014-01-19",
			            "release": 122258882,
			            "beta": 14258882,
			            "alpha": 11218882
			        },
			        {
			            "date": "2014-01-20",
			            "release": 123829538,
			            "beta": 15829538,
			            "alpha": 15129538
			        },
			        {
			            "date": "2014-01-21",
			            "release": 124245689,
			            "beta": 16245689,
			            "alpha": 15215689
			        },
			        {
			            "date": "2014-01-22",
			            "release": 126429711,
			            "beta": 18429711,
			            "alpha": 18429711
			        },
			        {
			            "date": "2014-01-23",
			            "release": 126259017,
			            "beta": 18259017,
			            "alpha": 18259017
			        },
			        {
			            "date": "2014-01-24",
			            "release": 125396183,
			            "beta": 17396183,
			            "alpha": 12396183
			        },
			        {
			            "date": "2014-01-25",
			            "release": 123107346,
			            "beta": 15107346,
			            "alpha": 15107346
			        },
			        {
			            "date": "2014-01-26",
			            "release": 128659852,
			            "beta": 20659852,
			            "alpha": 10659852
			        },
			        {
			            "date": "2014-01-27",
			            "release": 125270783,
			            "beta": 17270783,
			            "alpha": 17270783
			        },
			        {
			            "date": "2014-01-28",
			            "release": 126270783,
			            "beta": 18270783,
			            "alpha": 18270783
			        },
			        {
			            "date": "2014-01-29",
			            "release": 127270783,
			            "beta": 19270783,
			            "alpha": 11270783
			        },
			        {
			            "date": "2014-01-30",
			            "release": 128270783,
			            "beta": 20270783,
			            "alpha": 20270783
			        },
			        {
			            "date": "2014-01-31",
			            "release": 129270783,
			            "beta": 21270783,
			            "alpha": 21270783
			        },
			        {
			            "date": "2014-02-01",
			            "release": 130270783,
			            "beta": 22270783,
			            "alpha": 22270783
			        },
			        {
			            "date": "2014-02-02",
			            "release": 131270783,
			            "beta": 23270783,
			            "alpha": 23270783
			        },
			        {
			            "date": "2014-02-03",
			            "release": 132270783,
			            "beta": 24270783,
			            "alpha": 24270783
			        },
			        {
			            "date": "2014-02-04",
			            "release": 133270783,
			            "beta": 25270783,
			            "alpha": 23270783
			        },
			        {
			            "date": "2014-02-05",
			            "release": 128270783,
			            "beta": 20270783,
			            "alpha": 20270783
			        },
			        {
			            "date": "2014-02-06",
			            "release": 127270783,
			            "beta": 19270783,
			            "alpha": 19270783
			        },
			        {
			            "date": "2014-02-07",
			            "release": 135270783,
			            "beta": 27270783,
			            "alpha": 27270783
			        },
			        {
			            "date": "2014-02-08",
			            "release": 134270783,
			            "beta": 26270783,
			            "alpha": 26270783
			        },
			        {
			            "date": "2014-02-09",
			            "release": 128270783,
			            "beta": 20270783,
			            "alpha": 20270783
			        },
			        {
			            "date": "2014-02-10",
			            "release": 135270783,
			            "beta": 27270783,
			            "alpha": 24270783
			        },
			        {
			            "date": "2014-02-11",
			            "release": 136270783,
			            "beta": 28270783,
			            "alpha": 28270783
			        },
			        {
			            "date": "2014-02-12",
			            "release": 134127078,
			            "beta": 26127078,
			            "alpha": 26127078
			        },
			        {
			            "date": "2014-02-13",
			            "release": 133124078,
			            "beta": 25124078,
			            "alpha": 25124078
			        },
			        {
			            "date": "2014-02-14",
			            "release": 136227078,
			            "beta": 28227078,
			            "alpha": 26127078
			        },
			        {
			            "date": "2014-02-15",
			            "release": 137827078,
			            "beta": 29827078,
			            "alpha": 29827078
			        },
			        {
			            "date": "2014-02-16",
			            "release": 136427073,
			            "beta": 28427073,
			            "alpha": 28427073
			        },
			        {
			            "date": "2014-02-17",
			            "release": 137570783,
			            "beta": 29570783,
			            "alpha": 29570783
			        },
			        {
			            "date": "2014-02-18",
			            "release": 138627073,
			            "beta": 30627073,
			            "alpha": 30627073
			        },
			        {
			            "date": "2014-02-19",
			            "release": 137727078,
			            "beta": 29727078,
			            "alpha": 29727078
			        },
			        {
			            "date": "2014-02-20",
			            "release": 138827073,
			            "beta": 30827073,
			            "alpha": 30827073
			        },
			        {
			            "date": "2014-02-21",
			            "release": 140927078,
			            "beta": 32927078,
			            "alpha": 32927078
			        },
			        {
			            "date": "2014-02-22",
			            "release": 141027078,
			            "beta": 33027078,
			            "alpha": 40027078
			        },
			        {
			            "date": "2014-02-23",
			            "release": 142127073,
			            "beta": 34127073,
			            "alpha": 34127073
			        },
			        {
			            "date": "2014-02-24",
			            "release": 143220783,
			            "beta": 35220783,
			            "alpha": 35220783
			        },
			        {
			            "date": "2014-02-25",
			            "release": 144327078,
			            "beta": 36327078,
			            "alpha": 36327078
			        },
			        {
			            "date": "2014-02-26",
			            "release": 140427078,
			            "beta": 32427078,
			            "alpha": 32427078
			        },
			        {
			            "date": "2014-02-27",
			            "release": 141027078,
			            "beta": 33027078,
			            "alpha": 33027078
			        },
			        {
			            "date": "2014-02-28",
			            "release": 145627078,
			            "beta": 37627078,
			            "alpha": 37627078
			        },
			        {
			            "date": "2014-03-01",
			            "release": 144727078,
			            "beta": 36727078,
			            "alpha": 36727078
			        },
			        {
			            "date": "2014-03-02",
			            "release": 144227078,
			            "beta": 36227078,
			            "alpha": 36227078
			        },
			        {
			            "date": "2014-03-03",
			            "release": 145227078,
			            "beta": 37227078,
			            "alpha": 37227078
			        },
			        {
			            "date": "2014-03-04",
			            "release": 146027078,
			            "beta": 38027078,
			            "alpha": 38027078
			        },
			        {
			            "date": "2014-03-05",
			            "release": 146927078,
			            "beta": 38927078,
			            "alpha": 38927078
			        },
			        {
			            "date": "2014-03-06",
			            "release": 147027078,
			            "beta": 39027078,
			            "alpha": 39027078
			        },
			        {
			            "date": "2014-03-07",
			            "release": 146227078,
			            "beta": 38227078,
			            "alpha": 32427078
			        },
			        {
			            "date": "2014-03-08",
			            "release": 147027078,
			            "beta": 39027078,
			            "alpha": 39027078
			        },
			        {
			            "date": "2014-03-09",
			            "release": 148027078,
			            "beta": 40027078,
			            "alpha": 40027078
			        },
			        {
			            "date": "2014-03-10",
			            "release": 147027078,
			            "beta": 39027078,
			            "alpha": 39027078
			        },
			        {
			            "date": "2014-03-11",
			            "release": 147027078,
			            "beta": 39027078,
			            "alpha": 37027078
			        },
			        {
			            "date": "2014-03-12",
			            "release": 148017078,
			            "beta": 40017078,
			            "alpha": 38817078
			        },
			        {
			            "date": "2014-03-13",
			            "release": 148077078,
			            "beta": 40077078,
			            "alpha": 40077078
			        },
			        {
			            "date": "2014-03-14",
			            "release": 148087078,
			            "beta": 40087078,
			            "alpha": 40087078
			        },
			        {
			            "date": "2014-03-15",
			            "release": 148017078,
			            "beta": 40017078,
			            "alpha": 40017078
			        },
			        {
			            "date": "2014-03-16",
			            "release": 148047078,
			            "beta": 40047078,
			            "alpha": 40047078
			        },
			        {
			            "date": "2014-03-17",
			            "release": 148067078,
			            "beta": 40067078,
			            "alpha": 40067078
			        },
			        {
			            "date": "2014-03-18",
			            "release": 148077078,
			            "beta": 40077078,
			            "alpha": 39977078
			        },
			        {
			            "date": "2014-03-19",
			            "release": 148027074,
			            "beta": 40027074,
			            "alpha": 40027074
			        },
			        {
			            "date": "2014-03-20",
			            "release": 148927079,
			            "beta": 40927079,
			            "alpha": 40927079
			        },
			        {
			            "date": "2014-03-21",
			            "release": 148727071,
			            "beta": 40727071,
			            "alpha": 40727071
			        },
			        {
			            "date": "2014-03-22",
			            "release": 148127072,
			            "beta": 40127072,
			            "alpha": 37127072
			        },
			        {
			            "date": "2014-03-23",
			            "release": 148527072,
			            "beta": 40527072,
			            "alpha": 40527072
			        },
			        {
			            "date": "2014-03-24",
			            "release": 148627027,
			            "beta": 40627027,
			            "alpha": 40627027
			        },
			        {
			            "date": "2014-03-25",
			            "release": 148027040,
			            "beta": 40027040,
			            "alpha": 40027040
			        },
			        {
			            "date": "2014-03-26",
			            "release": 148027043,
			            "beta": 40027043,
			            "alpha": 40027043
			        },
			        {
			            "date": "2014-03-27",
			            "release": 148057022,
			            "beta": 40057022,
			            "alpha": 40057022
			        },
			        {
			            "date": "2014-03-28",
			            "release": 149057022,
			            "beta": 41057022,
			            "alpha": 40057022
			        },
			        {
			            "date": "2014-03-29",
			            "release": 150057022,
			            "beta": 42057022,
			            "alpha": 42057022
			        },
			        {
			            "date": "2014-03-30",
			            "release": 151057022,
			            "beta": 43057022,
			            "alpha": 43057022
			        },
			        {
			            "date": "2014-03-31",
			            "release": 152057022,
			            "beta": 44057022,
			            "alpha": 44057022
			        },
			        {
			            "date": "2014-04-01",
			            "release": 152056143,
			            "beta": 45056143,
			            "alpha": 42056143
			        }
			    ]

				// Restangular.one('users/nodes').get().then(function(data) {
				// 	console.log(data);
				// 	// scope.userNodes = data;
				// });


				var options1 = {
					title: "Downloads in the node..",
					// description: "We sometimes have the need to split the data and then gracefully update the graphic with the newly selected subset of data.",
					width: $('#chart-1').width(),
					height: $('#ui-view-main-wrapper').height() * 50 / 100,
					xax_count: 4,
					target: '#chart-1',
					x_accessor: 'date',
					y_accessor: 'release'
				};

				var options2 = {
					title: "Downloads in the node..",
					// description: "We sometimes have the need to split the data and then gracefully update the graphic with the newly selected subset of data.",
					width: $('#chart-2').width(),
					height: $('#ui-view-main-wrapper').height() * 50 / 100,
					xax_count: 4,
					target: '#chart-2',
					x_accessor: 'date',
					y_accessor: 'release'
				};

				var data = MG.convert.date(plop, 'date');
				options1.data = data;
				MG.data_graphic(options1);
				options2.data = data;
				MG.data_graphic(options2);

				// Restangular.one('reports').get().then(function(data) {
				// 	data = MG.convert.date(data, 'date');
				// 	// globals.data = data;
				// 	options1.data = data;
				// 	MG.data_graphic(options1);
					
				// });

				// Restangular.one('reports').get().then(function(data) {
				// 	data = MG.convert.date(data, 'date');
				// 	// globals.data = data;
				// 	options2.data = data;
				// 	MG.data_graphic(options2);
					
				// });

				// $('.split-by-controls button').click(function() {
				// 	var new_y_accessor = $(this).data('y_accessor');
				// 	split_by_params.y_accessor = new_y_accessor;

				// 	// change button state
				// 	$(this).addClass('active').siblings().removeClass('active');

				// 	// update data
				// 	delete split_by_params.xax_format;
				// 	MG.data_graphic(split_by_params);
				// });
					
			}
		};
		
	}]);
}());