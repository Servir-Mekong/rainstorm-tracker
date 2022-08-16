
'use strict';
angular.module('bulletin').controller('bulletinCtl', function ($scope, $http) {
  $(".navbar-brand.navmenu").html("");
  $(".navbar-brand.navmenu").text("RAINSTORMS TRACKER");

  $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  // Send this header only in post requests. Specifies you are sending a JSON object
  $http.defaults.headers.post['dataType'] = 'json'

  var totalEvents = 0;
  var totalEventLand = 0;
  var totalEventOcean = 0;

  function CSVToArray(strData, strDelimiter) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp((
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
			// Create an array to hold our data. Give the array
			// a default empty first row.
			var arrData = [[]];
			// Create an array to hold our individual pattern
			// matching groups.
			var arrMatches = null;
			// Keep looping over the regular expression matches
			// until we can no longer find a match.
			while (arrMatches = objPattern.exec(strData)) {
				// Get the delimiter that was found.
				var strMatchedDelimiter = arrMatches[1];
				// Check to see if the given delimiter has a length
				// (is not the start of string) and if it matches
				// field delimiter. If id does not, then we know
				// that this delimiter is a row delimiter.
				if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
					// Since we have reached a new row of data,
					// add an empty row to our data array.
					arrData.push([]);
				}
				// Now that we have our delimiter out of the way,
				// let's check to see which kind of value we
				// captured (quoted or unquoted).
				if (arrMatches[2]) {
					// We found a quoted value. When we capture
					// this value, unescape any double quotes.
					var strMatchedValue = arrMatches[2].replace(
						new RegExp("\"\"", "g"), "\"");
					} else {
						// We found a non-quoted value.
						var strMatchedValue = arrMatches[3];
					}
					// Now that we have our value string, let's add
					// it to the data array.
					arrData[arrData.length - 1].push(strMatchedValue);
				}
				// Return the parsed data.
				return (arrData);
			}

			function CSV2JSON(csv) {
				var array = CSVToArray(csv);
				var objArray = [];
				for (var i = 1; i < array.length; i++) {
					objArray[i - 1] = {};
					for (var k = 0; k < array[0].length && k < array[i].length; k++) {
						var key = array[0][k];
						objArray[i - 1][key] = array[i][k]
					}
				}

				var json = JSON.stringify(objArray);
				var str = json.replace(/},/g, "},\r\n");

				return str;
			}


      $.ajax("/FFGS/15-08-2022-07-05-19-ffgs_result_01hour.csv", {
        success: function(data) {
          var csv =  CSVToArray(data);
          var risk_level = '';
          for(var i=1; i<csv.length-1; i++){
            if(csv[i][3] === 'Low-Risk'){
              risk_level = 'lightgreen'
            }else if(csv[i][3] === 'Moderate-Risk'){
              risk_level = 'yellow'
            }else if(csv[i][3] === 'High-Risk'){
              risk_level = 'red'
            }else if(csv[i][3] === 'Extreme-Risk'){
              risk_level = 'pink'
            }

            var _td = '<tr>'+
              '  <td>'+csv[i][0]+'</td>'+
              '  <td>'+csv[i][1]+'</td>'+
              '  <td>'+csv[i][4]+'</td>'+
              '  <td>'+csv[i][5]+'</td>'+
              '  <td>'+csv[i][10]+'</td>'+
              '  <td>'+csv[i][13]+'</td>'+
              '  <td>'+csv[i][15]+'</td>'+
              '  <td>'+csv[i][16]+'</td>'+
              '  <td style="background:'+risk_level+';">'+csv[i][3]+'</td>'+
              '</tr>'
            $("#ffg-01h-table").append(_td)
          }

        },
        error: function() {
          alert("error")
        }
      });

      $.ajax("/FFGS/15-08-2022-07-05-19-ffgs_result_03hour.csv", {
        success: function(data) {
          var csv =  CSVToArray(data);
          var risk_level = '';
          for(var i=1; i<csv.length-1; i++){
            if(csv[i][3] === 'Low-Risk'){
              risk_level = 'lightgreen'
            }else if(csv[i][3] === 'Moderate-Risk'){
              risk_level = 'yellow'
            }else if(csv[i][3] === 'High-Risk'){
              risk_level = 'red'
            }else if(csv[i][3] === 'Extreme-Risk'){
              risk_level = 'pink'
            }
            var _td = '<tr>'+
            '  <td>'+csv[i][0]+'</td>'+
            '  <td>'+csv[i][1]+'</td>'+
            '  <td>'+csv[i][4]+'</td>'+
            '  <td>'+csv[i][5]+'</td>'+
            '  <td>'+csv[i][10]+'</td>'+
            '  <td>'+csv[i][13]+'</td>'+
            '  <td>'+csv[i][15]+'</td>'+
            '  <td>'+csv[i][16]+'</td>'+
              '  <td style="background:'+risk_level+';">'+csv[i][3]+'</td>'+
              '</tr>'
            $("#ffg-03h-table").append(_td)
          }

        },
        error: function() {
          alert("error")
        }
      });

      $.ajax("/FFGS/15-08-2022-07-05-19-ffgs_result_06hour.csv", {
        success: function(data) {
          var csv =  CSVToArray(data);
          var risk_level = '';
          var critical_hospital  = 0;
  				var critical_road_trucks =0;
  				var critical_road_primary =0;
  				var critical_road_secondary =0;
          var total_pop =0;
          var Female  = 0;
  				var Male =0;
  				var F_0_5 =0;
  				var F_15_65 =0;
          var F_65  = 0;
  				var M_0_5 =0;
  				var M_15_65 =0;
  				var M_65 =0;

          for(var i=1; i<csv.length-1; i++){
            //['prov', 'district', 'region', 'levelrisk','Hospitals', 'total_pop','Female', 'Male','F_0-15', 'F_15-65','F_>65', 'M_0-15', 'M_15-65','M_>65', 'trunks', 'primary','secondary']
            if (csv[i][4] !== '') critical_hospital  += parseInt(csv[i][4])
            if (csv[i][14] !== '') critical_road_trucks += parseInt(csv[i][14])
            if (csv[i][15] !== '') critical_road_primary += parseInt(csv[i][15])
            if (csv[i][16] !== '') critical_road_secondary += parseInt(csv[i][16])

            if (csv[i][5] !== '') total_pop  += parseInt(csv[i][5])
            if (csv[i][6] !== '') Female  += parseInt(csv[i][6])
            if (csv[i][7] !== '') Male += parseInt(csv[i][7])
            if (csv[i][8] !== '') F_0_5 += parseInt(csv[i][8])
            if (csv[i][9] !== '') F_15_65 += parseInt(csv[i][9])
            if (csv[i][10] !== '') F_65  += parseInt(csv[i][10])
            if (csv[i][11] !== '') M_0_5 += parseInt(csv[i][11])
            if (csv[i][12] !== '') M_15_65 += parseInt(csv[i][12])
            if (csv[i][13] !== '') M_65 += parseInt(csv[i][13])

            // critical_hospital  += parseInt(csv[i][5])
            // critical_road_trucks += parseInt(csv[i][14])
            // critical_road_primary += parseInt(csv[i][15])
            // critical_road_secondary += parseInt(csv[i][16])
            console.log(critical_road_secondary)
            if(csv[i][3] === 'Low-Risk'){
              risk_level = 'lightgreen'
            }else if(csv[i][3] === 'Moderate-Risk'){
              risk_level = 'yellow'
            }else if(csv[i][3] === 'High-Risk'){
              risk_level = 'red'
            }else if(csv[i][3] === 'Extreme-Risk'){
              risk_level = 'pink'
            }
            var _td = '<tr>'+
            '  <td>'+csv[i][0]+'</td>'+
            '  <td>'+csv[i][1]+'</td>'+
            '  <td>'+csv[i][4]+'</td>'+
            '  <td>'+csv[i][5]+'</td>'+
            '  <td>'+csv[i][10]+'</td>'+
            '  <td>'+csv[i][13]+'</td>'+
            '  <td>'+csv[i][15]+'</td>'+
            '  <td>'+csv[i][16]+'</td>'+
              '  <td style="background:'+risk_level+';">'+csv[i][3]+'</td>'+
              '</tr>'
            $("#ffg-06h-table").append(_td)
          }
          $("#critical_hospital").text(critical_hospital);
          $("#critical_road_trucks").text(critical_road_trucks);
          $("#critical_road_primary").text(critical_road_primary);
          $("#critical_road_secondary").text(critical_road_secondary);

          $("#total_pop").text(total_pop);
          $("#female_total_pop").text(Female);
          $("#male_total_pop").text(Male);

          $("#female_pop_age1").text(F_0_5);
          $("#female_pop_age2").text(F_15_65);
          $("#female_pop_age3").text(F_65);

          $("#male_pop_age1").text(M_0_5);
          $("#male_pop_age2").text(M_15_65);
          $("#male_pop_age3").text(M_65);

        },
        error: function() {
          alert("error")
        }
      });


  var apiCall = function (url, method) {
		//console.log(method, url);
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

  $scope.getNumberofStorms = function (type) {

    if(type === 'realtime'){
      var eventsURL = '/' + $.param({action: 'get-realtime-number-events'});
    }else{
      var eventsURL = '/' + $.param({action: 'get-number-events'});
    }
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
        	$scope.fetchEvents(type);
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}

		);
	};

  /**
   * Filter array items based on search criteria (query)
   */
  function filterItems(arr, query) {
    return arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
  }


  $.ajax("/FFGS/ffgs-outputs.txt", {
    success: function(data) {
      var nowDate = new Date();
      var previous = new Date(nowDate.getTime());
      previous = previous.setDate(nowDate.getDate() - 1);
      previous = new Date(previous);

      var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var month_str= '';
      var prev_month_str= '';

      if((nowDate.getMonth()+1) <= 9) month_str ='0'+(nowDate.getMonth()+1)
      else month_str = (nowDate.getMonth()+1)

      if((previous.getMonth()+1) <= 9) prev_month_str ='0'+(previous.getMonth()+1)
      else month_str = (previous.getMonth()+1)

      var date = nowDate.getFullYear()+''+month_str+''+nowDate.getDate();
      var previous_date = previous.getFullYear()+''+prev_month_str+''+previous.getDate();

      $("#_date").text(nowDate.getDate());
      $("#_month").text(monthNames[nowDate.getMonth()]);
      $("#_year").text(nowDate.getFullYear());
      var hour = nowDate.getHours();
      var current_minute = nowDate.getMinutes();
      $('#timehour').text(hour+":"+current_minute);
      var timecode= '';
      if(hour <= 8){
        //MRC outputs are updated at 08:00 local time
        date = previous_date;
        timecode = '0600';
      }else if(hour <= 16){
        timecode = '0000';
      }else if(hour <= 23){
        timecode = '0600';
      }else{
        timecode = '0000';
      }

      // angular controller
      var lines = data.split('\n')//.replace("\r", "");
      var FFGS_url = "http://ffw.mrcmekong.org/ffg_new/";
      var _ffgs_prod_fcst_ffr_outlook1_12hr_regional = []
      var _ffgs_prod_fcst_ffr_outlook1_24hr_regional = []
      var _ffgs_prod_obs_map_merged_01hr_regional = []
      var _ffgs_prod_obs_map_merged_24hr_regional = []
      var _ffgs_prod_est_asm_sacsma_06hr_regional = []
      var _ffgs_prod_fcst_map_forecast1_01hr_regional = []
      var _ffgs_prod_fcst_map_forecast1_03hr_regional = []
      var _ffgs_prod_fcst_map_forecast1_06hr_regional = []
      _ffgs_prod_fcst_ffr_outlook1_12hr_regional = filterItems(lines, date+'-'+timecode+'_ffgs_prod_fcst_ffr_outlook1_12hr_regional.png');
      _ffgs_prod_fcst_ffr_outlook1_24hr_regional = filterItems(lines, date+'-'+timecode+'_ffgs_prod_fcst_ffr_outlook1_24hr_regional.png');

      _ffgs_prod_obs_map_merged_01hr_regional = filterItems(lines, date+'-'+timecode+'_ffgs_prod_obs_map_merged_01hr_regional.png');
      _ffgs_prod_obs_map_merged_24hr_regional = filterItems(lines, date+'-'+timecode+'_ffgs_prod_obs_map_merged_24hr_regional.png');
      _ffgs_prod_est_asm_sacsma_06hr_regional = filterItems(lines, date+'-'+timecode+'_ffgs_prod_est_asm_sacsma_06hr_regional.png');

      _ffgs_prod_fcst_map_forecast1_01hr_regional = filterItems(lines, date+'-'+timecode+'_ffgs_prod_fcst_map_forecast1_01hr_regional.png');
      _ffgs_prod_fcst_map_forecast1_03hr_regional = filterItems(lines, date+'-'+timecode+'_ffgs_prod_fcst_map_forecast1_03hr_regional.png');
      _ffgs_prod_fcst_map_forecast1_06hr_regional = filterItems(lines, date+'-'+timecode+'_ffgs_prod_fcst_map_forecast1_06hr_regional.png');

      if(_ffgs_prod_fcst_ffr_outlook1_12hr_regional.length === 0){
        _ffgs_prod_fcst_ffr_outlook1_12hr_regional = filterItems(lines, date+'-0000_ffgs_prod_fcst_ffr_outlook1_12hr_regional.png');
        _ffgs_prod_fcst_ffr_outlook1_24hr_regional = filterItems(lines, date+'-0000_ffgs_prod_fcst_ffr_outlook1_24hr_regional.png');

        _ffgs_prod_obs_map_merged_01hr_regional = filterItems(lines, date+'-0000_ffgs_prod_obs_map_merged_01hr_regional.png');
        _ffgs_prod_obs_map_merged_24hr_regional = filterItems(lines, date+'-0000_ffgs_prod_obs_map_merged_24hr_regional.png');
        _ffgs_prod_est_asm_sacsma_06hr_regional = filterItems(lines, date+'-0000_ffgs_prod_est_asm_sacsma_06hr_regional.png');

        _ffgs_prod_fcst_map_forecast1_01hr_regional = filterItems(lines, date+'-0000_ffgs_prod_fcst_map_forecast1_01hr_regional.png');
        _ffgs_prod_fcst_map_forecast1_03hr_regional = filterItems(lines, date+'-0000_ffgs_prod_fcst_map_forecast1_03hr_regional.png');
        _ffgs_prod_fcst_map_forecast1_06hr_regional = filterItems(lines, date+'-0000_ffgs_prod_fcst_map_forecast1_06hr_regional.png');
      }

      $("#ffgs_prod_fcst_ffr_outlook1_12hr_regional").attr("src",FFGS_url + _ffgs_prod_fcst_ffr_outlook1_24hr_regional.at(-1));
      $("#ffgs_prod_fcst_ffr_outlook1_24hr_regional").attr("src",FFGS_url +  _ffgs_prod_fcst_ffr_outlook1_24hr_regional.at(-1));

      $("#ffgs_prod_obs_map_merged_01hr_regional").attr("src",FFGS_url + _ffgs_prod_obs_map_merged_01hr_regional.at(-1));
      $("#ffgs_prod_obs_map_merged_24hr_regional").attr("src",FFGS_url +  _ffgs_prod_obs_map_merged_24hr_regional.at(-1));
      $("#ffgs_prod_est_asm_sacsma_06hr_regional").attr("src",FFGS_url + _ffgs_prod_est_asm_sacsma_06hr_regional.at(-1));

      $("#ffgs_prod_fcst_map_forecast1_01hr_regional").attr("src", FFGS_url +  _ffgs_prod_fcst_map_forecast1_01hr_regional.at(-1));
      $("#ffgs_prod_fcst_map_forecast1_03hr_regional").attr("src", FFGS_url + _ffgs_prod_fcst_map_forecast1_03hr_regional.at(-1));
      $("#ffgs_prod_fcst_map_forecast1_06hr_regional").attr("src",FFGS_url +  _ffgs_prod_fcst_map_forecast1_06hr_regional.at(-1));

    },
    error: function() {
      alert("error")
    }
  });


	$scope.getNumberofStorms('realtime');

  $scope.fetchEvents = function (type) {
    if(type === 'realtime'){
      var eventsURL = '/' + $.param({action: 'get-realtime-events'});
    }else{
      var eventsURL = '/' + $.param({action: 'get-operational-events'});
    }

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



  $("#nearrealtime_data").click(function(){
    totalEvents = 0;
    totalEventLand = 0;
    totalEventOcean = 0;
    $("#realtime_data").removeClass("active");
    $(this).addClass("active");
    var type = 'nearrealtime';
    $scope.getNumberofStorms(type);
  });
  $("#realtime_data").click(function(){
    totalEvents = 0;
    totalEventLand = 0;
    totalEventOcean = 0;
    $("#nearrealtime_data").removeClass("active");
    $(this).addClass("active");
    var type = 'realtime';
    $scope.getNumberofStorms(type);
  });

  $("#btnSave").click(function() {
      $scope.showLoader = true;
      var node = document.getElementById('section1');
      domtoimage.toPng(node)
          .then(function (dataUrl) {
              var img = new Image();
              img.src = dataUrl;
              var a = document.createElement("a");
              a.href = dataUrl;
              var newDate = new Date();
              var pngfilename = "MDCW-REPORT: " + newDate.toLocaleDateString() + " @ " + newDate.toLocaleTimeString()+ ".png";
              a.setAttribute("download", pngfilename);
              a.click();
              $scope.showLoader = false;
          })
          .catch(function (error) {
              console.error('oops, something went wrong!', error);
        });
    });

  $("#btnExport").click(function() {
    $scope.showLoader = true;
    var pdf = new jsPDF("l", "mm", "a4");
    var width = pdf.internal.pageSize.getWidth();
    var height = pdf.internal.pageSize.getHeight();

    var currentMap = document.getElementById('section1');
    domtoimage.toPng(currentMap)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            pdf.addImage(img, 'JPEG', 10, 10, width-10, height-20);

            var outlookMap = document.getElementById('section2');
            domtoimage.toPng(outlookMap)
                .then(function (dataUrl) {
                    var imgOutlok = new Image();
                    imgOutlok.src = dataUrl;
                    pdf.addPage();
                    pdf.addImage(imgOutlok, 'JPEG', 10, 10, width-10, height-20);
                    var newDate = new Date();
                    var pdffilename = "FFG-REPORT: " + newDate.toLocaleDateString() + " @ " + newDate.toLocaleTimeString()+ ".pdf";
                    pdf.save(pdffilename);
                    $scope.showLoader = false;
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
              });

        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
      });

  });



});
