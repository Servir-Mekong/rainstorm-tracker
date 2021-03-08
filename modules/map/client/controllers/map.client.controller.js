

'use strict';

angular.module('core').controller('mapCtrl', function ($scope, $http) {

	$scope.rssFeeds = [];
	var filterArea = 'none';

	$(document).ready(function(){
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


	/**
	* RSS Feed
	*/
	var apiCall = function (url, method) {
		//console.log(method, url);
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};



	mapboxgl.accessToken = 'pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g';
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/servirmekong/ckecozln92fkk19mjhuoqxhuw', //statlleite
		zoom: 4,
		center: [102.104, 16.610]
	});
	//drak theme basemap
	//styles/v1/servirmekong/ckduef35613el19qlsoug6u2h


	map.on('load', function () {

		// Load geographic coverage area Geojson
		 $.getJSON('data/storm_boundingbox.geojson')
			.done(function (data, status) {
				map.addSource('storm_boundingbox', {
				'type': 'geojson',
				'data': data
				});

			});

		// Load mekong BBox area Geojson
		 $.getJSON('data/mekong_bb.geojson')
			.done(function (data, status) {
				map.addSource('mekong_bb', {
				'type': 'geojson',
				'data': data
				});

			});

		// lond country boundary
		$.getJSON('data/adm0.geojson')
		 .done(function (data, status) {
			 map.addSource('mekong_country', {
					 'type': 'geojson',
					 'data': data
			 });

			 map.addLayer({
					 'id': 'state-fills',
					 'type': 'fill',
					 'source': 'mekong_country',
					 'layout': {},
					 'paint': {
							 'fill-color': '#9999ff',
							 'fill-opacity': [
									 'case',
									 ['boolean', ['feature-state', 'hover'], false],
									 0.5,
									 0.2
							 ]
					 }
			 });

			 map.addLayer({
					 'id': 'state-borders',
					 'type': 'line',
					 'source': 'mekong_country',
					 'layout': {},
					 'paint': {
							 'line-color': '#FFFFFF',
							 'line-width': 0.5
					 }
			 });
		 });
});

	//hide mekong BBox and geographic coverage area
	$("#mekong_bb").click();
	$("#geographic_coverage").click();

	var hoveredStateId = null;
	// When the user moves their mouse over the state-fill layer, we'll update the
	// feature state for the feature under the mouse.
	map.on('mousemove', 'state-fills', function (e) {
		if (e.features.length > 0) {
			if (hoveredStateId) {
				map.setFeatureState(
				{ source: 'mekong_country', id: hoveredStateId },
				{ hover: false }
				);
			}
			hoveredStateId = e.features[0].id;
			map.setFeatureState(
				{ source: 'mekong_country', id: hoveredStateId },
				{ hover: true }
			);
		}
	});


	map.on('mouseleave', 'state-fills', function () {
		if (hoveredStateId) {
			map.setFeatureState(
				{ source: 'mekong_country', id: hoveredStateId },
				{ hover: false }
			);
		}
			hoveredStateId = null;
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

		$("#tableList").append('<li id="loadmore-btn" style="text-align:center;cursor: pointer;">'+
		'Load More'+
		'</li>');
		$("#loadmore-btn").click();

		setTimeout(function(){

			var total_mag1 = ['==', ['get', 'storm_class'], 1];
			var total_mag2 = ['==', ['get', 'storm_class'], 2];
			var total_mag3 = ['==', ['get', 'storm_class'], 3];
			var total_mag4 = ['==', ['get', 'storm_class'], 4];
			var total_mag5 = ['==', ['get', 'storm_class'], 5];
			var total_mag6 = ['==', ['get', 'storm_class'], 6];
			var total_mag7 = ['==', ['get', 'storm_class'], 7];
			var total_mag8 = ['==', ['get', 'storm_class'], 8];
			var total_mag9 = ['==', ['get', 'storm_class'], 9];


			// add a clustered GeoJSON source for a sample set of rainstorms
			map.addSource('rainstorms', {
				'type': 'geojson',
				'data':geojson,
				'cluster': true,
				'clusterRadius': 45,
				'clusterProperties': {
					// keep separate counts for each total_magnitude category in a cluster
					'total_mag1': ['+', ['case', total_mag1, 1, 0]],
					'total_mag2': ['+', ['case', total_mag2, 1, 0]],
					'total_mag3': ['+', ['case', total_mag3, 1, 0]],
					'total_mag4': ['+', ['case', total_mag4, 1, 0]],
					'total_mag5': ['+', ['case', total_mag5, 1, 0]],
					'total_mag6': ['+', ['case', total_mag6, 1, 0]],
					'total_mag7': ['+', ['case', total_mag7, 1, 0]],
					'total_mag8': ['+', ['case', total_mag8, 1, 0]],
					'total_mag9': ['+', ['case', total_mag9, 1, 0]]
				}
			});
			// circle and symbol layers for rendering individual rainstorms (unclustered points)
			map.addLayer({
				'id': 'storm_circle',
				'type': 'circle',
				'source': 'rainstorms',
				'filter': ['!=', 'cluster', true],
				'paint': {
					'circle-color': [
						'case',
						total_mag1,
						colors[0],
						total_mag2,
						colors[1],
						total_mag3,
						colors[2],
						total_mag4,
						colors[3],
						total_mag5,
						colors[4],
						total_mag6,
						colors[5],
						total_mag7,
						colors[6],
						total_mag8,
						colors[7],
						colors[8]
					],
					'circle-opacity': 0.8,
					'circle-radius': 12
				}
			});
			map.addLayer({
				'id': 'storm_label',
				'type': 'symbol',
				'source': 'rainstorms',
				'filter': ['!=', 'cluster', true],
				'layout': {
					'text-field': [
						'number-format',
						['get', 'mcvol'],
						{ 'min-fraction-digits': 1, 'max-fraction-digits': 2 }
					],
					'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
					'text-size': 10
				},
				'paint': {
					'text-color': [
						'case',
						['<', ['get', 'mcvol'], 3],
						'black',
						'white'
					]
				}
			});

		}, 1000);
	}

	$scope.fetchEvents = function () {
		var eventsURL = '/' + $.param({action: 'get-events'});
		// Make a request
		apiCall(eventsURL, 'POST').then(
			function (response) {
				// Success Callback
				loadCount = 0;
				$scope.events = response.data;
				$("#tableList").html("");
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
	// objects for caching and keeping track of HTML marker objects (for performance)
	var markers = {};
	var markersOnScreen = {};

	function updateMarkers() {
		var newMarkers = {};
		var features = map.querySourceFeatures('rainstorms');

		// for every cluster on the screen, create an HTML marker for it (if we didn't yet),
		// and add it to the map if it's not there already
		for (var i = 0; i < features.length; i++) {

			var coords = features[i].geometry.coordinates;
			var props = features[i].properties;
			if (!props.cluster) continue;
			var id = props.cluster_id;

			var marker = markers[id];
			if (!marker) {
				var el = createDonutChart(props);
				marker = markers[id] = new mapboxgl.Marker({
					element: el
				}).setLngLat(coords)

			}
			newMarkers[id] = marker;

			if (!markersOnScreen[id]) marker.addTo(map);
		}
		// for every marker we've added previously, remove those that are no longer visible
		for (id in markersOnScreen) {
			if (!newMarkers[id]) markersOnScreen[id].remove();
		}
		markersOnScreen = newMarkers;
	}

	// after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
	map.on('data', function(e) {
		if (e.sourceId !== 'rainstorms' || !e.isSourceLoaded) return;

		map.on('move', updateMarkers);
		map.on('moveend', updateMarkers);
		updateMarkers();
	});


	// code for creating an SVG donut chart from feature properties
	function createDonutChart(props) {
		var offsets = [];
		var counts = [
			props.total_mag1,
			props.total_mag2,
			props.total_mag3,
			props.total_mag4,
			props.total_mag5,
			props.total_mag6,
			props.total_mag7,
			props.total_mag8,
			props.total_mag9
		];
		var total = 0;
		for (var i = 0; i < counts.length; i++) {
			offsets.push(total);
			total += counts[i];
		}

		var fontSize = total >= 1000 ? 18 : total >= 100 ? 16 : total >= 10 ? 14 : 12;
		//circle size category
		// var r = total >= 1000 ? 45 : total >= 100 ? 35 : total >= 10 ? 25 : 18;
		var r =  18;
		var r0 = Math.round(r * 0.5 );
		var w = r * 2;

		var html =
		'<div><svg width="' +
		w +
		'" height="' +
		w +
		'" viewbox="0 0 ' +
		w +
		' ' +
		w +
		'" text-anchor="middle" style="font: ' +
		fontSize +
		'px Bai Jamjuree; display: block; color:#FFFFFF00">';

		for (var i = 0; i < counts.length; i++) {

			html += donutSegment(
				offsets[i] / total,
				(offsets[i] + counts[i]) / total,
				r,
				r0,
				colors[i]
			);
		}

			html +=
			'<circle cx="' +
			r +
			'" cy="' +
			r +
			'" r="' +
			r0 +
			'" fill="#FFFFFF00" /><text dominant-baseline="central" transform="translate(' +
			r +
			', ' +
			r +
			')">' +
			//show number of cluter points
			// total.toLocaleString() +
			'</text></svg></div>';
		var el = document.createElement('div');
		el.innerHTML = html;
		return el.firstChild;
	}

	function donutSegment(start, end, r, r0, color) {

		if (end - start === 1) end -= 0.00001;
		var a0 = 2 * Math.PI * (start - 0.25);
		var a1 = 2 * Math.PI * (end - 0.25);
		var x0 = Math.cos(a0),
		y0 = Math.sin(a0);
		var x1 = Math.cos(a1),
		y1 = Math.sin(a1);
		var largeArc = end - start > 0.5 ? 1 : 0;

		return [
			'<path d="M',
			r + r0 * x0,
			r + r0 * y0,
			'L',
			r + r * x0,
			r + r * y0,
			'A',
			r,
			r,
			0,
			largeArc,
			1,
			r + r * x1,
			r + r * y1,
			'L',
			r + r0 * x1,
			r + r0 * y1,
			'A',
			r0,
			r0,
			0,
			largeArc,
			0,
			r + r0 * x0,
			r + r0 * y0,
			'" stroke="#fff" stroke-width="1" fill="' + color + '" />'
		].join(' ');
	}


	// inspect a cluster on click
	map.on('click', 'storm_circle', function (e) {
		map.setLayoutProperty('state-fills', 'visibility', 'none');
		var features = map.queryRenderedFeatures(e.point, { layers: ['storm_circle'] });
		var clusterId = features[0].properties;
		getDetail(e.features[0].properties.id);
	});
	var popupStorm;
	map.on('mouseenter', 'storm_circle', function (e) {
		map.setLayoutProperty('state-fills', 'visibility', 'none');
		map.getCanvas().style.cursor = 'pointer';
		popupStorm = new mapboxgl.Popup({ closeOnClick: false })
		.setLngLat(e.lngLat)
		.setHTML(
			'<h4>' + e.features[0].properties.date + '</h4>'+
				'<table class="table table-striped">'+
				  '<tbody>'+
				    '<tr>'+
				      '<th scope="row"> Storm Volume</th>'+
				      '<td>'+ e.features[0].properties.mcvol.toFixed(2) +' km<sup>3</sup></td>'+
				    '</tr>'+
				    '<tr>'+
				      '<th scope="row">Storm Duration</th>'+
				      '<td>'+ e.features[0].properties.mctime.toFixed(2) +' hrs</td>'+
				    '</tr>'+
				  '</tbody>'+
				'</table>')
		.addTo(map)



	});
	map.on('mouseleave', 'storm_circle', function () {
		//map.setLayoutProperty('state-fills', 'visibility', 'visible');
		popupStorm.remove();
	});


	// When a click event occurs on a feature in the places layer, open a popup at the
	// location of the feature, with description HTML from its properties.
	map.on('click', 'state-fills', function (e) {
	var coordinates = e.features[0].geometry.coordinates.slice();
	var country_name_0 = e.features[0].properties.NAME_0;
	filterArea = e.features[0].properties.NAME_0;
	$('#search-filter-btn').click();

	});

	/**
	 * Use Mapbox GL JS's `flyTo` to move the camera smoothly
	 * a given center point.
	 **/

	function flyToStore(lat, lng) {
	  map.flyTo({
	    center: [lng, lat],
	    zoom: 7
	  });
	}

	function hideStromPoints(){
			map.setLayoutProperty('state-fills', 'visibility', 'none');
			map.setLayoutProperty('storm_label', 'visibility', 'none');
			map.setLayoutProperty('storm_circle', 'visibility', 'none');
			// Uncheck
			document.getElementById("storm_events").checked = false;
			$("#legend-img").css("display", "block");
			$("#legend-marker").css("display", "none");
	}

	function showStromPoints(){
			map.setLayoutProperty('state-fills', 'visibility', 'visible');
			map.setLayoutProperty('storm_label', 'visibility', 'visible');
			map.setLayoutProperty('storm_circle', 'visibility', 'visible');
			// check
			document.getElementById("storm_events").checked = true;
			$("#legend-img").css("display", "none");
			$("#legend-marker").css("display", "block");
	}

	//hide storm points when zoom out
	// map.on('zoom', function () {
	// 	console.log(map.getZoom());
	// 	if (map.getZoom() < 5) {
	// 		console.log("< 10");
	// 		map.setLayoutProperty('state-fills', 'visibility', 'visible');
	// 		map.setLayoutProperty('storm_label', 'visibility', 'visible');
	// 		map.setLayoutProperty('storm_circle', 'visibility', 'visible');
	// 		document.getElementById("storm_events").checked = true;
	// 		} else {
	// 			map.setLayoutProperty('state-fills', 'visibility', 'none');
	// 			map.setLayoutProperty('storm_label', 'visibility', 'none');
	// 			map.setLayoutProperty('storm_circle', 'visibility', 'none');
	// 			document.getElementById("storm_events").checked = false;
	// 	}
	// });


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
		if (map.getLayer("wms-test-layer")) {
			map.removeLayer("wms-test-layer");
		}
		if (map.getSource("wms-test-source")) {
			map.removeSource("wms-test-source");
		}
		if (map.getLayer("route")) {
			map.removeLayer("route");
		}
		if (map.getSource("route")) {
			map.removeSource("route");
		}
		if (currentMarkers!==null) {
	    for (var i = currentMarkers.length - 1; i >= 0; i--) {
	      currentMarkers[i].remove();
	    }
		}
		$("#toggle_storm_image").css('display', 'block');
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
		if (map.getLayer("wms-test-layer")) {
			map.removeLayer("wms-test-layer");
		}

		if (map.getSource("wms-test-source")) {
			map.removeSource("wms-test-source");
		}
		if (map.getLayer("route")) {
			map.removeLayer("route");
			map.removeSource("route");
		}
		// remove markers
		if (currentMarkers!==null) {
			for (var i = currentMarkers.length - 1; i >= 0; i--) {
				currentMarkers[i].remove();
			}
		}

		var start_year = $("#start_year").val();
		var end_year = $("#end_year").val();

		var slider = $("#month_range").data("ionRangeSlider");
		// Get values
		var startMonth = slider.result.from + 1;
		var endMonth= slider.result.to + 1;
		var monthRange = '';
		var yearRange = '';

		for(var i = start_year; i < end_year; i++){
			yearRange = yearRange + i + ',';
		}
		yearRange = yearRange + end_year;


		for(var i = startMonth; i < endMonth; i++){
			if (i <= 9) i = '0'+ i.toString();
			monthRange = monthRange + i + ',';
		}
		if (endMonth <= 9) endMonth = '0'+ endMonth.toString();
		monthRange = monthRange + endMonth;


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

		var typeOptionsURL = '/' + $.param({action: 'filter-events', yearRange:yearRange, monthRange:monthRange, start_vol:start_vol, end_vol:end_vol, start_duration:start_duration, end_duration:end_duration, min_intensity:min_intensity, max_intensity:max_intensity, filter_area: filter_area});
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				loadCount = 0;
				$scope.events = response.data;
				var items = response.data;
				$("#tableList").html("");

				map.removeLayer('storm_circle');
				map.removeLayer('storm_label');
				map.removeSource('rainstorms');
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
		if (map.getLayer("wms-test-layer")) {
			map.removeLayer("wms-test-layer");
		}

		if (map.getSource("wms-test-source")) {
			map.removeSource("wms-test-source");
		}
		if (map.getLayer("route")) {
			map.removeLayer("route");
			map.removeSource("route");
		}
		// remove markers
		if (currentMarkers!==null) {
			for (var i = currentMarkers.length - 1; i >= 0; i--) {
				currentMarkers[i].remove();
			}
		}
		var typeOptionsURL = '/' + $.param({action: 'get-events'});
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				var items = response.data;
				$("#tableList").html("");
				map.removeLayer('storm_circle');
				map.removeLayer('storm_label');
				map.removeSource('rainstorms');
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
	function getDetail(sid) {

		$("#legend-img").css("display", "none");
		$("#legend-marker").css("display", "block");

		var typeOptionsURL = '/' + $.param({action: 'get-detail', id:sid});
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				var items = response.data[0];
				var date_split = items["date"].split(" ");

				var date = date_split[0].split("/");
				var _date = date[1];
				if (_date < 10) _date = '0' + _date;
				var _month = date[0];
				if (_month < 10) _month = '0' + _month;
				var _year = date[2];

				var time = date_split[1].split(":");
				var _time = time[0]
				if (_time < 10) _time = '0' + _time;

				var storm_figures = "MCS_"+_year+"-"+_month+"-"+_date+"_"+_time+"0000.png";
				var storm_raster = "MCS_"+_year+"-"+_month+"-"+_date+"_"+_time+"0000";
				var downloadRasterurl = "https://geoserver.adpc.net/geoserver/stroms-mk/wcs?service=WCS&version=2.0.1&request=GetCoverage&CoverageId="+storm_raster+"&format=image/tiff"
				flyToStore(items["center_lat"], items["center_lng"]);
				hideStromPoints();

				var dateFormat = items["date2"] + ' '+ items["date"].split(" ")[1];
				$(".table-detail").html(
					'<div class="row">'+
					'<div class="col-sm-12"><p class="place-name">'+ dateFormat +'</p></div>'+
					'<div class="col-sm-12"><ul><li style="float:left; margin:0;"><a href="/img/storm-figures/'+storm_figures+'" target="_blank" title="Dowload a figure" download>'+
					'<svg width="0.8em" height="0.8em" viewBox="0 0 16 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
					'<path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12z"/>'+
					'<path d="M10.648 7.646a.5.5 0 0 1 .577-.093L15.002 9.5V14h-14v-2l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71z"/>'+
					'<path fill-rule="evenodd" d="M4.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>'+
					'</svg></a></li>'+
					'<li style="float:left; margin:0;"><a href="'+downloadRasterurl+'" target="_blank" title="Dowload a raster file" download>'+
					'<svg width="0.8em" height="0.8em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
					'<path fill-rule="evenodd" d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z"/>'+
					'<path fill-rule="evenodd" d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z"/>'+
					'<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z"/>'+
					'</svg></a></li></ul></div>'+
					'<div class="col-sm-5"><img src="/img/storm-figures/'+storm_figures+'" alt="" style="width:100%;margin-bottom: 20px;"></div>'+
					'<div class="col-sm-7">'+
					'<table style="width:100%; font-size:14px;">'+
					'<tr>'+
					'<td><b>Centroid</b></td>'+
					'<td style="text-align: right;">'+ items["center_lat"].toFixed(2)+', '+items["center_lng"].toFixed(2)+ '</td>'+
					'</tr>'+
					'<tr>'+
					'<td><b>Weighted Centroid</b></td>'+
					'<td style="text-align: right;">'+ items["w_center_lat"].toFixed(2)+', '+items["w_center_lng"].toFixed(2)+ '</td>'+
					'</tr>'+
					'<tr>'+
					'<td><b>Total volume</b></td>'+
					'<td style="text-align: right;">'+ items["mcvol"].toFixed(2)+ ' km<sup>3</sup> </td>'+
					'</tr>'+
					'<tr>'+
					'<td><b>Duration</b></td>'+
					'<td style="text-align: right;">'+ items["mctime"]+ ' hrs </td>'+
					'</tr>'+
					'<tr>'+
					'<td><b>Maximum spatial extension</b></td>'+
					'<td style="text-align: right;">'+ items["mcspace"].toFixed(2)+' km<sup>3</sup></td>'+
					'</tr>'+
					'<tr>'+
					'<td><b>Max intensity</b></td>'+
					'<td style="text-align: right;">'+ items["mcmax"].toFixed(2)+' mm/h </td>'+
					'</tr>'+
					'<tr>'+
					'<td><b>Start storm location</b></td>'+
					'<td style="text-align: right;">'+ items["lat_start"].toFixed(2)+', '+items["lon_start"].toFixed(2)+' </td>'+
					'</tr>'+
					'<tr>'+
					'<td><b>End storm location</b></td>'+
					'<td style="text-align: right;">'+ items["lat_end"].toFixed(2)+', '+items["lon_end"].toFixed(2)+'</td>'+
					'</tr>'+
					'</table>'+
					'</div>'+
					'</div>');

					$('#detail-panel').css("width", "500px");
					if($('#sidenav-table').css("width") == "280px"){
						$(".detail-right").css("right", "285px");
						$(".detail-right").css("height", "auto");
						$(".detail-right").css("top", "90px");
						$(".detail-right").css("padding-top", "10px");

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


					$("#toggle_storm_image").css('display', 'block');

					if (map.getLayer("wms-test-layer")) {
						map.removeLayer("wms-test-layer");
					}

					if (map.getSource("wms-test-source")) {
						map.removeSource("wms-test-source");
					}

					if (map.getLayer("route")) {
						map.removeLayer("route");
						map.removeSource("route");
					}
					// remove markers
					if (currentMarkers!==null) {
						for (var i = currentMarkers.length - 1; i >= 0; i--) {
							currentMarkers[i].remove();
						}
					}

					var trackRoute = []
					// Uncheck
					// document.getElementById("mekong_country").checked = false;
					map.setLayoutProperty('state-fills', 'visibility', 'none');
					map.setLayoutProperty('state-borders', 'visibility', 'none');

					$.ajax("/tracks_csv/"+storm_raster+".csv", {
				    success: function(data) {
				        var trackJson =  JSON.parse(CSV2JSON(data));
								//length - 1 because there is last blank line
							for(var i=0; i<trackJson.length-1; i++){

								trackRoute.push([trackJson[i].Lon, trackJson[i].lat]);
								// create a HTML element for each feature
								var el1 = document.createElement('div');
								if(i === 0){
									el1.className = 'marker marker-start';
								}else if(i === trackJson.length-2){
									el1.className = 'marker marker-end';
								}else{
									el1.className = 'marker marker-track';
								}
								var date = trackJson[i].Dates.split(" ");
								var _date = date[0].split("-");
								var _time = date[1];
								var _date_1 = _date[2];
								var _month =  _date[1];
								var _year =  _date[0];
								var dateNewFormat = _date_1+"/"+_month+"/"+_year+" "+ _time;


								var trackPoint = 	new mapboxgl.Marker(el1)
								.setLngLat([trackJson[i].Lon, trackJson[i].lat])
								.setPopup(
									new mapboxgl.Popup({ closeOnClick: false }) // add popups
									.setHTML(
										'<h4>' + dateNewFormat + '</h4>'+
											'<table class="table table-striped">'+
												'<tbody>'+
													'<tr>'+
														'<th scope="row"> Magnitude</th>'+
														'<td>'+ parseInt(trackJson[i].Magnitude).toFixed(2) +' mm</td>'+
													'</tr>'+
													'<tr>'+
														'<th scope="row">Intensity</th>'+
														'<td>'+ parseInt(trackJson[i].Intensity).toFixed(2) +' mm/h</td>'+
													'</tr>'+
												'</tbody>'+
											'</table>')
									) .addTo(map);
								currentMarkers.push(trackPoint);

							}

							map.addSource('route', {
								'type': 'geojson',
								'data': {
									'type': 'Feature',
									'properties': {},
									'geometry': {
										'type': 'LineString',
										'coordinates': trackRoute
									}
								}
							});
							map.addLayer({
								'id': 'route',
								'type': 'line',
								'source': 'route',
								'layout': {
									'line-join': 'round',
									'line-cap': 'round'
								},
								'paint': {
									'line-color': '#FFF',
									'line-width': 1,
									'line-dasharray': [5, 4],
								}
							});

				    },
				    error: function() {
				        alert("error")
				    }
					});


					//SHOW MAP LEGEND
					$('.legend-map').removeClass('hide');

					// var linkLegend = "https://geoserver.adpc.net/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=10&LAYER=stroms-mk:"+storm_raster+"&style=rainstorms_2&transparent=TRUE&LEGEND_OPTIONS=dx:0.5;dy:0.2;mx:0.2;my:0.2;fontStyle:normal;fontColor:30302E;fontSize:10";
					// $('#img-legend').attr('src',linkLegend);
					map.addSource('wms-test-source', {
						'id': 'wms-test-layer',
						'type': 'raster',
						'tiles': [
							'https://geoserver.adpc.net/geoserver/stroms-mk/wms?service=WMS&version=1.3.0&request=GetMap&layers=stroms-mk:'+storm_raster+'&transparent=true&styles=rainstorms_2&width=256&height=256&srs=EPSG:3857&bbox={bbox-epsg-3857}&FORMAT=image/png'
							//'http://thredds-servir.adpc.net/thredds/wms/mk_aqx/fire/MCS_2016-07-22_200000.nc?service=WMS&request=GetMap&layers=Band1&styles=boxfill%2Falg&format=image%2Fpng&transparent=true&version=1.3.0&width=256&height=256&crs=EPSG%3A3857&bbox={bbox-epsg-3857}'
						],
						'tileSize': 256
					});
					map.addLayer(
						{
							'id': 'wms-test-layer',
							'type': 'raster',
							'source': 'wms-test-source',
							'paint': {}
						}
					);

				},
				function (error) {
					// Error Callback
					console.log('ERROR: ' + error);
				}
			);
		}



		$('input[type=checkbox][name=storm_events]').click(function(){
			if(this.checked) {
				// if($('input[type=checkbox][name=mekong_country]').checked){
				// 	map.setLayoutProperty('state-fills', 'visibility', 'visible');
				// }

				map.setLayoutProperty('storm_label', 'visibility', 'visible');
				map.setLayoutProperty('storm_circle', 'visibility', 'visible');
				$("#legend-img").css("display", "none");
				$("#legend-marker").css("display", "block");
			}else{
				map.setLayoutProperty('storm_label', 'visibility', 'none');
				map.setLayoutProperty('storm_circle', 'visibility', 'none');
			}

		});
		$('input[type=checkbox][name=mekong_bb]').click(function(){
			if(this.checked) {
				if (map.getLayer("mekong_bb")) {
					map.setLayoutProperty('mekong_bb', 'visibility', 'visible');
				}else{
					map.addLayer({
						'id': 'mekong_bb',
						'type': 'fill',
						'source': 'mekong_bb',
						'layout': {},
						'paint': {
							'fill-color': '#9999ff',
							'fill-opacity': 0.1,
						}
					});
				}
			}else{
				map.setLayoutProperty('mekong_bb', 'visibility', 'none');
			}
		});

		$('input[type=checkbox][name=geographic_coverage]').click(function(){
			if(this.checked) {
				if (map.getLayer("storm_boundingbox")) {
					map.setLayoutProperty('storm_boundingbox', 'visibility', 'visible');
				}else{
				map.addLayer({
					'id': 'storm_boundingbox',
					'type': 'fill',
					'source': 'storm_boundingbox',
					'layout': {},
					'paint': {
						'fill-color': '#9999ff',
						'fill-opacity': 0.1,
						'fill-outline-color': "#9999ff",
					}
				});
			}
			}else{
				map.setLayoutProperty('storm_boundingbox', 'visibility', 'none');
			}
		});

		$('input[type=checkbox][name=mekong_country]').click(function(){
			if(this.checked) {
				map.setLayoutProperty('state-fills', 'visibility', 'visible');
				map.setLayoutProperty('state-borders', 'visibility', 'visible');
			}else{
				map.setLayoutProperty('state-fills', 'visibility', 'none');
				map.setLayoutProperty('state-borders', 'visibility', 'none');
			}
		});


		$('input[type=checkbox][name=storm_image]').click(function(){
			if(this.checked){
				map.setLayoutProperty('wms-test-layer', 'visibility', 'visible');
			}else{
				map.setLayoutProperty('wms-test-layer', 'visibility', 'none');
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

		$(document).on('click', '#loadmore-btn', function() {
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

				$("#tableList").append('<li>'+
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
				$("#tableList").append('<li id="loadmore-btn" style="text-align:center;cursor: pointer;">'+
				'Load More'+
				'</li>');
			}


		});
	});
