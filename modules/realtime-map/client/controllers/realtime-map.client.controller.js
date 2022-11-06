

'use strict';

angular.module('core').controller('mapRealtimeCtrl', function ($scope, $http) {

	$scope.rssFeeds = [];
	var filterArea = 'none';
	var affected_district ;

	$(document).ready(function(){
		$(".navbar-brand.navmenu").html("");
		$(".navbar-brand.navmenu").text("RAINSTORMS TRACKER");
		$(".navbar-brand.navmenu").append("<span style='font-size:14px;margin-left:5px;text-transform: none;'> (GSMaP NOW) </span>");
		$("#storm_cat_selector").change(function() {
			var checkedVal = $("#storm_cat_selector option:selected").val();
			var instance = $("#slider-max").data("ionRangeSlider");

			if(checkedVal === "lev1"){
				$("#start_vol").attr({
		       "max" : 9.47,
		       "min" : 4.69
		    });
				$("#end_vol").attr({
					"max" : 9.47,
					"min" : 4.69
		    });
				$("#start_vol").val(4.69);
				$("#end_vol").val(9.47);
				instance.update({
            from: 45.44,
						to: 61.84
        });

			}else if(checkedVal === "lev2"){
				$("#start_vol").attr({
		       "max" : 12.64,
		       "min" : 9.47
		    });
				$("#end_vol").attr({
		       "max" : 12.64,
		       "min" : 9.47
		    });
				$("#start_vol").val(9.47);
				$("#end_vol").val(12.64);
				instance.update({
            from: 61.84,
						to: 72.69
        });

			}else if(checkedVal === "lev3"){
				$("#start_vol").attr({
		       "max" : 15.68,
		       "min" : 12.64
		    });
				$("#end_vol").attr({
		       "max" : 15.68,
		       "min" : 12.64
		    });
				$("#start_vol").val(12.64);
				$("#end_vol").val(15.68);
				instance.update({
            from: 72.69,
						to: 83.11
        });

			}else if(checkedVal === "lev4"){
				$("#start_vol").attr({
		       "max" : 19.61,
		       "min" : 15.68
		    });
				$("#end_vol").attr({
		       "max" : 19.61,
		       "min" : 15.68
		    });
				$("#start_vol").val(15.68);
				$("#end_vol").val(19.61);
				instance.update({
            from: 83.11,
						to: 96.59
        });


			}else if(checkedVal === "lev5"){
				$("#start_vol").attr({
		       "max" : 22.56,
		       "min" : 19.61
		    });
				$("#end_vol").attr({
		       "max" : 22.56,
		       "min" : 19.61
		    });
				$("#start_vol").val(19.61);
				$("#end_vol").val(22.56);
				instance.update({
            from: 96.59,
						to: 106.69
        });

			}else if(checkedVal === "lev6"){
				$("#start_vol").attr({
		       "max" : 25.50,
		       "min" : 22.56
		    });
				$("#end_vol").attr({
		       "max" : 25.50,
		       "min" : 22.56
		    });
				$("#start_vol").val(22.56);
				$("#end_vol").val(25.50);
				instance.update({
            from: 106.69,
						to: 116.76
        });

			}else if(checkedVal === "lev7"){
				$("#start_vol").attr({
		       "max" : 29.37,
		       "min" : 25.50
		    });
				$("#end_vol").attr({
		       "max" : 29.37,
		       "min" : 25.50
		    });
				$("#start_vol").val(25.50);
				$("#end_vol").val(29.37);
				instance.update({
            from: 116.76,
						to: 130.04
        });

			}else if (checkedVal === "lev8"){
				$("#start_vol").attr({
					 "max" : 32.30,
					 "min" : 29.37
				});
				$("#end_vol").attr({
					 "max" : 32.30,
					 "min" : 29.37
				});
				$("#start_vol").val(29.37);
				$("#end_vol").val(32.30);
				instance.update({
            from: 130.04,
						to: 140.07
        });

			}else if (checkedVal === "undefined"){
				$("#start_vol").attr({
					 "max" : 1000,
					 "min" : 0
				});
				$("#end_vol").attr({
					 "max" : 1000,
					 "min" : 0
				});
				$("#start_vol").val("");
				$("#end_vol").val("");
				instance.update({
            from: 0,
						to: 300
        });
			}
		});

		$('[data-toggle="tooltip"]').tooltip();
		$("#start_date").datepicker({
			format: 'dd/mm/yyyy'
		});
		$("#end_date").datepicker({
			format: 'dd/mm/yyyy'
		});


	});

	$('#month_range').ionRangeSlider({
		skin: "round",
		type: "double",
		grid: true,
		from: 0,
		to: 11,
		values: [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		]
	});


	var apiCall = function (url, method) {
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
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


// 		////////////////////////////////// weather radar data ////////////////////////////////
// 		var apiData = {};
// 		var mapFrames = [];
// 		var lastPastFramePosition = -1;
// 		var radarLayers = [];
//
// 		var optionKind = 'radar'; // can be 'radar' or 'satellite'
//
// 		var optionTileSize = 256; // can be 256 or 512.
// 		var optionColorScheme = 2; // from 0 to 8. Check the https://rainviewer.com/api/color-schemes.html for additional information
// 		var optionSmoothData = 1; // 0 - not smooth, 1 - smooth
// 		var optionSnowColors = 1; // 0 - do not show snow colors, 1 - show snow colors
//
// 		var animationPosition = 0;
// 		var animationTimer = false;
//
// 		var loadingTilesCount = 0;
// 		var loadedTilesCount = 0;
//
//
// 		    function startLoadingTile() {
// 		        loadingTilesCount++;
// 		    }
// 		    function finishLoadingTile() {
// 		        // Delayed increase loaded count to prevent changing the layer before
// 		        // it will be replaced by next
// 		        setTimeout(function() { loadedTilesCount++; }, 250);
// 		    }
// 		    function isTilesLoading() {
// 		        return loadingTilesCount > loadedTilesCount;
// 		    }
//
// 		    /**
// 		     * Load all the available maps frames from RainViewer API
// 		     */
// 		    var apiRequest = new XMLHttpRequest();
// 		    apiRequest.open("GET", "https://api.rainviewer.com/public/weather-maps.json", true);
// 		    apiRequest.onload = function(e) {
// 		        // store the API response for re-use purposes in memory
// 		        apiData = JSON.parse(apiRequest.response);
// 		        initialize(apiData, optionKind);
// 		    };
// 		    apiRequest.send();
//
// 		    /**
// 		     * Initialize internal data from the API response and options
// 		     */
// 		    function initialize(api, kind) {
// 		        // remove all already added tiled layers
// 		        for (var i in radarLayers) {
// 		            map.removeLayer(radarLayers[i]);
// 		        }
// 		        mapFrames = [];
// 		        radarLayers = [];
// 		        animationPosition = 0;
//
// 		        if (!api) {
// 		            return;
// 		        }
// 		        if (kind == 'satellite' && api.satellite && api.satellite.infrared) {
// 		            mapFrames = api.satellite.infrared;
//
// 		            lastPastFramePosition = api.satellite.infrared.length - 1;
// 		            showFrame(lastPastFramePosition, true);
// 		        }
// 		        else if (api.radar && api.radar.past) {
// 		            mapFrames = api.radar.past;
// 		            if (api.radar.nowcast) {
// 		                mapFrames = mapFrames.concat(api.radar.nowcast);
// 		            }
//
// 		            // show the last "past" frame
// 		            lastPastFramePosition = api.radar.past.length - 1;
// 		            showFrame(lastPastFramePosition, true);
// 		        }
// 		    }
//
// 		    /**
// 		     * Animation functions
// 		     * @param path - Path to the XYZ tile
// 		     */
// 		    function addLayer(frame) {
// 		        if (!radarLayers[frame.path]) {
// 		            var colorScheme = optionKind == 'satellite' ? 0 : optionColorScheme;
// 		            var smooth = optionKind == 'satellite' ? 0 : optionSmoothData;
// 		            var snow = optionKind == 'satellite' ? 0 : optionSnowColors;
//
// 		            var source = new L.TileLayer(apiData.host + frame.path + '/' + optionTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.png', {
// 		                tileSize: 256,
// 		                opacity: 0.01,
// 		                zIndex: frame.time
// 		            });
//
// 		            // Track layer loading state to not display the overlay
// 		            // before it will completelly loads
// 		            source.on('loading', startLoadingTile);
// 		            source.on('load', finishLoadingTile);
// 		            source.on('remove', finishLoadingTile);
//
// 		            radarLayers[frame.path] = source;
// 		        }
// 		        if (!map.hasLayer(radarLayers[frame.path])) {
// 		            map.addLayer(radarLayers[frame.path]);
// 		        }
// 		    }
//
// 		    /**
// 		     * Display particular frame of animation for the @position
// 		     * If preloadOnly parameter is set to true, the frame layer only adds for the tiles preloading purpose
// 		     * @param position
// 		     * @param preloadOnly
// 		     * @param force - display layer immediatelly
// 		     */
// 		    function changeRadarPosition(position, preloadOnly, force) {
// 		        while (position >= mapFrames.length) {
// 		            position -= mapFrames.length;
// 		        }
// 		        while (position < 0) {
// 		            position += mapFrames.length;
// 		        }
//
// 		        var currentFrame = mapFrames[animationPosition];
// 		        var nextFrame = mapFrames[position];
//
// 		        addLayer(nextFrame);
//
// 		        // Quit if this call is for preloading only by design
// 		        // or some times still loading in background
// 		        if (preloadOnly || (isTilesLoading() && !force)) {
// 		            return;
// 		        }
//
// 		        animationPosition = position;
//
// 		        if (radarLayers[currentFrame.path]) {
// 		            radarLayers[currentFrame.path].setOpacity(0);
// 		        }
// 		        radarLayers[nextFrame.path].setOpacity(100);
//
//
// 		        var pastOrForecast = nextFrame.time > Date.now() / 1000 ? 'FORECAST' : 'PAST';
//
// 		        document.getElementById("timestamp").innerHTML = pastOrForecast + ': ' + (new Date(nextFrame.time * 1000)).toString();
// 		    }
//
// 		    /**
// 		     * Check avialability and show particular frame position from the timestamps list
// 		     */
// 		    function showFrame(nextPosition, force) {
// 		        var preloadingDirection = nextPosition - animationPosition > 0 ? 1 : -1;
//
// 		        changeRadarPosition(nextPosition, false, force);
//
// 		        // preload next next frame (typically, +1 frame)
// 		        // if don't do that, the animation will be blinking at the first loop
// 		        changeRadarPosition(nextPosition + preloadingDirection, true);
// 		    }
//
// 		    /**
// 		     * Stop the animation
// 		     * Check if the animation timeout is set and clear it.
// 		     */
// 		    function stop() {
// 		        if (animationTimer) {
// 		            clearTimeout(animationTimer);
// 		            animationTimer = false;
// 		            return true;
// 		        }
// 		        return false;
// 		    }
//
// 		    function play() {
// 		        showFrame(animationPosition + 1);
//
// 		        // Main animation driver. Run this function every 500 ms
// 		        animationTimer = setTimeout(play, 500);
// 		    }
//
// 		    function playStop() {
// 		        if (!stop()) {
// 		            play();
// 		        }
// 		    }
//
// 		    /**
// 		     * Change map options
// 		     */
// 		    function setKind(kind) {
// 		        optionKind = kind;
// 		        initialize(apiData, optionKind);
// 		    }
//
//
// 		    function setColors() {
// 		        var e = document.getElementById('colors');
// 		        optionColorScheme = e.options[e.selectedIndex].value;
// 		        initialize(apiData, optionKind);
// 		    }
//
// ////////////////////////////////// end weather radar data ////////////////////////////////



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
		var geojson = {
			"type":"FeatureCollection",
			"features":[]
		};
		excelDate = data;

		$("#found-no").text("Found "+data.length);

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
					var megClass = 1;
				}else if ( mcmax <= 61.84 && mcvol < 9.47) {
					var megClass = 2;
				}
				else if ( mcmax <= 72.69 && mcvol < 12.64) {
					var megClass = 3;
				}
				else if ( mcmax <= 83.11 && mcvol < 15.68) {
					var megClass = 4;
				}
				else if ( mcmax <= 96.59 && mcvol < 19.61) {
					var megClass = 5;
				}
				else if ( mcmax <= 106.76 && mcvol < 22.56) {
					var megClass = 6;
				}
				else if ( mcmax <= 116.76 && mcvol < 25.50) {
					var megClass = 7;
				}
				else if ( mcmax <= 130.04 && mcvol < 29.37) {
					var megClass = 8;
				}
				else if (mcmax >= 130.05) {
					var megClass = 9;
				}

				geojson.features.push({ "type": "Feature","properties": { "id": sid, "date": sdate, "mctime": mctime, "mcspace": mcspace, "mcmax": mcmax , "mcvol": mcvol, "total_mag": total_mag, "storm_class": megClass}, "geometry": {"type": "Point","coordinates": [lng, lat]} });
		}

		$("#tableOperationalList").append('<li id="loadmore-op-btn" style="text-align:center;cursor: pointer;">'+
		'Load More'+
		'</li>');
		$("#loadmore-op-btn").click();


		stormMarkers = L.geoJSON(geojson, {
		    style: function(feature) {
		        return {color: colors[feature.properties.storm_class - 1]};
		    },
		    pointToLayer: function(feature, latlng) {
					var marker = new L.marker(latlng, {
						title: feature.properties.storm_class,
						icon: L.divIcon({
							html: feature.properties.mcvol.toFixed(2).toString(),
							className: 'marker-icon-'+ (feature.properties.storm_class - 1),
							iconSize: L.point(25, 25)
						})
				});
					return marker;
		    },
		    onEachFeature: function (feature, layer) {

					var content = '<h4>' + feature.properties.date + '</h4>'+
						'<table class="table table-striped">'+
							'<tbody>'+
								'<tr>'+
									'<th scope="row"> Storm Volume</th>'+
									'<td>'+ feature.properties.mcvol.toFixed(2) +' km<sup>3</sup></td>'+
								'</tr>'+
								'<tr>'+
									'<th scope="row">Storm Duration</th>'+
									'<td>'+ feature.properties.mctime.toFixed(2) +' hrs</td>'+
								'</tr>'+
							'</tbody>'+
						'</table>';

					var text2 = L.tooltip({
						direction: 'top',
						className: 'leaflet-tooltip-custom'
					})
					.setContent(content)
					.setLatLng(layer.getLatLng());
					layer.bindTooltip(content);
		    }
		});

		stormMarkers.addTo(map);

		stormMarkers.on("click", function (event) {
				var clickedMarker = event.layer;
				getDetail(clickedMarker.feature.properties.id);

		});
	}

	$scope.fetchEvents = function () {
		var eventsURL = '/' + $.param({action: 'get-realtime-events'});
		// Make a request
		apiCall(eventsURL, 'POST').then(
			function (response) {
				// Success Callback
				loadCount = 0;
				$scope.events = response.data;
				$("#tableOperationalList").empty();
				$("#sidenav-table").css("width", "280px");
				createLiEvents(response.data)
				$(".detail-right").css("right", "285px");
				$(".detail-right").css("height", "auto");
				$(".detail-right").css("top", "90px");
				$(".detail-right").css("padding-top", "10px");
				$(".slide-tab-right").css("display", "none");

			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};

	$scope.fetchEvents();

	/**
	 * Use Mapbox GL JS's `flyTo` to move the camera smoothly
	 * a given center point.
	 **/

	function flyToStore(lat, lng) {
	  map.setView([lat, lng], 7);
	}

	function hideStromPoints(){

			map.removeLayer(stormMarkers);
			$(".leaflet-tooltip.text").addClass("tooltip-hidden");
			// Uncheck
			document.getElementById("storm_events").checked = false;
			$("#legend-img").css("display", "block");
			$("#legend-marker").css("display", "none");
	}

	function showStromPoints(){
			map.addLayer(stormMarkers);
			$(".leaflet-tooltip.text").removeClass("tooltip-hidden");
			// check
			document.getElementById("storm_events").checked = true;
			$("#legend-img").css("display", "none");
			$("#legend-marker").css("display", "block");
	}


	$('#slider-max').ionRangeSlider({
		skin: "round",
		type: "double",
		min: 0,
		max: 200,
		grid: true,
		from: 0,
		step: 0.01
	});

	var distanceSlider = document.getElementById('slider-distance');

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
		//loadCount = 0;
		// if (map.getLayer("wms-test-layer")) {
		// 	map.removeLayer("wms-test-layer");
		// }
		//
		// if (map.getSource("wms-test-source")) {
		// 	map.removeSource("wms-test-source");
		// }
		// if (map.getLayer("route")) {
		// 	map.removeLayer("route");
		// 	map.removeSource("route");
		// }
		// remove markers
		if (currentMarkers!==null) {
			for (var i = currentMarkers.length - 1; i >= 0; i--) {
				currentMarkers[i].remove();
			}
		}

		var start_vol = $("#start_vol").val();
		var end_vol = $("#end_vol").val();
		var start_duration = $("#start_duration").val();
		var end_duration = $("#end_duration").val();
		var intensity = $("#slider-max").val().split(";");
		var min_intensity = intensity[0];
		var max_intensity = intensity[1];

		var filter_area = filterArea;

		if(!start_vol) start_vol = 9999;
		if(!end_vol) end_vol = 9999;
		if(!start_duration) start_duration = 9999;
		if(!end_duration) end_duration = 9999;

		var typeOptionsURL = '/' + $.param({action: 'filter-realtime-events', start_vol:start_vol, end_vol:end_vol, start_duration:start_duration, end_duration:end_duration, min_intensity:min_intensity, max_intensity:max_intensity, filter_area: filter_area});
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

		var typeOptionsURL = '/' + $.param({action: 'get-realtime-detail', id:sid});
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				var items = response.data[0];
				var date_split = items["date"].split(" ");
				var date = date_split[0];
				var time = date_split[1].split(":");
				var _time = time[0]
				var storm_figures = items["folder"]+"png";
				var storm_raster = "MCS_"+date+"_"+_time+"0000";
				var downloadRasterurl = "https://thredds-servir.adpc.net/thredds/fileServer/RAINSTORM/realtime/"+items["folder"]+"nc"
				flyToStore(items["center_lat"], items["center_lng"]);
				hideStromPoints();

				var dateText = items["date2"] + ' '+ items["date"].split(" ")[1];
				$(".table-detail").html(
					'<div class="row">'+
					// '<div class="col-sm-12"><p class="place-name">'+ dateText +'</p></div>'+
					'<div class="col-sm-12"><ul><li style="float:left; margin:0;"><a href="/img/realtime-figures/'+storm_figures+'" style="color:#FFF;font-size:20px;" target="_blank" title="Dowload a figure" download>'+
					'<svg width="0.8em" height="0.8em" viewBox="0 0 16 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
					'<path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12z"/>'+
					'<path d="M10.648 7.646a.5.5 0 0 1 .577-.093L15.002 9.5V14h-14v-2l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71z"/>'+
					'<path fill-rule="evenodd" d="M4.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>'+
					'</svg></a></li>'+
					'<li style="float:left; margin:0;"><a href="'+downloadRasterurl+'" style="color:#FFF;font-size:20px;" target="_blank" title="Dowload a raster file" download>'+
					'<svg width="0.8em" height="0.8em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
					'<path fill-rule="evenodd" d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z"/>'+
					'<path fill-rule="evenodd" d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z"/>'+
					'<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z"/>'+
					'</svg></a></li></ul></div>'+
					'<div class="col-sm-12"><img src="/img/realtime-figures/'+storm_figures+'" alt="" style="width:100%;margin-bottom: 20px;"></div>'+
					'<div class="col-sm-12">'+
					'<table style="width:100%; font-size:14px;">'+
					'<tr>'+
					'<td>Centroid</td>'+
					'<td style="text-align: right;">'+ items["center_lat"].toFixed(2)+', '+items["center_lng"].toFixed(2)+ '</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Weighted Centroid</td>'+
					'<td style="text-align: right;">'+ items["w_center_lat"].toFixed(2)+', '+items["w_center_lng"].toFixed(2)+ '</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Total volume</td>'+
					'<td style="text-align: right;">'+ items["mcvol"].toFixed(2)+ ' km<sup>3</sup> </td>'+
					'</tr>'+
					'<tr>'+
					'<td>Duration</td>'+
					'<td style="text-align: right;">'+ items["mctime"]+ ' hrs </td>'+
					'</tr>'+
					'<tr>'+
					'<td>Maximum spatial extension</td>'+
					'<td style="text-align: right;">'+ items["mcspace"].toFixed(2)+' km<sup>3</sup></td>'+
					'</tr>'+
					'<tr>'+
					'<td>Max intensity</td>'+
					'<td style="text-align: right;">'+ items["mcmax"].toFixed(2)+' mm/h </td>'+
					'</tr>'+
					'<tr>'+
					'<td>Start storm location</td>'+
					'<td style="text-align: right;">'+ items["lat_start"].toFixed(2)+', '+items["lng_start"].toFixed(2)+' </td>'+
					'</tr>'+
					'<tr>'+
					'<td>End storm location</td>'+
					'<td style="text-align: right;">'+ items["lat_end"].toFixed(2)+', '+items["lng_end"].toFixed(2)+'</td>'+
					'</tr>'+
					'<tr>'+
					'<td>Average Speed</td>'+
					'<td style="text-align: right;">'+ items["speed"].toFixed(2)+ ' km/h</td>'+
					'</tr>'+
					'</table>'+
					'</div>'+
					'</div>');

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


					// $("#toggle_storm_image").css('display', 'block');

					$("#toggle_storm_affected_area").css('display', 'block');

					// remove markers
					if (currentMarkers!==null) {
						for (var i = currentMarkers.length - 1; i >= 0; i--) {
							currentMarkers[i].remove();
						}
					}

					var trackRoute = []
					//Uncheck
					document.getElementById("mekong_country").checked = false;
					$.ajax("/realtime-tracks_csv/"+items["folder"]+"csv", {
				    success: function(data) {
				        var trackJson =  JSON.parse(CSV2JSON(data));
								//length - 1 because there is last blank line
							for(var i=0; i<trackJson.length-1; i++){

								trackRoute.push([trackJson[i].lat, trackJson[i].Lon]);
								var date = trackJson[i].Dates.split(" ");
								var _date = date[0].split("-");
								var _time = date[1];
								var _date_1 = _date[2];
								var _month =  _date[1];
								var _year =  _date[0];
								var dateNewFormat = _date_1+"/"+_month+"/"+_year+" "+ _time;
								if(i === 0){

									var trackPoint = new L.marker([trackJson[i].lat, trackJson[i].Lon], {
										icon: L.divIcon({
											html: 'START',
											className: 'track-route-start',
											iconSize: L.point(10, 10)
										})
								}).addTo(map);

								}else if (i === trackJson.length-2){
									var trackPoint = new L.marker([trackJson[i].lat, trackJson[i].Lon], {
										icon: L.divIcon({
											html: 'END',
											className: 'track-route-end',
											iconSize: L.point(10, 10)
										})
								}).addTo(map);

								}else{
									var trackPoint = new L.marker([trackJson[i].lat, trackJson[i].Lon], {
										icon: L.divIcon({
											html: '',
											className: 'track-route',
											iconSize: L.point(10, 10)
										})
								}).addTo(map);

								}
								trackPoint.bindPopup(
									'<h4>' + dateNewFormat + '</h4>'+
									'<table class="table">'+
										'<tbody>'+
											'<tr>'+
												'<th scope="row"> Magnitude</th>'+
												'<td>'+ parseInt(trackJson[i].Magnitude).toFixed(2) +' mm</td>'+
											'</tr>'+
											'<tr>'+
												'<th scope="row">Intensity</th>'+
												'<td>'+ parseInt(trackJson[i].Intensity).toFixed(2) +' mm/h</td>'+
											'</tr>'+
											'<tr>'+
												'<th scope="row">Speed</th>'+
												'<td>'+ parseInt(trackJson[i].Speed).toFixed(2) +' </td>'+
											'</tr>'+
										'</tbody>'+
									'</table>'
								);
								currentMarkers.push(trackPoint);

							}
							//var pathLine = L.polyline(trackRoute).addTo(map)

							routePolyline = new L.polyline(trackRoute, {
							color: 'white',
							weight: 1.5,
							opacity: 0.5,
							smoothFactor: 1,
							dashArray: '5, 5',
							dashOffset: '0'
						}).addTo(map);

				    },
				    error: function() {
				        alert("error")
				    }
					});


					$.ajax("/real-time-xray/"+items["folder"]+"csv", {
						success: function(data) {
							var province_id = [];
							var province_csv =  JSON.parse(CSV2JSON(data));
								//length - 1 because there is last blank line
							for(var i=0; i<province_csv.length-1; i++){
								province_id.push(province_csv[i].ID_subprovinces);
							}
							getIntersectArea(province_id.join());
						},
						error: function() {
							alert("error")
						}
					});
					//SHOW MAP LEGEND
					$('.legend-map').removeClass('hide');

					var tdWmsRainLayer = L.tileLayer.wms("https://thredds-servir.adpc.net/thredds/wms/RAINSTORM/realtime/"+items["folder"]+"nc", {
						layers: 'rain',
						format: 'image/png',
						time: date+'T'+_time+':00:00.000Z',
						transparent: true,
						styles: 'boxfill/rainbow',
						opacity:1,
						version:'1.3.0',
						zIndex:100,
						colorscalerange:'0,150',
						bounds: [[0, 90], [22, 120]],
						logscale: false,
						abovemaxcolor:'extend',
						belowmincolor:'extend',
						numcolorbands: 150,
					});

					if(map.hasLayer(tdWmsLayer)){
						map.removeLayer(tdWmsLayer);
					}
					if(map.hasLayer(routePolyline)){
						map.removeLayer(routePolyline);
					}

					var timeDimension = new L.TimeDimension();
						map.timeDimension = timeDimension;

						var player = new L.TimeDimension.Player({
								loop: true,
								startOver: true
						}, timeDimension);

							$('.btn-prev').click(function() {
									map.timeDimension.previousTime(1);
							});
							$('.btn-next').click(function() {
									map.timeDimension.nextTime();
							});

							$('.btn-play').click(function() {
									var btn = $(this);
									if (player.isPlaying()) {
											btn.removeClass("btn-pause");
											btn.addClass("btn-play");
											btn.html("Play");
											player.stop();
									} else {
											btn.removeClass("btn-play");
											btn.addClass("btn-pause");
											btn.html("Pause");
											player.start();
									}
							});

							$('.btn-pause').click(function() {
									var btn = $(this);
									if (player.isPlaying()) {
											btn.removeClass("btn-pause");
											btn.addClass("btn-play");
											btn.html("Play");
											player.stop();
									} else {
											btn.removeClass("btn-play");
											btn.addClass("btn-pause");
											btn.html("Pause");
											player.start();
									}
							});


					tdWmsLayer = L.timeDimension.layer.wms(tdWmsRainLayer, {
	            updateTimeDimension: true,
	            setDefaultTime: true,
	            cache: 365,
	            zIndex: 100,
	        });
	        tdWmsLayer.addTo(map);

					var firstLoad = 0;
					map.timeDimension.on('timeload', function(data) {
								var date = new Date(map.timeDimension.getCurrentTime());
								var zone = "Europe/London" //UTC
								$("#date-text").html(moment(date).tz(zone).utc().format("YYYY/MM/DD"));
								$("#time-text").html(moment(date).tz(zone).utc().format('HH:mm'));

								firstLoad += 1;
								setTimeout(function(){
									if(firstLoad === 1){
									$('.btn-prev').click();
									}
								}, 5);

								if (data.time == map.timeDimension.getCurrentTime()) {
										$('.map-loading').css('display', 'none');
								}
						});
					map.timeDimension.on('timeloading', function(data) {
							if (data.time == map.timeDimension.getCurrentTime()) {
									$('.map-loading').css('display', 'block');
							}
					});

				},
				function (error) {
					// Error Callback
					console.log('ERROR: ' + error);
				}
			);
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

		// $('input[type=checkbox][name=weather_radar]').click(function(){
		// 	if(this.checked) {
		// 		$(".weather-control").css("display", "block");
		// 		showFrame(lastPastFramePosition, true);
		// 	}else{
		// 		$(".weather-control").css("display", "none");
		// 		for (var i in radarLayers) {
		// 				map.removeLayer(radarLayers[i]);
		// 		}
		// 	}
		// });
		//
		// $('#weather_previous').click(function(){
		// 	stop(); showFrame(animationPosition - 1); return;
		// });
		//
		// $('#weather_playstop').click(function(){
		// 	playStop();
		// });
		//
		// $('#weather_next').click(function(){
		// 	stop(); showFrame(animationPosition + 1); return;
		// });
		//
		// $("input[name=kind][value='satellite']").click(function(){
		// 	setKind('satellite');
		// });
		//
		// $("input[name=kind][value='radar']").click(function(){
		// 	setKind('radar');
		// });



		// $('input[type=checkbox][name=storm_image]').click(function(){
		// 	if(this.checked){
		// 		map.setLayoutProperty('wms-test-layer', 'visibility', 'visible');
		// 	}else{
		// 		map.setLayoutProperty('wms-test-layer', 'visibility', 'none');
		// 	}
		// });

		$('input[type=checkbox][name=affected_area]').click(function(){
			if(this.checked) {
				map.addLayer(affected_district);
			}else{
				if (map.hasLayer(affected_district)) {
					map.removeLayer(affected_district);
				}
			}
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

		$(document).on('click', '.liPlaceName', function(event) {
			$('#menu-close-btn').click();
			event.preventDefault();
			/* Act on the event */
			getDetail($(this).attr('data-id'));

		});

		$(document).on('click', '#loadmore-op-btn', function() {
			this.remove();
			var endNumber = loadCount + 10;
			if($scope.events.length < endNumber){
				endNumber = $scope.events.length;
			}else{
				endNumber = endNumber;
			}
			for(var i = loadCount; i< endNumber; i++){
				loadCount += 1;
				var sid =  $scope.events[i]["id"];
				var sdate = $scope.events[i]["date2"] + ' '+ $scope.events[i]["date"].split(" ")[1];
				var lng = $scope.events[i]["center_lng"];
				var lat = $scope.events[i]["center_lat"];
				var mctime = $scope.events[i]["mctime"];
				var mcspace = $scope.events[i]["mcspace"];
				var mcmax = $scope.events[i]["mcmax"];
				var mcvol = $scope.events[i]["mcvol"];
				var total_mag = $scope.events[i]["total_mag"];

				if(mcmax <= 45.44 && mcvol < 4.69){
					var megClass = colors[0];
				}else if ( mcmax <= 61.84 && mcvol < 9.47) {
					var megClass = colors[1];
				}
				else if ( mcmax <= 72.69 && mcvol < 12.64) {
					var megClass = colors[2];
				}
				else if ( mcmax <= 83.11 && mcvol < 15.68) {
					var megClass = colors[3];
				}
				else if ( mcmax <= 96.59 && mcvol < 19.61) {
					var megClass = colors[4];
				}
				else if ( mcmax <= 106.76 && mcvol < 22.56) {
					var megClass = colors[5];
				}
				else if ( mcmax <= 116.76 && mcvol < 25.50) {
					var megClass = colors[6];
				}
				else if ( mcmax <= 130.04 && mcvol < 29.37) {
					var megClass = colors[7];
				}
				else if (mcmax >= 130.05) {
					var megClass = colors[8];
				}

				$("#tableOperationalList").append('<li>'+
				'<a href="#" class="liPlaceName" data-id="'+sid+'">'+
				'<div class="row">'+
				'<div class="col-sm-3"><div class="meg-number" style="background-color:'+megClass+'"><p>'+mcvol.toFixed(2)+'</p></div></div>'+
				'<div class="col-sm-9">'+
				'<p class="place-name-list">'+ sdate + '</p>'+
				'<p class="place-location-list"><b>Total volume:</b> '+ mcvol.toFixed(2)+ ' km<sup>3</sup></p>'+
				'<p class="place-location-list"><b>Duration:</b> '+ mctime+' hrs</p>'+
				'<p class="place-location-list"><b>Max intensity:</b> '+ mcmax.toFixed(2)+' mm/h</p>'+
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


		});
	});
