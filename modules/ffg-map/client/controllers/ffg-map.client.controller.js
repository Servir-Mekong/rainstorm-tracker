

'use strict';

angular.module('core').controller('mapFFGCtrl', function ($scope, $http) {

	var filterArea = 'none';
	var affected_district ;

	$(document).ready(function(){
		$(".navbar-brand.navmenu").html("");
		$(".navbar-brand.navmenu").text("RAINSTORMS TRACKER");

		$('[data-toggle="tooltip"]').tooltip();
		$("#select_date").datepicker({
			format: 'yyyy/mm/dd',
		});
	});



	var apiCall = function (url, method) {
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

			/**
       * Alert
       */
			 $("#closeAlert").click(function(){
				 $('.custom-alert').addClass('display-none');
				 $("#alertContent").text('');
				$("#alertType").text('');
			 })


      var showErrorAlert = function (alertContent) {
					$("#alertContent").text(alertContent);
					$("#alertType").text("Error! ");
          $('.custom-alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-success').addClass('alert-danger');
      };

      var showSuccessAlert = function (alertContent) {
          $("#alertContent").text(alertContent);
					$("#alertType").text("Success! ");
          $('.custom-alert').removeClass('display-none').removeClass('alert-info').removeClass('alert-danger').addClass('alert-success');
      };

      var showInfoAlert = function (alertContent) {
          $("#alertContent").text(alertContent);
					$("#alertType").text("Info! ");
          $('.custom-alert').removeClass('display-none').removeClass('alert-success').removeClass('alert-danger').addClass('alert-info');
      };

		/**
		* initialize leaflet map
		*/
		var map = L.map('map',{
			zoomControl: false,
			minZoom: 0,
			maxZoom: 20,
			maxBounds: [ [-10, 160],[50, 20]],
			timeDimension: true,
		}).setView([15.8700, 100.9925], 6);

		/**
		* initial white theme basemap
		*/
		var mbAttr = 'Map data &copy; <a href="https://www.mapbox.com/">MapBox</a> contributors';
		var mbUrl = 'https://api.mapbox.com/styles/v1/servirmekong/ckecozln92fkk19mjhuoqxhuw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g';
		var basemap_layer   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
		basemap_layer.addTo(map);

		// lond country boundary
		var adm0;
		$.getJSON('data/adm0.geojson')
		 .done(function (data, status) {
			 adm0 = L.geoJSON(data, {
				 style: {
						fillColor: '#9999ff',
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.1
					}
			 });
			 adm0.addTo(map);
		 });

		 // Load geographic coverage area Geojson
 		var storm_boundingbox;
 		 $.getJSON('data/storm_boundingbox.geojson')
 			.done(function (data, status) {
 				storm_boundingbox = L.geoJSON(data, {
 					style: {
 				     fillColor: '#9999ff',
 				     weight: 2,
 				     opacity: 1,
 				     color: 'white',
 				     dashArray: '3',
 				     fillOpacity: 0.1
 				   }
 				});
 				//storm_boundingbox.addTo(map);
 			});

			// Load mekong BBox area Geojson
			var mekong_bb;
			 $.getJSON('data/mekong_bb.geojson')
				.done(function (data, status) {
					mekong_bb = L.geoJSON(data, {
						style: {
					     fillColor: '#9999ff',
					     weight: 1,
					     opacity: 1,
					     color: 'white',
					     dashArray: '3',
					     fillOpacity: 0.1
					   }
					});
					//mekong_bb.addTo(map);

				});



			function highlight (layer) {
				layer.setStyle({
					weight: 5,
					dashArray: ''
				});
				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToFront();
				}
			}

			function dehighlight (layer) {
				if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
					layer.setStyle({weight: 0.5});
				}
			}

			function select (layer) {
				if (selected !== null) {
					var previous = selected;
				}
				map.fitBounds(layer.getBounds());
				selected = layer;
				if (previous) {
					dehighlight(previous);
				}
			}

			var selected = null;



		 	var fetchFFG_data;
			var mrc_ffgmap;
			var country_data;
			var selected_date;
		   $scope.fetchFFG = function () {

				 $.ajax({
				    url: "/FFGS/mrcffg_"+selected_date+"0600.csv",
					}).done(function (data, textStatus, jqXHR) {

					var data = JSON.parse(CSV2JSON(data));
					fetchFFG_data=  data;

					//check FFG csv is exist
					var returnKeys = Object.keys(fetchFFG_data[0]);
					if(returnKeys[0] === '<!DOCTYPE html>'){
						showErrorAlert("No data is available for the selected date.");
					}else{
						var param_text = $('input[type=radio][name=ffg_param]:checked').attr("id");
						param_text = $("label[for='" + param_text + "']").text();
						showSuccessAlert("Show "+ param_text );

						loadCount = 0;
						$scope.events=[];
						 country_data = mrcbasins;
						 for(var i=0; i< mrcbasins.length; i++){
							 for(var j=0; j< fetchFFG_data.length; j++){
								 if(mrcbasins[i]["properties"]["value"] === parseInt(fetchFFG_data[j]["BASIN"])){
									 country_data[i]["properties"] = fetchFFG_data[j]
									 $scope.events.push(fetchFFG_data[j])
								 }
							 }
						 }

						 $("#tableOperationalList").empty();
							$("#sidenav-table").css("width", "280px");
							createLiEvents($scope.events)
							$(".detail-right").css("right", "285px");
							$(".detail-right").css("height", "auto");
							$(".detail-right").css("top", "90px");
							$(".detail-right").css("padding-top", "10px");
							$(".slide-tab-right").css("display", "none");

						 var ffg_basins_style = {
								fillColor: '#FFF',
								weight: 0.5,
								opacity: 0,
								color: 'white',
								fillOpacity: 0.2
							};
							if(map.hasLayer(mrc_ffgmap)){
								map.removeLayer(mrc_ffgmap);
							}
							var param = $('input[type=radio][name=ffg_param]:checked').val();
							var param_text = $('input[type=radio][name=ffg_param]:checked').attr("id");
							param_text = $("label[for='" + param_text + "']").text();
							showSuccessAlert("Show "+ param_text );

							var mapVals =  {
								"ASMT" : [0, 0.30, 0.65, 0.85, 0.90, 0.95, 1, 1000],
								"FFG01" : [0, 15, 30, 60, 100, 160, 220, 1000],
								"FFG03" : [0, 15, 30, 60, 100, 160, 220, 1000],
								"FFG06" : [0, 15, 30, 60, 100, 160, 220, 1000],
								"FMAP101" : [0, 30, 70, 120, 180, 240, 300, 1000],
								"FMAP103" : [0, 30, 70, 120, 180, 240, 300, 1000],
								"FMAP106" : [0, 30, 70, 120, 180, 240, 300, 1000],
								"FMAP124" : [0, 30, 70, 120, 180, 240, 300, 1000],
							}

							var mapColors =  {
								"ASMT" : ['#FFF', '#DEDC28', '#B59700', '#3EDC3A', '#006200', '#304AFC', '#170078', '#170078'],
								"FFG01" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
								"FFG03" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
								"FFG06" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
								"FMAP101" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
								"FMAP103" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
								"FMAP106" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
								"FMAP124" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
							}

						 mrc_ffgmap = L.geoJSON(country_data, {
							 style: ffg_basins_style,
							 onEachFeature: function (feature, layer) {
								 if (feature.properties[param] <= mapVals[param][0]) {
										 layer.setStyle({fillColor : mapColors[param][0],fillOpacity: 0,color: mapColors[param][0]});
								 }else if (feature.properties[param] <= mapVals[param][1]) {
										 layer.setStyle({fillColor :mapColors[param][1],fillOpacity: 0.7,opacity: 1,color: mapColors[param][1]});
								 }else if (feature.properties[param] <= mapVals[param][2]){
										 layer.setStyle({fillColor :mapColors[param][2],fillOpacity: 0.7,opacity: 1,color: mapColors[param][2]});
								 }else if (feature.properties[param] <= mapVals[param][3]){
										 layer.setStyle({fillColor :mapColors[param][3],fillOpacity: 0.7,opacity: 1,color: mapColors[param][3]});
								 }else if (feature.properties[param] <= mapVals[param][4]){
										 layer.setStyle({fillColor :mapColors[param][4],fillOpacity: 0.7,opacity: 1,color: mapColors[param][4]});
								 }else if (feature.properties[param] <= mapVals[param][5]){
										 layer.setStyle({fillColor :mapColors[param][5],fillOpacity: 0.7,opacity: 1,color: mapColors[param][5]});
								 } else if (feature.properties[param] <= mapVals[param][6]){
										 layer.setStyle({fillColor :mapColors[param][6],fillOpacity: 0.7,opacity: 1,color: mapColors[param][6]});
								 } else  if (feature.properties[param] <= mapVals[param][7]){
										 layer.setStyle({fillColor :mapColors[param][7],fillOpacity: 0.7,opacity: 1,color: mapColors[param][7]});
								 }


							 var properties_keys = Object.keys(feature.properties);
							 var tr_html = "";
							 properties_keys.forEach(function (item, index) {
								 tr_html += "<tr>"+
													 "<td style='padding-right:5px;padding-left:5px;'>"+item+"</td>"+
													 "<td style='padding-right:5px;padding-left:5px;'>"+feature.properties[item]+"</td>"+
												 "</tr>";
							 });
							 var popuptableHTML = "<table style='font-size: 10px;'><colgroup><col style='background-color: #000000'><col span='2'></colgroup>"+tr_html+"</table>"

								 layer.bindPopup(popuptableHTML);

								 layer.on('mouseover', function (e) {
										 this.openPopup(e.latlng);
										 highlight(e.target);
								 });
								 layer.on('mouseout', function (e) {
										 this.closePopup();
										 dehighlight(e.target);
								 });


							 }
						 }).addTo(map);
					}


				 })
				 .fail(function (jqXHR, textStatus, errorThrown) {
					 alert("rest")
    		})




		 	};

		   //$scope.fetchFFG();



	// colors to use for the categories
	var colors = ['#cbd3e6', '#90a5c2', '#5a7ba8', '#1a4e87', '#153e6c'];
	var colors = ['#bedde0', '#70c6d9', '#00b7d5', '#00a0c6', '#007ba2'];
	var colors = ['#E8E8E8', '#BBD5F1', '#02B0EF', '#04AD4E', '#8ED047', '#FAFA06', '#FEBF02', '#F90000', '#C40001'];

	var excelDate;
	var loadCount = 0;


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

	var stormMarkers;
	// /////////////////////////////////////////////////////////////////////////////
	var createLiEvents = function(data){
		loadCount = 0;
		excelDate = '';

		excelDate = data;

		$("#found-no").text("Found "+data.length);

		$("#tableOperationalList").append('<li id="loadmore-op-btn" style="text-align:center;cursor: pointer;">'+
		'Load More'+
		'</li>');
		$("#loadmore-op-btn").click();

	}

	$('#zoom-in').click(function(){
		var zl = map.getZoom();
		map.setZoom(zl + 1);
	});
	$('#zoom-out').click(function(){
		var zl = map.getZoom();
		map.setZoom(zl - 1);
	});
	$('#layer-control').click(function(){

	});

	$('#streets-v11').click(function(){
		map.setStyle('mapbox://styles/mapbox/streets-v11');
		$(this).addClass('active');
		$('#light-v10').removeClass('active');
		$('#dark-v10').removeClass('active');
		$('#satellite-v9').removeClass('active');
	});
	$('#light-v10').click(function(){
		map.setStyle('mapbox://styles/mapbox/light-v10');
		$(this).addClass('active');
		$('#dark-v10').removeClass('active');
		$('#streets-v11').removeClass('active');
		$('#satellite-v9').removeClass('active');
	});
	$('#dark-v10').click(function(){
		map.setStyle('mapbox://styles/mapbox/dark-v10');
		$(this).addClass('active');
		$('#light-v10').removeClass('active');
		$('#streets-v11').removeClass('active');
		$('#satellite-v9').removeClass('active');
	});
	$('#satellite-v9').click(function(){
		map.setStyle('mapbox://styles/mapbox/satellite-v9');
		$(this).addClass('active');
		$('#streets-v11').removeClass('active');
		$('#light-v10').removeClass('active');
		$('#dark-v10').removeClass('active');
	});

	$('.slide-tab-right').click(function() {
		$("#sidenav-table").css("width", "280px");
		$(".detail-right").css("right", "285px");
		$(".detail-right").css("height", "auto");
		$(".detail-right").css("top", "90px");
		$(".detail-right").css("padding-top", "10px");
		$(".slide-tab-right").css("display", "none");
		$("#minimize-detail-panel").css("right", "285px");

	});

	$('#menu-close-btn').click(function() {
		$("#menuSidenav").css("width", "0px");
		$(".main").css("marginLeft", "0px");
	});

	$('#table-close').click(function() {
		$("#sidenav-table").css("width", "0px");
		$(".detail-right").css("right", "10px");
		$(".slide-tab-right").css("right", "0");
		$(".slide-tab-right").css("display", "block");

		$("#minimize-detail-panel").css("right", "10px")
	});

	$('.box-closebtn').click(function() {
		$("#detail-panel").css("width", "0px");

		if(map.hasLayer(tdWmsLayer)){
			map.removeLayer(tdWmsLayer);
		}
		if(map.hasLayer(routePolyline)){
			map.removeLayer(routePolyline);
		}
		if(map.hasLayer(affected_district)){
			map.removeLayer(affected_district);
		}


		if (currentMarkers!==null) {
	    for (var i = currentMarkers.length - 1; i >= 0; i--) {
	      currentMarkers[i].remove();
	    }
		}
		// $("#toggle_storm_image").css('display', 'none');
		$("#toggle_storm_affected_area").css('display', 'none');

		showStromPoints();
	});


	$('.minimizebtn').click(function() {
		$('#detail-panel').toggleClass("hide");
		$('#minimize-detail-panel').toggleClass("hide");

		if($("#sidenav-table").css("width") == "280px"){
			$('#minimize-detail-panel').css("right", "285px");
		}else{
			$('#minimize-detail-panel').css("right", "10px");
		}
	});


	$('.closeMenu').click(function() {
		$("#menu-left").css("width", "0px");
		$("#menu-left").css("top", "85px");
		$("#menu-layers").css("width", "0px");
		$("#menu-layers").css("top", "85px");
		$(".slide-tab-search").css("left","0");
		$(".slide-tab-layer").css("left","0");
		$(".map-component").css("left", "5px");
		$(".map-component").css("left", "5px");
	});

	$(".slide-tab-search").click(function() {
			$(this).css("left","270px");
			$(".slide-tab-layer").css("left","270px");
			$("#menu-left").css("display", "block");
			$("#menu-layers").css("display", "none");
			$("#menu-left").css("width", "270px");
			$("#menu-left").css("top", "85px");
	});

	$(".slide-tab-layer").click(function() {
			$(this).css("left","270px");
			$(".slide-tab-search").css("left","270px");
			$("#menu-layers").css("display", "block");
			$("#menu-left").css("display", "none");
			$("#menu-layers").css("width", "270px");
			$("#menu-layers").css("top", "85px");
	});


	$('#DLtoExcel').on('click', function () {
		$("#dvjson").excelexportjs({
			containerid: "dvjson",
			datatype: 'json',
			dataset: excelDate,
			columns: getColumns(excelDate)
		});

	});


	$(".slide-tab-search").click();

	$('#search-filter-btn').click(function() {
		// selected_date = $("#select_date").val();
		selected_country = $("#country_select option:selected").val();

		if(selected_country === ""){
			alert("please select country");
			showInfoAlert("Please select a country");
		}else if(selected_date === ""){
			showInfoAlert("Please select date");
		}else if(selected_date !== "" &&  selected_country !== ""){
			$scope.fetchFFG();
		}

	});

	$('#search-all-btn').click(function() {
		filterArea = 'none';
		// remove markers
		if (currentMarkers!==null) {
			for (var i = currentMarkers.length - 1; i >= 0; i--) {
				currentMarkers[i].remove();
			}
		}
		$("#tableOperationalList").empty();
		var typeOptionsURL = '/' + $.param({action: 'get-realtime-events'});
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				loadCount = 0;
				$scope.events = response.data;
				var items = response.data;
				$("#tableOperationalList").empty();
				map.removeLayer(stormMarkers);

				createLiEvents(response.data);
				$('#menu-close').click();
				$('.slide-tab-right').click();
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	});

	// markers saved here
	var currentMarkers=[];
	var tdWmsLayer;
	// var tdWmsRainLayer;
	var routePolyline;

	function getIntersectArea(pid) {
		var typeOptionsURL = '/' + $.param({action: 'get-intersect-area', id:pid});
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
			function (response) {
				var data = response.data;
				var no_country = 0;
				var no_province = 0;

				var district_features=[]
        		district_features.push({
                        "type": "FeatureCollection",
                        "features": []
                    })
				$(".table-detail").append('<hr><h4> <span id="no_country"></span> country, <span id="no_province"> </span> provinces affected by the storm event </h4>');
					var country = 0;
					var province = 0;
				for(var i=0; i<data.length; i++){
					var feature_prop = {
						"id_0": data[i].id_0,
						"id_1": data[i].id_1,
						"id_2": data[i].id_2,
						"name_0": data[i].name_0,
						"name_1": data[i].name_1,
						"name_2": data[i].name_2,
						"trunks": data[i].trunks,
						"primary": data[i].primary,
						"secondary": data[i].secondary,
						"total_pop": data[i].total_pop,
						"female": data[i].female,
						"male": data[i].male,
						"f_0_15": data[i].f_0_15,
						"f_15_65": data[i].f_15_65,
						"f_65": data[i].f_65,
						"m_0_15": data[i].m_0_15,
						"m_15_65": data[i].m_15_65,
						"m_65": data[i].m_65,
						"hospitals": data[i].hospitals
					}
					var feature = {
						"type": "Feature",
						"properties": feature_prop,
						"geometry": JSON.parse(data[i].st_asgeojson)
						}
					district_features[0]["features"].push(feature)

					if(data[i].id_0 !== country){
						no_country += 1;
						country = data[i].id_0;
						var total_pop = 0;
						var total_hospital = 0;
						total_pop += data[i].total_pop;
						total_hospital += data[i].hospitals;
						var content = '<div class="panel-group" id="'+data[i].id_0+'">'+
						  '<div class="panel panel-default">'+
						    '<div class="panel-heading">'+
						      '<h4 class="panel-title">'+
						        '<a data-toggle="collapse" data-parent="#'+data[i].id_0+'" href="#collapse'+data[i].id_0+'">'+
						        data[i].name_0+'<span style="float: right;"></span></a>'+
						      '</h4>'+
						    '</div>'+
						    '<div id="collapse'+data[i].id_0+'" class="panel-collapse collapse">'+
						      '<div class="panel-body">'+
									'<table style="width:100%; font-size:14px;">'+
									'<tr>'+
									'<td>No. population</td>'+
									'<td style="text-align: right;"><span id="total_pop'+data[i].id_0+'"></span></td>'+
									'</tr>'+
									'<tr>'+
									'<td>No. Hospitals</td>'+
									'<td style="text-align: right;"><span id="total_hospital'+data[i].id_0+'"></span></td>'+
									'</tr>'+
									'<tr>'+
									'</table>'+
									'</div>'+
						    '</div>'+
						  '</div>';
					$(".table-detail").append(content);


					}else{
						total_pop += data[i].total_pop;
						total_hospital += data[i].hospitals;
						$("#total_hospital"+data[i].id_0).text(total_hospital);
						$("#total_pop"+data[i].id_0).text(total_pop);
					}

					if(data[i].id_1 !== province){
						no_province += 1;
						province = data[i].id_1;
					}

				}
				$("#no_country").text(no_country);
				$("#no_province").text(no_province);
				if(map.hasLayer(affected_district)){
					map.removeLayer(affected_district);
				}

				affected_district = L.geoJSON(district_features, {
					style: {
				     fillColor: 'red',
				     weight: 1,
				     opacity: 1,
				     color: 'red',
				     dashArray: '3',
				     fillOpacity: 0.1
				   }
				}).addTo(map);
				affected_district.on('mouseover', function(e) {
					//open popup;
					var female_content = '<table style="width:100%; font-size:14px;">'+
					'<tr>'+
					'<td>Female</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.f_0_15+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.f_15_65+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.f_65+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.female+'</td>'+
					'</tr>'+
					'</table>';

					var male_content = '<table style="width:100%; font-size:14px;">'+
					'<tr>'+
					'<td>Male</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.m_0_15+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.m_15_65+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.m_65+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.male+'</td>'+
					'</tr>'+
					'</table>';

					var age_content = '<table style="width:100%; font-size:14px;">'+
					'<tr>'+
					'<td>Population</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Age 0-15</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Age 15-65</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Age > 65</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Total</td>'+
					'</tr>'+
					'</table>';

					var road_type = '<table style="width:100%; font-size:14px;">'+
					'<tr>'+
					'<td>Road</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Trunks</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Primary</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Secondary</td>'+
					'</tr>'+
					'</table>';

					var road_cont = '<table style="width:100%; font-size:14px;">'+
					'<tr>'+
					'<td> count</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.trunks+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.primary+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>'+e.layer.feature.properties.secondary+'</td>'+
					'</tr>'+
					'</table>';

					var content = '<h4>' + e.layer.feature.properties.name_1 +': ' +e.layer.feature.properties.name_2 + '</h4>'+
					'<table class="table">'+
						'<tbody>'+
							'<tr>'+
								'<th scope="row"> '+age_content+'</th>'+
								'<td>'+female_content +' </td>'+
								'<td>'+male_content +' </td>'+
							'</tr>'+
							'<tr>'+
								'<th scope="row">Hospitals</th>'+
								'<td>'+ e.layer.feature.properties.hospitals +' </td>'+
								'<td></td>'+
							'</tr>'+
							'<tr>'+
								'<th scope="row">'+ road_type +'</th>'+
								'<td>'+ road_cont +' </td>'+
								'<td></td>'+
							'</tr>'+
						'</tbody>'+
					'</table>';

					var popup = L.popup()
					 .setLatLng(e.latlng)
					 .setContent(content)
					 .openOn(map);
				  });

					affected_district.on('mouseout', function () {
						map.closePopup();
					});
				},
				function (error) {
					// Error Callback
					console.log('ERROR: ' + error);
				}
		);
	};

	function getDetail(sid) {
		$("#legend-img").css("display", "none");
		$("#legend-marker").css("display", "block");
				for(var i = 0; i< $scope.events.length; i++){
					if($scope.events[i].BASIN === sid){
						// Success Callback
						var items = $scope.events[i];
						$(".table-detail").html(
							'<div class="row">'+
							'<div class="col-sm-12"><p class="place-name">Basin ID: '+ sid +'</p></div>'+
							'<div class="col-sm-12">'+
							'<table style="width:100%; font-size:14px;">'+
							'<tr>'+
							'<td>Average soil water</td>'+
							'<td style="text-align: right;">'+ items["ASMT"]+ '</td>'+
							'</tr>'+
							'<tr>'+
							'<td>Fash flood guidance 1 hour</td>'+
							'<td style="text-align: right;">'+ items["FFG01"]+ ' hrs </td>'+
							'</tr>'+
							'<tr>'+
							'<td>Fash flood guidance 3 hour</td>'+
							'<td style="text-align: right;">'+ items["FFG03"]+ '</td>'+
							'</tr>'+
							'<tr>'+
							'<td>Fash flood guidance 6 hour</td>'+
							'<td style="text-align: right;">'+ items["FFG06"]+ '</td>'+
							'</tr>'+
							'<tr>'+
							'<td>Area forecasted 1 hour</td>'+
							'<td style="text-align: right;">'+ items["FMAP101"]+ '</td>'+
							'</tr>'+
							'<tr>'+
							'<td>Area forecasted 3 hour</td>'+
							'<td style="text-align: right;">'+ items["FMAP103"]+ '</td>'+
							'</tr>'+
							'<tr>'+
							'<td>Area forecasted 3 hour</td>'+
							'<td style="text-align: right;">'+ items["FMAP106"]+ '</td>'+
							'</tr>'+
							'<tr>'+
							'<td>Area forecasted 24 hour</td>'+
							'<td style="text-align: right;">'+ items["FMAP124"]+ '</td>'+
							'</tr>'+
							'</table>'+
							'</div>'+
							'</div>');
					}
				}

					$('#detail-panel').css("width", "300px");
					if($('#sidenav-table').css("width") == "280px"){
						$(".detail-right").css("right", "285px");
						$(".detail-right").css("height", "auto");
						$(".detail-right").css("top", "90px");
						$(".detail-right").css("max-height", "600px");
						$(".detail-right").css("padding-top", "10px");
						$(".detail-right").css("overflow-y", "scroll");

						$("#minimize-detail-panel").css("width", "190px");
						$("#minimize-detail-panel").css("right", "285px");
						$("#minimize-detail-panel").css("height", "40px");
						$("#minimize-detail-panel").css("top", "90px");
						$("#minimize-detail-panel").css("padding-top", "10px");
					}else{
						$(".detail-right").css("right", "10px");
						$(".detail-right").css("height", "auto");
						$("#minimize-detail-panel").css("right", "10px");
					}

		}


		$('input[type=checkbox][name=storm_events]').click(function(){
			var tooltipPanes = document.getElementsByClassName("leaflet-tooltip-pane");
			if(this.checked) {
				tooltipPanes[0].classList.remove("tooltip-hidden");
				map.addLayer(stormMarkers);
				$("#legend-img").css("display", "none");
				$("#legend-marker").css("display", "block");
			}else{
				tooltipPanes[0].classList.add("tooltip-hidden");
				if (map.hasLayer(stormMarkers)) {
					stormMarkers.closeTooltip();
					map.removeLayer(stormMarkers);
				}
			}

		});
		$('input[type=checkbox][name=mekong_bb]').click(function(){
			if(this.checked) {
				map.addLayer(mekong_bb);
			}else{
				if (map.hasLayer(mekong_bb)) {
					map.removeLayer(mekong_bb);
				}
			}
		});

		$('input[type=checkbox][name=geographic_coverage]').click(function(){
			if(this.checked) {
				map.addLayer(storm_boundingbox);
			}else{
				if (map.hasLayer(storm_boundingbox)) {
					map.removeLayer(storm_boundingbox);
				}
			}
		});

		$('input[type=checkbox][name=mekong_country]').click(function(){
			if(this.checked) {
				map.addLayer(adm0);
			}else{
				if (map.hasLayer(adm0)) {
					map.removeLayer(adm0);
				}
			}
		});

		$('input[type=radio][name=ffg_param]').click(function(){
			var param = $(this).val();
			var ffg_basins_style = {
				 fillColor: '#FFF',
				 weight: 0.5,
				 opacity: 0,
				 color: 'white',
				 fillOpacity: 0.2
			 };
			 if(map.hasLayer(mrc_ffgmap)){
				 map.removeLayer(mrc_ffgmap);
			 }
			 var mapVals =  {
				 "ASMT" : [0, 0.30, 0.65, 0.85, 0.90, 0.95, 1, 1000],
				 "FFG01" : [0, 15, 30, 60, 100, 160, 220, 1000],
				 "FFG03" : [0, 15, 30, 60, 100, 160, 220, 1000],
				 "FFG06" : [0, 15, 30, 60, 100, 160, 220, 1000],
				 "FMAP101" : [0, 30, 70, 120, 180, 240, 300, 1000],
				 "FMAP103" : [0, 30, 70, 120, 180, 240, 300, 1000],
				 "FMAP106" : [0, 30, 70, 120, 180, 240, 300, 1000],
				 "FMAP124" : [0, 30, 70, 120, 180, 240, 300, 1000],
			 }

			 var mapColors =  {
				 "ASMT" : ['#FFF', '#DEDC28', '#B59700', '#3EDC3A', '#006200', '#304AFC', '#170078', '#170078'],
				 "FFG01" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
				 "FFG03" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
				 "FFG06" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
				 "FMAP101" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
				 "FMAP103" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
				 "FMAP106" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
				 "FMAP124" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
			 }

			mrc_ffgmap = L.geoJSON(country_data, {
				style: ffg_basins_style,
				onEachFeature: function (feature, layer) {
					if (feature.properties[param] <= mapVals[param][0]) {
							layer.setStyle({fillColor : mapColors[param][0],fillOpacity: 0,color: mapColors[param][0]});
					}else if (feature.properties[param] <= mapVals[param][1]) {
							layer.setStyle({fillColor :mapColors[param][1],fillOpacity: 0.7,opacity: 1,color: mapColors[param][1]});
					}else if (feature.properties[param] <= mapVals[param][2]){
							layer.setStyle({fillColor :mapColors[param][2],fillOpacity: 0.7,opacity: 1,color: mapColors[param][2]});
					}else if (feature.properties[param] <= mapVals[param][3]){
							layer.setStyle({fillColor :mapColors[param][3],fillOpacity: 0.7,opacity: 1,color: mapColors[param][3]});
					}else if (feature.properties[param] <= mapVals[param][4]){
							layer.setStyle({fillColor :mapColors[param][4],fillOpacity: 0.7,opacity: 1,color: mapColors[param][4]});
					}else if (feature.properties[param] <= mapVals[param][5]){
							layer.setStyle({fillColor :mapColors[param][5],fillOpacity: 0.7,opacity: 1,color: mapColors[param][5]});
					} else if (feature.properties[param] <= mapVals[param][6]){
							layer.setStyle({fillColor :mapColors[param][6],fillOpacity: 0.7,opacity: 1,color: mapColors[param][6]});
					} else  if (feature.properties[param] <= mapVals[param][7]){
							layer.setStyle({fillColor :mapColors[param][7],fillOpacity: 0.7,opacity: 1,color: mapColors[param][7]});
					}

					var properties_keys = Object.keys(feature.properties);
					var tr_html = "";
					properties_keys.forEach(function (item, index) {
						tr_html += "<tr>"+
											"<td style='padding-right:5px;padding-left:5px;'>"+item+"</td>"+
											"<td style='padding-right:5px;padding-left:5px;'>"+feature.properties[item]+"</td>"+
										"</tr>";
					});
					var popuptableHTML = "<table style='font-size: 10px;'><colgroup><col style='background-color: #000000'><col span='2'></colgroup>"+tr_html+"</table>"

						layer.bindPopup(popuptableHTML);

						layer.on('mouseover', function (e) {
								this.openPopup(e.latlng);
								highlight(e.target);
						});
						layer.on('mouseout', function (e) {
								this.closePopup();
								dehighlight(e.target);
						});
				}
			}).addTo(map);
			$("#tableOperationalList").empty();
			createEventList();

		});


		/**
		* Change basemap layer(satellite, terrain, street)
		*/
		$('input[type=radio][name=basemap_selection]').change(function(){
			var selected_basemap = $(this).val();
			if(selected_basemap === "satellite-v9"){
				map.setStyle('mapbox://styles/mapbox/' + selected_basemap,{
					copySources: ['rainstorms'],
  				copyLayers: ['rainstorms']
				});
			}else if(selected_basemap === "dark-v10"){
				map.setStyle('mapbox://styles/mapbox/' + selected_basemap,{
					copySources: ['rainstorms'],
  				copyLayers: ['rainstorms']
				});
			}else if(selected_basemap === "light-v10"){
				map.setStyle('mapbox://styles/mapbox/' + selected_basemap,{
					copySources: ['rainstorms'],
  				copyLayers: ['rainstorms']
				});
			}
		});

		$('#layer-control').click(function(){
			$('.layer-control').toggleClass( "hide" )
		})

		var mrcbasins_geojson;
		var mrcbasins;
		// $.getJSON('data/mekong_mrcffg_basins.geojson')
		//  .done(function (data, status) {
		// 	 mrcbasins = data.features;
		// 	 if(map.hasLayer(mrcbasins_geojson)){
		// 		 map.removeLayer(mrcbasins_geojson);
		// 	 }
		// 	 mrcbasins_geojson = L.geoJSON(data, {style: basin_style}).addTo(map);
		//  });

		$('#select_date').change(function(){
		    selected_date=$('#select_date').val().split("/");
				selected_date=selected_date[0]+selected_date[1]+selected_date[2];
				sessionStorage.setItem("selected_date", selected_date);
				// $scope.fetchFFG();
				// console.log(selected_date);
		});
		var selected_country;
		$("#country_select").change(function() {
			selected_country = $(this).val();
			sessionStorage.setItem("selected_country", selected_country);
			var basin_style = {
				 fillColor: '#9999ff',
				 weight: 0.2,
				 opacity: 1,
				 color: 'white',
				 fillOpacity: 0.1
			 };
			 $.getJSON('data/'+selected_country+'_mrcffg_basins.geojson')
				.done(function (data, status) {
			    mrcbasins = data.features;
					if(map.hasLayer(mrcbasins_geojson)){
						map.removeLayer(mrcbasins_geojson);
					}
					mrcbasins_geojson = L.geoJSON(data, {style: basin_style}).addTo(map);
				});
		});

		$(document).on('click', '.liPlaceName', function(event) {
			$('#menu-close-btn').click();
			event.preventDefault();
			/* Act on the event */
			getDetail($(this).attr('data-id'));

		});

		function createEventList() {
			var endNumber = loadCount + 10;
			if($scope.events.length < endNumber){
				endNumber = $scope.events.length;
			}else{
				endNumber = endNumber;
			}
			for(var i = loadCount; i< endNumber; i++){
				loadCount += 1;
				var basin_id =  $scope.events[i]["BASIN"];
				var ASMT = $scope.events[i]["ASMT"];
				var FFG01 = $scope.events[i]["FFG01"];
				var FFG03 = $scope.events[i]["FFG03"];
				var FFG06 = $scope.events[i]["FFG06"];
				var FMAP101 = $scope.events[i]["FMAP101"];
				var FMAP103 = $scope.events[i]["FMAP103"];
				var FMAP106 = $scope.events[i]["FMAP106"];
				var FMAP124 = $scope.events[i]["FMAP124"];
				var class_color = '';

				var mapVals =  {
					"ASMT" : [0, 0.30, 0.65, 0.85, 0.90, 0.95, 1, 1000],
					"FFG01" : [0, 15, 30, 60, 100, 160, 220, 1000],
					"FFG03" : [0, 15, 30, 60, 100, 160, 220, 1000],
					"FFG06" : [0, 15, 30, 60, 100, 160, 220, 1000],
					"FMAP101" : [0, 30, 70, 120, 180, 240, 300, 1000],
					"FMAP103" : [0, 30, 70, 120, 180, 240, 300, 1000],
					"FMAP106" : [0, 30, 70, 120, 180, 240, 300, 1000],
					"FMAP124" : [0, 30, 70, 120, 180, 240, 300, 1000],
				}

				var mapColors =  {
					"ASMT" : ['#FFF', '#DEDC28', '#B59700', '#3EDC3A', '#006200', '#304AFC', '#170078', '#170078'],
					"FFG01" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
					"FFG03" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
					"FFG06" : ['#FFF', '#E700E7', '#FF0000', '#E5E500', '#00E200', '#2900D9', '#2CE5E5', '#2CE5E5'],
					"FMAP101" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
					"FMAP103" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
					"FMAP106" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
					"FMAP124" : ['#FFF', '#2CE5E5', '#2900D9', '#00E200', '#E5E500', '#FF0000', '#E700E7', '#E700E7'],
				}

				var param = $('input[type=radio][name=ffg_param]:checked').val();
				var param_text = $('input[type=radio][name=ffg_param]:checked').attr("id");
				param_text = $("label[for='" + param_text + "']").text();
				showSuccessAlert("Show "+ param_text);

				var selected_param = $scope.events[i][param];
				if (selected_param <= mapVals[param][0]) {
						class_color = mapColors[param][0];
				}else if (selected_param <= mapVals[param][1]) {
						class_color = mapColors[param][1];
				}else if (selected_param <= mapVals[param][2]){
						class_color = mapColors[param][2];
				}else if (selected_param <= mapVals[param][3]){
						class_color = mapColors[param][3];
				}else if (selected_param <= mapVals[param][4]){
						class_color = mapColors[param][4];
				}else if (selected_param <= mapVals[param][5]){
						class_color = mapColors[param][5];
				} else if (selected_param <= mapVals[param][6]){
					class_color = mapColors[param][6];
				} else  if (selected_param <= mapVals[param][7]){
						class_color = mapColors[param][7];
				}

				$("#tableOperationalList").append('<li>'+
				'<a href="#" class="liPlaceName" data-id="'+basin_id+'">'+
				'<div class="row">'+
				'<div class="col-sm-3"><div class="meg-number" style="background-color:'+class_color+'"><p>'+selected_param+'</p></div></div>'+
				'<div class="col-sm-9">'+
				'<p class="place-name-list">'+ basin_id + '</p>'+
				'<p class="place-location-list"><b>Fash flood guidance 1 hour:</b> '+ FFG01+ ' </p>'+
				'<p class="place-location-list"><b>Area forecasted 1 hour:</b> '+ FMAP101+' </p>'+
				'<p class="place-location-list"><b>Average soil water:</b> '+ ASMT+'</p>'+
				'</div>'+
				'</div>'+
				'</a>'+
				'</li>')
			}
			if($scope.events.length > endNumber){
				$("#tableOperationalList").append('<li id="loadmore-op-btn" style="text-align:center;cursor: pointer;color: #40e0d0;">'+
				'Load More'+
				'</li>');
			}
		}

		$(document).on('click', '#loadmore-op-btn', function() {
			this.remove();
			createEventList();
		});

	});
