
'use strict';
angular.module('home').controller('inputCtl', function ($scope, $http) {
  $(".navbar-brand.navmenu").html("");
  $(".navbar-brand.navmenu").text("RAINSTORMS TRACKER");

  var totalEvents = 0;
  var totalEventLand = 0;
  var totalEventOcean = 0;
  var apiCall = function (url, method) {
		//console.log(method, url);
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

  $scope.getNumberofStorms = function () {
		var eventsURL = '/' + $.param({action: 'get-number-events'});
		// Make a request
		apiCall(eventsURL, 'POST').then(
			function (response) {
				// Success Callback
        console.log(response.data)
        var res = response.data;
        for(var i=0; i< res.length; i++){
          $("#"+res[i].name_0).text(res[i].total);
          totalEventLand += parseInt(res[i].total);
        }
        	$scope.fetchEvents();
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}

		);
	};

	$scope.getNumberofStorms();


  $scope.fetchEvents = function () {
		var eventsURL = '/' + $.param({action: 'get-operational-events'});
		// Make a request
		apiCall(eventsURL, 'POST').then(
			function (response) {
				// Success Callback
        var data = response.data;
        console.log(data)
        var totalStorm = data.length;
        totalEvents = totalStorm;
        var level1 = 0;
        var level2 = 0;
        var level3 = 0;
        var level4 = 0;
        var level5 = 0;
        var level6 = 0;
        var level7 = 0;
        var level8 = 0;
        var level9 = 0;

        for(var i = 0; i< data.length; i++){
    				var sid =  data[i]["id"];
    				var sdate = data[i]["date2"] + ' ' +  data[i]["date"].split(" ")[1];
    				var lng = data[i]["center_lng"];
    				var lat = data[i]["center_lat"];
    				var mctime = data[i]["mctime"];
    				var mcspace = data[i]["mcspace"];
    				var mcmax = data[i]["mcmax"];
    				var mcvol = data[i]["mcvol"];
    				var total_mag = data[i]["total_mag"];

    				if(mcmax <= 45.44 && mcvol < 4.69){
    					level1 = level1 + 1;
    				}else if ( mcmax <= 61.84 && mcvol < 9.47) {
    					level2 = level2 + 1;
    				}
    				else if ( mcmax <= 72.69 && mcvol < 12.64) {
    					level3 = level3 + 1;
    				}
    				else if ( mcmax <= 83.11 && mcvol < 15.68) {
    					level4 = level4 + 1;
    				}
    				else if ( mcmax <= 96.59 && mcvol < 19.61) {
    					level5 = level5 + 1;
    				}
    				else if ( mcmax <= 106.76 && mcvol < 22.56) {
    					level6 = level6 + 1;
    				}
    				else if ( mcmax <= 116.76 && mcvol < 25.50) {
    					level7 = level7 + 1;
    				}
    				else if ( mcmax <= 130.04 && mcvol < 29.37) {
    					level8 = level8 + 1;
    				}
    				else if (mcmax >= 130.05) {
    					level9 = level9 + 1;
    				}
          }
          var pieChartData = [
            ['Level 1', level1],
            ['Level 2', level2],
            ['Level 3', level3],
            ['Level 4', level4],
            ['Level 5', level5],
            ['Level 6', level6],
            ['Level 7', level7],
            ['Level 8', level8],
            ['Level 9', level9],
          ];

            var chart = new Highcharts.Chart({
                  chart: {
                    renderTo: 'container',
                    type: 'pie',
                    style: {
                        fontFamily: 'Roboto Condensed'
                    }
                  },
                  legend: {
                     layout: 'vertical',
                     align: 'right',
                     verticalAlign: 'middle',
                     itemMarginTop: 10,
                     itemMarginBottom: 10
                   },
                  credits: {
                            enabled: false
                        },
                        exporting: {
                        	enabled: false
                         },
                  title: {
                    text: null,
                  },
                  colors: ['#E8E8E8', '#BBD5F1', '#02B0EF', '#04AD4E', '#8ED047', '#FAFA06', '#FEBF02', '#F90000', '#C40001'],
                  plotOptions: {
                    pie: {
                      innerSize: '70%',
                      dataLabels: {
                        enabled: false,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                      },
                      showInLegend: true
                    },

                  },
                  tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                  },
                  series: [{
                    name: 'No. stroms',
                    data: pieChartData
                  }]
                },
                // using

                function(chart) { // on complete

                  var xpos = '50%';
                  var ypos = '53%';
                  var circleradius = 102;

                  // Render the circl
                  // Render the text
                  chart.renderer.text('<span style="color: black; font-size:120px">'+totalStorm+'</span>', 150, 225).css({
                    width: circleradius * 2,
                    color: '#red',
                    fontSize: '16px',
                    textAlign: 'center'
                  }).attr({
                    // why doesn't zIndex get the text in front of the chart?
                    zIndex: 999
                  }).add();
                });

                totalEventOcean = totalEvents - totalEventLand;
                $("#China-Ocean").text(totalEventOcean);

			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};






});
