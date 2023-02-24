
'use strict';
angular.module('bulletin').controller('bulletinCtl', function ($scope, $http) {
  $(".navbar-brand.navmenu").html("");
  $(".navbar-brand.navmenu").text("MEKONG FLASH FLOOD GUIDANCE");
  $("#select_date").datepicker({
    format: 'yyyy/mm/dd',
    autoclose: true
  });
  $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  // Send this header only in post requests. Specifies you are sending a JSON object
  $http.defaults.headers.post['dataType'] = 'json'

  /**
   * Alert
   */
   $("#closeAlert").click(function(){
     $('.alert').addClass('display-none');
     $("#alertContent").text('');
    $("#alertType").text('');
   })


  var showErrorAlert = function (alertContent) {
      $("#alertContent").text(alertContent);
      $("#alertType").text("Error! ");
      $('.alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-success').addClass('alert-danger');
  };

  var showSuccessAlert = function (alertContent) {
      $("#alertContent").text(alertContent);
      $("#alertType").text("Success! ");
      $('.alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-danger').addClass('alert-success');
  };

  var showInfoAlert = function (alertContent) {
      $("#alertContent").text(alertContent);
      $("#alertType").text("Info! ");
      $('.alert').removeClass('display-none').removeClass('alert-success').removeClass('alert-danger').addClass('alert-info');
  };

  var totalEvents = 0;
  var totalEventLand = 0;
  var totalEventOcean = 0;
  	/**
  		* initialize leaflet map
  		*/
      var map_options = {
  			zoomControl: false,
  			minZoom: 0,
  			maxZoom: 20,
  			maxBounds: [ [-10, 160],[50, 20]],
  			timeDimension: true,
        scrollWheelZoom: false,
  		};
  		var map_ffg01 = L.map('map_FFG01',map_options).setView([15.300, 101.9925], 5);
      var map_ffg03 = L.map('map_FFG03',map_options).setView([15.300, 101.9925], 5);
      var map_ffg06 = L.map('map_FFG06',map_options).setView([15.300, 101.9925], 5);
      var map_fmap101 = L.map('map_FMAP101',map_options).setView([15.300, 101.9925], 5);
      var map_fmap103 = L.map('map_FMAP103',map_options).setView([15.300, 101.9925], 5);
      var map_fmap106 = L.map('map_FMAP106',map_options).setView([15.300, 101.9925], 5);

  		/**
  		* initial white theme basemap
  		*/
  		var mbAttr = 'Map data &copy; <a href="https://www.mapbox.com/">MapBox</a> contributors';
  		var mbUrl = 'https://api.mapbox.com/styles/v1/servirmekong/ckecozln92fkk19mjhuoqxhuw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g';
  		var basemap_layer_ffg01 = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
      var basemap_layer_ffg03 = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
      var basemap_layer_ffg06 = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
      var basemap_layer_fmap101 = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
      var basemap_layer_fmap103 = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
      var basemap_layer_fmap106 = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

  		basemap_layer_ffg01.addTo(map_ffg01);
      basemap_layer_ffg03.addTo(map_ffg03);
      basemap_layer_ffg06.addTo(map_ffg06);
      basemap_layer_fmap101.addTo(map_fmap101);
      basemap_layer_fmap103.addTo(map_fmap103);
      basemap_layer_fmap106.addTo(map_fmap106);

      // var GEOSERVER_ADDRESS= "https://geoserver.adpc.net/geoserver/mekong-admin/wms";
      // var WMSCONFIG ={
			// 				'transparent': true,
			// 				'service':'WMS',
			// 				'version':'1.1.0',
			// 				'request':'GetMap',
			// 				'layers':'mekong-admin:mrcffg_basins_simplify',
			// 				'format':'image/png',
			// 				'tiled' : true,
			// 			};
      //
      // var mrcBasinsWMS_1 = L.tileLayer.wms(GEOSERVER_ADDRESS, WMSCONFIG);
      // var mrcBasinsWMS_2 = L.tileLayer.wms(GEOSERVER_ADDRESS, WMSCONFIG);
      // var mrcBasinsWMS_3 = L.tileLayer.wms(GEOSERVER_ADDRESS, WMSCONFIG);
      // var mrcBasinsWMS_4 = L.tileLayer.wms(GEOSERVER_ADDRESS, WMSCONFIG);
      // var mrcBasinsWMS_5 = L.tileLayer.wms(GEOSERVER_ADDRESS, WMSCONFIG);
      // var mrcBasinsWMS_6 = L.tileLayer.wms(GEOSERVER_ADDRESS, WMSCONFIG);
      //
      // mrcBasinsWMS_1.addTo(map_ffg01);
      // mrcBasinsWMS_2.addTo(map_ffg03);
      // mrcBasinsWMS_3.addTo(map_ffg06);
      // mrcBasinsWMS_4.addTo(map_fmap101);
      // mrcBasinsWMS_5.addTo(map_fmap103);
      // mrcBasinsWMS_6.addTo(map_fmap106);

      // var selected_country ='';
      // var selected_date ='';

      var selected_country =sessionStorage.getItem("selected_country");
      var selected_date =sessionStorage.getItem("selected_date");

      $(document).ready(()=>{
        $("#country_select option[value="+selected_country+"]").attr('selected', 'selected');
        $("#country_select").change();
      });

      var queryDate = new Date(selected_date);
      $('#select_date').datepicker('setDate', queryDate);
      selected_date = selected_date.replace("/","").replace("/","");
      // sessionStorage.setItem("selected_country", '');
      // sessionStorage.setItem("selected_date", '');
      // console.log(selected_date)
      // map_ffg01.addLayer(mrcBasinsWMS);


  		// Load geographic coverage area Geojson
      var basin_style = {
         fillColor: '#9999ff',
         weight: 0.2,
         opacity: 1,
         color: 'white',
         fillOpacity: 0.1
       };
      var mrcbasins;

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

    },
    error: function() {
      alert("error")
    }
  });


	$scope.getNumberofStorms('realtime');



   var country_data;

   var country_bb;
   var basin_style = {
      fillColor: '#9999ff',
      weight: 0.2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.1
    };

  var mrc_ffg01 = null;
  var mrc_ffg06 = null;
  var mrc_fmap101 = null;
  var mrc_fmap103 = null;
  var mrc_fmap106 = null;
  var mrc_ffg03 = null;

  $scope.fetchFFG = function () {
    $("#ffg-01h-table").html("");
    $("#ffg-03h-table").html("");
    $("#ffg-06h-table").html("");
    selected_date=$('#select_date').val().split("/");
    selected_date=selected_date[0]+selected_date[1]+selected_date[2];

    // $.ajax("/FFGS/"+selected_date+"-ffgs_result_01hour.csv", {
    //   success: function(data) {
    //     var csv =  CSVToArray(data);
    //     var risk_level = '';
    //     for(var i=1; i<csv.length-1; i++){
    //       if(csv[i][4] === 'Low-Risk'){
    //         risk_level = 'lightgreen'
    //       }else if(csv[i][4] === 'Moderate-Risk'){
    //         risk_level = 'yellow'
    //       }else if(csv[i][4] === 'High-Risk'){
    //         risk_level = 'red'
    //       }else if(csv[i][4] === 'Extreme-Risk'){
    //         risk_level = 'pink'
    //       }

    //       if(csv[i][0].toLowerCase() === selected_country){
    //         var _td = '<tr>'+
    //         '  <td>'+csv[i][1]+'</td>'+
    //         '  <td>'+csv[i][2]+'</td>'+
    //         '  <td>'+csv[i][5]+'</td>'+
    //         '  <td>'+csv[i][6]+'</td>'+
    //         '  <td>'+csv[i][11]+'</td>'+
    //         '  <td>'+csv[i][14]+'</td>'+
    //         '  <td>'+csv[i][16]+'</td>'+
    //         '  <td>'+csv[i][17]+'</td>'+
    //           '  <td style="background:'+risk_level+';">'+csv[i][4]+'</td>'+
    //           '</tr>'
    //         $("#ffg-01h-table").append(_td)
    //       }
    //     }
    //   },
    //   error: function() {
    //     alert("error")
    //   }
    // });

    // $.ajax("/FFGS/"+selected_date+"-ffgs_result_03hour.csv", {
    //   success: function(data) {
    //     var csv =  CSVToArray(data);
    //     var risk_level = '';
    //     for(var i=1; i<csv.length-1; i++){
    //       if(csv[i][4] === 'Low-Risk'){
    //         risk_level = 'lightgreen'
    //       }else if(csv[i][4] === 'Moderate-Risk'){
    //         risk_level = 'yellow'
    //       }else if(csv[i][4] === 'High-Risk'){
    //         risk_level = 'red'
    //       }else if(csv[i][4] === 'Extreme-Risk'){
    //         risk_level = 'pink'
    //       }
    //       if(csv[i][0].toLowerCase() === selected_country){
    //         var _td = '<tr>'+
    //         '  <td>'+csv[i][1]+'</td>'+
    //         '  <td>'+csv[i][2]+'</td>'+
    //         '  <td>'+csv[i][5]+'</td>'+
    //         '  <td>'+csv[i][6]+'</td>'+
    //         '  <td>'+csv[i][11]+'</td>'+
    //         '  <td>'+csv[i][14]+'</td>'+
    //         '  <td>'+csv[i][16]+'</td>'+
    //         '  <td>'+csv[i][17]+'</td>'+
    //           '  <td style="background:'+risk_level+';">'+csv[i][4]+'</td>'+
    //           '</tr>'
    //         $("#ffg-03h-table").append(_td)
    //       }
    //     }

    //   },
    //   error: function() {
    //     alert("error")
    //   }
    // });

    var subprovince;

    $.getJSON('data/'+selected_country+'_mrcffg_basins.geojson')
				.done(function (data, status) {
			    mrcbasins = data.features;
				});

			$.getJSON('data/subprovincesFFGS_'+selected_country+'.geojson')
			.done(function (data, status) {
				subprovince = data.features;
        $scope.fetchRiskSubprovinces();
				
			});

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var riskAreas;
    var mrc_riskmap;
    var fetchRisk_data;
    $scope.fetchRiskSubprovinces = function () {
      $.ajax({
         url: "/FFGS/"+selected_date+"-0600_ff_risk.csv",
       }).done(function (data, textStatus, jqXHR) {
       var data = JSON.parse(CSV2JSON(data));
      var filterData = [];

      if(selected_country === 'mekong'){
        fetchRisk_data = data;
        if(fetchRisk_data.length < 1){
          showErrorAlert("No Flash flood Waning in Mekong countries");
        }else{
          showSuccessAlert("Show Flash flood Waning (Risk level) per sub-province");
        }
      }else{
        for(var i=0; i<data.length-1; i++){
          if(data[i]["country"].toLowerCase() === selected_country){
            filterData.push(data[i]);
          }
        }
        fetchRisk_data=  filterData;
        if(fetchRisk_data.length < 1){
          showErrorAlert("No Flash flood Waning in "+ selected_country);
        }else{
          showSuccessAlert("Show Flash flood Waning (Risk level) per sub-province");
        }
      }

       //check FFG csv is exist
       var returnKeys = Object.keys(fetchRisk_data[0]);
       if(returnKeys[0] === '<!DOCTYPE html>'){
         showErrorAlert("No data is available for the selected date.");
       }else{

        // showSuccessAlert("Show "+ param_text );

        riskAreas = subprovince;
        for(var i=0; i< subprovince.length; i++){
          for(var j=0; j< fetchRisk_data.length; j++){
            if(subprovince[i]["properties"]["area_id"] === parseInt(fetchRisk_data[j]["area_id"])){
              riskAreas[i]["properties"]["risk"] = fetchRisk_data[j]["risk"];
            }
          }
        }
       
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
        var count_cities = 0;

        for(var i=1; i<riskAreas.length-1; i++){
          var row = riskAreas[i].properties;
          //['name_0', 'prov', 'district', 'region', 'levelrisk','Hospitals', 'total_pop','Female', 'Male','F_0-15', 'F_15-65','F_>65', 'M_0-15', 'M_15-65','M_>65', 'trunks', 'primary','secondary']
          if(row["risk"] === 'High-Risk' || row["risk"] === 'Extreme-Risk'){
            count_cities += 1;
              if (row["Hospitals"] !== '') critical_hospital  += parseInt(row["Hospitals"])
              if (row["Trunks"] !== '') critical_road_trucks += parseInt(row["Trunks"])
              if (row["Primary"] !== '') critical_road_primary += parseInt(row["Primary"])
              if (row["Secondary"] !== '') critical_road_secondary += parseInt(row["Secondary"])
              if (row["total_pop"] !== '') total_pop  += parseInt(row["total_pop"])
              if (row["Female"] !== '') Female  += parseInt(row["Female"])
              if (row["Male"] !== '') Male += parseInt(row["Male"])
              if (row["F_0_15"] !== '') F_0_5 += parseInt(row["F_0_15"])
              if (row["F_15_65"] !== '') F_15_65 += parseInt(row["F_15_65"])
              if (row["F__65"] !== '') F_65  += parseInt(row["F__65"])
              if (row["M_0_15"] !== '') M_0_5 += parseInt(row["M_0_15"])
              if (row["M_15_65"] !== '') M_15_65 += parseInt(row["M_15_65"])
              if (row["M__65"] !== '') M_65 += parseInt(row["M__65"])
  
              // critical_hospital  += parseInt(csv[i][5])
              // critical_road_trucks += parseInt(csv[i][14])
              // critical_road_primary += parseInt(csv[i][15])
              // critical_road_secondary += parseInt(csv[i][16])
              if(row["risk"] === 'Low-Risk'){
                risk_level = 'lightgreen'
              }else if(row["risk"] === 'Moderate-Risk'){
                risk_level = 'yellow'
              }else if(row["risk"] === 'High-Risk'){
                risk_level = 'red'
              }else if(row["risk"] === 'Extreme-Risk'){
                risk_level = '#E700E7'
              }
  
              var _td = '<tr>'+
              '  <td>'+row["NAME_0"]+'</td>'+
              '  <td>'+row["NAME_1"]+'</td>'+
              '  <td>'+row["NAME_2"]+'</td>'+
              '  <td>'+row["total_pop"]+'</td>'+
              '  <td>'+row["Male"]+'</td>'+
              '  <td>'+row["Female"]+'</td>'+
              // '  <td>'+row["Hospitals"]+'</td>'+
              // '  <td>'+row["GDP_in_cur"]+'</td>'+
              // '  <td>'+row["Cropland_E"]+'</td>'+
              // '  <td>'+row["Bulding_nu"]+'</td>'+
              // '  <td>'+row["Primary"]+'</td>'+
              // '  <td>'+row["Secondary"]+'</td>'+
              // '  <td>'+row["Trunks"]+'</td>'+
                '  <td style="background:'+risk_level+';">'+row["risk"]+'</td>'+
                '</tr>'
              $("#ffg-06h-table").append(_td)
            
          }

          

        }
        $("#cities_located_in_highrisk").text(count_cities);

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

       }
      })
     
    };


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // $.ajax("/FFGS/"+selected_date+"-ffgs_result_06hour.csv", {
    //   success: function(data) {
    //     var csv =  CSVToArray(data);
    //     var risk_level = '';
    //     var critical_hospital  = 0;
    //     var critical_road_trucks =0;
    //     var critical_road_primary =0;
    //     var critical_road_secondary =0;
    //     var total_pop =0;
    //     var Female  = 0;
    //     var Male =0;
    //     var F_0_5 =0;
    //     var F_15_65 =0;
    //     var F_65  = 0;
    //     var M_0_5 =0;
    //     var M_15_65 =0;
    //     var M_65 =0;

    //     for(var i=1; i<csv.length-1; i++){
    //       //['name_0', 'prov', 'district', 'region', 'levelrisk','Hospitals', 'total_pop','Female', 'Male','F_0-15', 'F_15-65','F_>65', 'M_0-15', 'M_15-65','M_>65', 'trunks', 'primary','secondary']
    //       if(selected_country === 'mekong'){
    //         if (csv[i][5] !== '') critical_hospital  += parseInt(csv[i][5])
    //         if (csv[i][15] !== '') critical_road_trucks += parseInt(csv[i][15])
    //         if (csv[i][16] !== '') critical_road_primary += parseInt(csv[i][16])
    //         if (csv[i][17] !== '') critical_road_secondary += parseInt(csv[i][17])

    //         if (csv[i][6] !== '') total_pop  += parseInt(csv[i][6])
    //         if (csv[i][7] !== '') Female  += parseInt(csv[i][7])
    //         if (csv[i][8] !== '') Male += parseInt(csv[i][8])
    //         if (csv[i][9] !== '') F_0_5 += parseInt(csv[i][9])
    //         if (csv[i][10] !== '') F_15_65 += parseInt(csv[i][10])
    //         if (csv[i][11] !== '') F_65  += parseInt(csv[i][11])
    //         if (csv[i][12] !== '') M_0_5 += parseInt(csv[i][12])
    //         if (csv[i][13] !== '') M_15_65 += parseInt(csv[i][13])
    //         if (csv[i][14] !== '') M_65 += parseInt(csv[i][14])

    //         // critical_hospital  += parseInt(csv[i][5])
    //         // critical_road_trucks += parseInt(csv[i][14])
    //         // critical_road_primary += parseInt(csv[i][15])
    //         // critical_road_secondary += parseInt(csv[i][16])
    //         if(csv[i][4] === 'Low-Risk'){
    //           risk_level = 'lightgreen'
    //         }else if(csv[i][4] === 'Moderate-Risk'){
    //           risk_level = 'yellow'
    //         }else if(csv[i][4] === 'High-Risk'){
    //           risk_level = 'red'
    //         }else if(csv[i][4] === 'Extreme-Risk'){
    //           risk_level = 'pink'
    //         }

    //         var _td = '<tr>'+
    //         '  <td>'+csv[i][0]+'</td>'+
    //         '  <td>'+csv[i][1]+'</td>'+
    //         '  <td>'+csv[i][2]+'</td>'+
    //         '  <td>'+csv[i][5]+'</td>'+
    //         '  <td>'+csv[i][6]+'</td>'+
    //         '  <td>'+csv[i][11]+'</td>'+
    //         '  <td>'+csv[i][14]+'</td>'+
    //         '  <td>'+csv[i][16]+'</td>'+
    //         '  <td>'+csv[i][17]+'</td>'+
    //           '  <td style="background:'+risk_level+';">'+csv[i][4]+'</td>'+
    //           '</tr>'
    //         $("#ffg-06h-table").append(_td)
    //       }else{
    //         if(csv[i][0].toLowerCase() === selected_country){
    //           if (csv[i][5] !== '') critical_hospital  += parseInt(csv[i][5])
    //           if (csv[i][15] !== '') critical_road_trucks += parseInt(csv[i][15])
    //           if (csv[i][16] !== '') critical_road_primary += parseInt(csv[i][16])
    //           if (csv[i][17] !== '') critical_road_secondary += parseInt(csv[i][17])

    //           if (csv[i][6] !== '') total_pop  += parseInt(csv[i][6])
    //           if (csv[i][7] !== '') Female  += parseInt(csv[i][7])
    //           if (csv[i][8] !== '') Male += parseInt(csv[i][8])
    //           if (csv[i][9] !== '') F_0_5 += parseInt(csv[i][9])
    //           if (csv[i][10] !== '') F_15_65 += parseInt(csv[i][10])
    //           if (csv[i][11] !== '') F_65  += parseInt(csv[i][11])
    //           if (csv[i][12] !== '') M_0_5 += parseInt(csv[i][12])
    //           if (csv[i][13] !== '') M_15_65 += parseInt(csv[i][13])
    //           if (csv[i][14] !== '') M_65 += parseInt(csv[i][14])

    //           // critical_hospital  += parseInt(csv[i][5])
    //           // critical_road_trucks += parseInt(csv[i][14])
    //           // critical_road_primary += parseInt(csv[i][15])
    //           // critical_road_secondary += parseInt(csv[i][16])
    //           if(csv[i][4] === 'Low-Risk'){
    //             risk_level = 'lightgreen'
    //           }else if(csv[i][4] === 'Moderate-Risk'){
    //             risk_level = 'yellow'
    //           }else if(csv[i][4] === 'High-Risk'){
    //             risk_level = 'red'
    //           }else if(csv[i][4] === 'Extreme-Risk'){
    //             risk_level = 'pink'
    //           }

    //           var _td = '<tr>'+
    //           '  <td>'+csv[i][0]+'</td>'+
    //           '  <td>'+csv[i][1]+'</td>'+
    //           '  <td>'+csv[i][2]+'</td>'+
    //           '  <td>'+csv[i][5]+'</td>'+
    //           '  <td>'+csv[i][6]+'</td>'+
    //           '  <td>'+csv[i][11]+'</td>'+
    //           '  <td>'+csv[i][14]+'</td>'+
    //           '  <td>'+csv[i][16]+'</td>'+
    //           '  <td>'+csv[i][17]+'</td>'+
    //             '  <td style="background:'+risk_level+';">'+csv[i][4]+'</td>'+
    //             '</tr>'
    //           $("#ffg-06h-table").append(_td)
    //         }
    //       }

    //     }

    //     $("#critical_hospital").text(critical_hospital);
    //     $("#critical_road_trucks").text(critical_road_trucks);
    //     $("#critical_road_primary").text(critical_road_primary);
    //     $("#critical_road_secondary").text(critical_road_secondary);

    //     $("#total_pop").text(total_pop);
    //     $("#female_total_pop").text(Female);
    //     $("#male_total_pop").text(Male);

    //     $("#female_pop_age1").text(F_0_5);
    //     $("#female_pop_age2").text(F_15_65);
    //     $("#female_pop_age3").text(F_65);

    //     $("#male_pop_age1").text(M_0_5);
    //     $("#male_pop_age2").text(M_15_65);
    //     $("#male_pop_age3").text(M_65);

    //   },
    //   error: function() {
    //     alert("error")
    //   }
    // });

    $.ajax("/FFGS/mrcffg_"+selected_date+"06.csv", {
      success: function(data) {
        var fetchFFG_data = JSON.parse(CSV2JSON(data));
        //check FFG csv is exist
        var returnKeys = Object.keys(fetchFFG_data[0]);
        if(returnKeys[0] === '<!DOCTYPE html>'){
          showErrorAlert("No data is available for the selected date.");
          $("#export_options").css("display", "none");
        }else{
          $("#export_options").css("display", "block");
          showSuccessAlert("Show data of "+ selected_country );
				var no_country = 0;
				var no_province = 0;
				var basin_features=[];
        country_data = mrcbasins;
        for(var i=0; i< mrcbasins.length; i++){
          for(var j=0; j< fetchFFG_data.length; j++){
            if(mrcbasins[i]["properties"]["value"] === parseInt(fetchFFG_data[j]["BASIN"])){
              country_data[i]["properties"] = fetchFFG_data[j]
            }
          }
        }
        var ffg_basins_style = {
           fillColor: '#FFF',
           weight: 0.5,
           opacity: 0.5,
           color: 'white',
           fillOpacity: 1
         };

         if(map_ffg01.hasLayer(mrc_ffg01)){
           map_ffg01.removeLayer(mrc_ffg01);
         }
         if(map_ffg03.hasLayer(mrc_ffg03)){
           map_ffg03.removeLayer(mrc_ffg03);
         }
         if(map_ffg06.hasLayer(mrc_ffg06)){
           map_ffg06.removeLayer(mrc_ffg06);
         }
         if(map_fmap101.hasLayer(mrc_fmap101)){
           map_fmap101.removeLayer(mrc_fmap101);
         }
         if(map_fmap103.hasLayer(mrc_fmap103)){
           map_fmap103.removeLayer(mrc_fmap103);
         }
         if(map_fmap106.hasLayer(mrc_fmap106)){
           map_fmap106.removeLayer(mrc_fmap106);
         }

        mrc_ffg01 = L.geoJSON(country_data, {
          style: ffg_basins_style,
          onEachFeature: function (feature, layer) {
            if (feature.properties.FFG01 <= 0) {
                layer.setStyle({fillColor :'#FFF',fillOpacity: 0,color: '#c7c7c7'});
            }else if (feature.properties.FFG01 <= 15) {
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG01 <= 30){
                layer.setStyle({fillColor :'#FF0000',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG01 <= 60){
                layer.setStyle({fillColor :'#E5E500',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG01 <= 100){
                layer.setStyle({fillColor :'#00E200',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG01 <= 160){
                layer.setStyle({fillColor :'#2900D9',opacity: 0.2,color: '#c7c7c7'});
            } else if (feature.properties.FFG01 <= 220){
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            } else  if (feature.properties.FFG01 <= 1000){
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            }
          }
        }).addTo(map_ffg01);


        mrc_ffg03 = L.geoJSON(country_data, {
          style: ffg_basins_style,
          onEachFeature: function (feature, layer) {
            if (feature.properties.FFG03 <= 0) {
                layer.setStyle({fillColor :'#FFF',fillOpacity: 0,color: '#c7c7c7'});
            }else if (feature.properties.FFG03 <= 15) {
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG03 <= 30){
                layer.setStyle({fillColor :'#FF0000',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG03 <= 60){
                layer.setStyle({fillColor :'#E5E500',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG03 <= 100){
                layer.setStyle({fillColor :'#00E200',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG03 <= 160){
                layer.setStyle({fillColor :'#2900D9',opacity: 0.2,color: '#c7c7c7'});
            } else if (feature.properties.FFG03 <= 220){
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            } else  if (feature.properties.FFG03 <= 1000){
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            }
          }
        }).addTo(map_ffg03);


        mrc_ffg06 = L.geoJSON(country_data, {
          style: ffg_basins_style,
          onEachFeature: function (feature, layer) {
            if (feature.properties.FFG01 <= 0) {
                layer.setStyle({fillColor :'#FFF',fillOpacity: 0,color: '#c7c7c7'});
            }else if (feature.properties.FFG06 <= 15) {
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG06 <= 30){
                layer.setStyle({fillColor :'#FF0000',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG06 <= 60){
                layer.setStyle({fillColor :'#E5E500',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG06 <= 100){
                layer.setStyle({fillColor :'#00E200',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FFG06 <= 160){
                layer.setStyle({fillColor :'#2900D9',opacity: 0.2,color: '#c7c7c7'});
            } else if (feature.properties.FFG06 <= 220){
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            } else  if (feature.properties.FFG06 <= 1000){
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            }
          }
        }).addTo(map_ffg06);


        mrc_fmap101 = L.geoJSON(country_data, {
          style: ffg_basins_style,
          onEachFeature: function (feature, layer) {
            if (feature.properties.FMAP101 <= 0) {
                layer.setStyle({fillColor :'#FFF',fillOpacity: 0,color: '#c7c7c7'});
            }else if (feature.properties.FMAP101 <= 30) {
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP101 <= 70){
                layer.setStyle({fillColor :'#2900D9',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP101 <= 120){
                layer.setStyle({fillColor :'#00E200',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP101 <= 180){
                layer.setStyle({fillColor :'#E5E500',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP101 <= 240){
                layer.setStyle({fillColor :'#FF0000',opacity: 0.2,color: '#c7c7c7'});
            } else if (feature.properties.FMAP101 <= 300){
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            } else  if (feature.properties.FMAP101 <= 1000){
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            }
          }
        }).addTo(map_fmap101);


        mrc_fmap103 = L.geoJSON(country_data, {
          style: ffg_basins_style,
          onEachFeature: function (feature, layer) {
            if (feature.properties.FMAP103 <= 0) {
                layer.setStyle({fillColor :'#FFF',fillOpacity: 0,color: '#c7c7c7'});
            }else if (feature.properties.FMAP103 <= 30) {
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP103 <= 70){
                layer.setStyle({fillColor :'#2900D9',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP103 <= 120){
                layer.setStyle({fillColor :'#00E200',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP103 <= 180){
                layer.setStyle({fillColor :'#E5E500',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP103 <= 240){
                layer.setStyle({fillColor :'#FF0000',opacity: 0.2,color: '#c7c7c7'});
            } else if (feature.properties.FMAP103 <= 300){
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            } else  if (feature.properties.FMAP103 <= 1000){
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            }
          }
        }).addTo(map_fmap103);


        mrc_fmap106 = L.geoJSON(country_data, {
          style: ffg_basins_style,
          onEachFeature: function (feature, layer) {
            if (feature.properties.FMAP106 <= 0) {
                layer.setStyle({fillColor :'#FFF',fillOpacity: 0,color: '#c7c7c7'});
            }else if (feature.properties.FMAP106 <= 30) {
                layer.setStyle({fillColor :'#2CE5E5',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP106 <= 70){
                layer.setStyle({fillColor :'#2900D9',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP106 <= 120){
                layer.setStyle({fillColor :'#00E200',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP106 <= 180){
                layer.setStyle({fillColor :'#E5E500',opacity: 0.2,color: '#c7c7c7'});
            }else if (feature.properties.FMAP106 <= 240){
                layer.setStyle({fillColor :'#FF0000',opacity: 0.2,color: '#c7c7c7'});
            } else if (feature.properties.FMAP106 <= 300){
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            } else  if (feature.properties.FMAP106 <= 1000){
                layer.setStyle({fillColor :'#E700E7',opacity: 0.2,color: '#c7c7c7'});
            }
          }
        }).addTo(map_fmap106);
        // mrcffg_features.addTo(map_ffg03);
      }
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
    });
	};

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


  $("#country_select").change(function() {
    var selected_country = $(this).val();
    $("#country_name").text("for "+ selected_country.charAt(0).toUpperCase() + selected_country.slice(1));
    if(selected_country!=="mekong"){
      $.getJSON('data/'+selected_country+'_bb.geojson')
       .done(function (data, status) {
         country_bb = L.geoJSON(data, {});
         map_ffg01.fitBounds(country_bb.getBounds());
         map_ffg03.fitBounds(country_bb.getBounds());
         map_ffg06.fitBounds(country_bb.getBounds());
         map_fmap101.fitBounds(country_bb.getBounds());
         map_fmap103.fitBounds(country_bb.getBounds());
         map_fmap106.fitBounds(country_bb.getBounds());
       });
    }

    $.getJSON('data/'+selected_country+'_mrcffg_basins.geojson')
     .done(function (data, status) {
       mrcbasins = data.features;
       $scope.fetchFFG();
     });

  });

  $('#select_date').change(function(){
      selected_date=$('#select_date').val().split("/");
      selected_date=selected_date[0]+selected_date[1]+selected_date[2];
      // $scope.fetchFFG();
      // console.log(selected_date);
  });

  $('#search-filter-btn').click(function() {
		// selected_date = $("#select_date").val();
		selected_country = $("#country_select option:selected").val();
    if(selected_country === ""){
			showInfoAlert("Please select a country");
      $("#export_options").css("display", "none");
		}else if(selected_date === ""){
			showInfoAlert("Please select date");
      $("#export_options").css("display", "none");
		}else if(selected_date !== "" &&  selected_country !== ""){
			$scope.fetchFFG();
		}

	});

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
    // Disable #x
    $("#btnSave").prop( "disabled", true );
    $("#btnExport").prop( "disabled", true );
      showInfoAlert("Please wait for a while until the report is downloaded to your computer.");
      var node = document.getElementById('div_savepng');
      domtoimage.toPng(node)
          .then(function (dataUrl) {
              var img = new Image();
              img.src = dataUrl;
              var a = document.createElement("a");
              a.href = dataUrl;
              var newDate = new Date();
              var pngfilename = "Flash-Flood-Bulletin-Mekong: " + newDate.toLocaleDateString() + " @ " + newDate.toLocaleTimeString()+ ".png";
              a.setAttribute("download", pngfilename);
              a.click();
              // Disable #x
              $("#btnSave").prop( "disabled", false );
              $("#btnExport").prop( "disabled", false );
              showSuccessAlert("The flash flood guidence report was downloaded to your computer.");
          })
          .catch(function (error) {
              console.error('oops, something went wrong!', error);
        });
    });

  $("#btnExport").click(function() {
    $scope.showLoader = true;

    // Disable #x
    $("#btnSave").prop( "disabled", true );
    $("#btnExport").prop( "disabled", true );
    showInfoAlert("Please wait for a while until the report is downloaded to your computer.");

    var pdf = new jsPDF("p", "mm", "a4");
    var width = pdf.internal.pageSize.getWidth();
    var height = pdf.internal.pageSize.getHeight();
    var currentMap = document.getElementById('section1');

    var divHeight = currentMap.clientHeight
    var divWidth = currentMap.clientWidth
    var ratio = divHeight / divWidth;
    height = ratio * width;
    var imgReportHeader;

    var reportheader = document.getElementById('report-header');
    var divHeight_reporthead = reportheader.clientHeight
    var divWidth_reporthead = reportheader.clientWidth
    var ratio_reporthead = divHeight_reporthead / divWidth_reporthead;
    var height_reporthead = ratio_reporthead * width;
    domtoimage.toPng(reportheader)
        .then(function (dataUrl) {
            imgReportHeader = new Image();
            imgReportHeader.src = dataUrl;
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
      });


    domtoimage.toPng(currentMap)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            pdf.addImage(imgReportHeader, 'PNG', 15, 10, width - 25, 10);
            pdf.addImage(img, 'PNG', 15, 20, width - 25, height - 15);

            var section2 = document.getElementById('section2');
            var divHeight = section2.clientHeight
            var divWidth = section2.clientWidth
            var ratio = divHeight / divWidth;
            height = ratio * width;

            domtoimage.toPng(section2)
                .then(function (dataUrl) {
                    var imgsection2 = new Image();
                    imgsection2.src = dataUrl;
                    pdf.addPage();
                    pdf.addImage(imgReportHeader, 'PNG', 15, 10, width - 25, 10);
                    pdf.addImage(imgsection2, 'PNG', 15, 20, width - 25, height - 15);

                    var section3 = document.getElementById('section3');
                    var divHeight = section3.clientHeight
                    var divWidth = section3.clientWidth
                    var ratio = divHeight / divWidth;
                    height = ratio * width;

                    domtoimage.toPng(section3)
                        .then(function (dataUrl) {
                            var imgsection3 = new Image();
                            imgsection3.src = dataUrl;
                            pdf.addPage();
                            pdf.addImage(imgReportHeader, 'PNG', 15, 10, width - 25, 10);
                            pdf.addImage(imgsection3, 'PNG', 15, 20, width - 25, height );

                            var newDate = new Date();
                            var pdffilename = "Flash-Flood-Bulletin-Mekong: " + newDate.toLocaleDateString() + " @ " + newDate.toLocaleTimeString()+ ".pdf";
                            pdf.save(pdffilename);
                            $scope.showLoader = false;
                            // Disable #x
                            $("#btnSave").prop( "disabled", false );
                            $("#btnExport").prop( "disabled", false );
                            showSuccessAlert("The flash flood guidence report was downloaded to your computer.");
                        })
                        .catch(function (error) {
                            console.error('oops, something went wrong!', error);
                      });
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
