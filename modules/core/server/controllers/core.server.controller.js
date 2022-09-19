'use strict';

var validator = require('validator'),
path = require('path'),
db = require(path.resolve('./config/lib/db')),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {

  var safeUserObject = null;

  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      createdAt: req.user.createdAt.toString(),
      roles: req.user.dataValues.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: safeUserObject
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.getEvents = function (req, res) {
  var query = "SELECT * FROM tbl_events WHERE 1=1 AND  mcmax > 45.44";
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.getNearRealTimeEvents = function (req, res) {
  //var query = "SELECT * FROM tbl_operational_events WHERE 1=1 AND  mcmax > 45.44";
  var query = "SELECT * FROM tbl_operational_events WHERE 1=1 ";
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.getRealTimeEvents = function (req, res) {
  //var query = "SELECT * FROM tbl_operational_events WHERE 1=1 AND  mcmax > 45.44";
  var query = "SELECT * FROM tbl_realtime_events WHERE 1=1 ";
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.getFFG = function (req, res) {
  //var query = "SELECT * FROM tbl_operational_events WHERE 1=1 AND  mcmax > 45.44";
  var query = "SELECT ffg.* , ST_AsGeoJSON(geom) as geom from mrcffg ffg left join mrcffg_basins on ffg.basin_id= mrcffg_basins.value limit 100;";
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};


exports.getDetail = function (req, res) {
  var params = req.params;
  var id = params.id;
  var query = "SELECT * FROM tbl_events WHERE id="+id;
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.getNearRealTimeDetail = function (req, res) {
  var params = req.params;
  var id = params.id;
  var query = "SELECT * FROM tbl_operational_events WHERE id="+id;
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.getRealTimeDetail = function (req, res) {
  var params = req.params;
  var id = params.id;
  var query = "SELECT * FROM tbl_realtime_events WHERE id="+id;
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.getNumberofStorms = function (req, res) {
  var params = req.params;
  var id = params.id;
  var query = "SELECT adm0.name_0, count(tbl_operational_events.id) AS total, max(tbl_operational_events.mctime) AS mctime, max(tbl_operational_events.mcmax) AS mcmax, max(tbl_operational_events.mcspace) AS mcspace, max(tbl_operational_events.mcvol) AS mcvol, max(tbl_operational_events.total_mag) AS total_mag  FROM adm0 LEFT JOIN tbl_operational_events ON st_contains(adm0.geom, ST_SetSRID(ST_MakePoint(tbl_operational_events.lng_start, tbl_operational_events.lat_start),4326)) GROUP BY adm0.gid;";
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.getNumberofStormsBulletine = function (req, res) {
  var params = req.params;
  var id = params.id;
  var query = "SELECT adm0.name_0, count(tbl_events.id) AS total, max(tbl_events.mctime) AS mctime, max(tbl_events.mcmax) AS mcmax, max(tbl_events.mcspace) AS mcspace, max(tbl_events.mcvol) AS mcvol, max(tbl_events.total_mag) AS total_mag FROM adm0 LEFT JOIN tbl_events ON st_contains(adm0.geom, ST_SetSRID(ST_MakePoint(tbl_events.lon_start, tbl_events.lat_start),4326)) where date ='2022-08-12' GROUP BY adm0.gid;";
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.getRealtimeNumberofStorms = function (req, res) {
  var params = req.params;
  var id = params.id;
  var query = "SELECT adm0.name_0, count(tbl_realtime_events.id) AS total, max(tbl_realtime_events.mctime) AS mctime, max(tbl_realtime_events.mcmax) AS mcmax, max(tbl_realtime_events.mcspace) AS mcspace, max(tbl_realtime_events.mcvol) AS mcvol, max(tbl_realtime_events.total_mag) AS total_mag  FROM adm0 LEFT JOIN tbl_realtime_events ON st_contains(adm0.geom, ST_SetSRID(ST_MakePoint(tbl_realtime_events.lng_start, tbl_realtime_events.lat_start),4326)) GROUP BY adm0.gid;";
	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.filterEvents = function (req, res) {
  var params = req.params;
  var monthRange = params.monthRange;
  var yearRange = params.yearRange;

  var start_vol = params.start_vol;
  var end_vol = params.end_vol;
  var start_duration = params.start_duration;
  var end_duration = params.end_duration;
  var min_intensity = params.min_intensity;
  var max_intensity = params.max_intensity;
  var filter_area = params.filter_area;

  var main_sql = "SELECT * FROM (SELECT * FROM tbl_events WHERE 1=1 "

  if(start_vol !== '9999' || end_vol !== '9999') main_sql = main_sql + " AND mcvol < "+end_vol ;
  if(start_duration !== '9999' || end_duration !== '9999') main_sql = main_sql + " AND mctime BETWEEN "+start_duration+" AND "+start_duration;
  if(min_intensity !== '9999' || max_intensity !== '9999') main_sql = main_sql + " AND mcmax < "+max_intensity;
  //if(start_date !== '9999' || end_date !== '9999') main_sql = main_sql + " AND to_date(date2,'DD/MM/YYYY') BETWEEN '"+start_date+"' AND '"+end_date+"'";
  if(filter_area !== 'none') main_sql = main_sql + " AND ST_DWithin(ST_SetSRID(ST_MakePoint(center_lng, center_lat),4326), (SELECT geom FROM adm0 WHERE name_0 = '"+ filter_area +"'), 0) "
  main_sql = main_sql + " AND substring(date2,1,4) = ANY('{" + yearRange +"}'::text[])";
  main_sql = main_sql + " AND substring(date2,6,2) = ANY('{" + monthRange +"}'::text[])";
  main_sql = main_sql + " AND  mcmax > 45.44";
  var query = main_sql + " ORDER BY to_date(date2,'DD/MM/YYYY') ASC) as table1 WHERE 1=1  "

  if(start_vol !== '9999' || end_vol !== '9999') query = query + " AND mcvol >= "+start_vol ;
  if(min_intensity !== '9999' || max_intensity !== '9999') query = query + " OR mcmax >= "+min_intensity;

	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};


exports.filterOperationalEvents = function (req, res) {
  var params = req.params;
  var start_vol = params.start_vol;
  var end_vol = params.end_vol;
  var start_duration = params.start_duration;
  var end_duration = params.end_duration;
  var min_intensity = params.min_intensity;
  var max_intensity = params.max_intensity;
  var filter_area = params.filter_area;

  var main_sql = "SELECT * FROM (SELECT * FROM tbl_operational_events WHERE 1=1 "

  if(start_vol !== '9999' || end_vol !== '9999') main_sql = main_sql + " AND mcvol < "+end_vol ;
  if(start_duration !== '9999' || end_duration !== '9999') main_sql = main_sql + " AND mctime BETWEEN "+start_duration+" AND "+start_duration;
  if(min_intensity !== '9999' || max_intensity !== '9999') main_sql = main_sql + " AND mcmax < "+max_intensity;
  //if(start_date !== '9999' || end_date !== '9999') main_sql = main_sql + " AND to_date(date2,'DD/MM/YYYY') BETWEEN '"+start_date+"' AND '"+end_date+"'";
  if(filter_area !== 'none') main_sql = main_sql + " AND ST_DWithin(ST_SetSRID(ST_MakePoint(center_lng, center_lat),4326), (SELECT geom FROM adm0 WHERE name_0 = '"+ filter_area +"'), 0) "
  //main_sql = main_sql + " AND  mcmax > 45.44";
  var query = main_sql + " ORDER BY to_date(date2,'YYYY-MM-DD') ASC) as table1 WHERE 1=1  "

  if(start_vol !== '9999' || end_vol !== '9999') query = query + " AND mcvol >= "+start_vol ;
  if(min_intensity !== '9999' || max_intensity !== '9999') query = query + " OR mcmax >= "+min_intensity;

	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};


exports.filterRealTimeEvents = function (req, res) {
  var params = req.params;
  var start_vol = params.start_vol;
  var end_vol = params.end_vol;
  var start_duration = params.start_duration;
  var end_duration = params.end_duration;
  var min_intensity = params.min_intensity;
  var max_intensity = params.max_intensity;
  var filter_area = params.filter_area;

  var main_sql = "SELECT * FROM (SELECT * FROM tbl_realtime_events WHERE 1=1 "

  if(start_vol !== '9999' || end_vol !== '9999') main_sql = main_sql + " AND mcvol < "+end_vol ;
  if(start_duration !== '9999' || end_duration !== '9999') main_sql = main_sql + " AND mctime BETWEEN "+start_duration+" AND "+start_duration;
  if(min_intensity !== '9999' || max_intensity !== '9999') main_sql = main_sql + " AND mcmax < "+max_intensity;
  //if(start_date !== '9999' || end_date !== '9999') main_sql = main_sql + " AND to_date(date2,'DD/MM/YYYY') BETWEEN '"+start_date+"' AND '"+end_date+"'";
  if(filter_area !== 'none') main_sql = main_sql + " AND ST_DWithin(ST_SetSRID(ST_MakePoint(center_lng, center_lat),4326), (SELECT geom FROM adm0 WHERE name_0 = '"+ filter_area +"'), 0) "
  //main_sql = main_sql + " AND  mcmax > 45.44";
  var query = main_sql + " ORDER BY to_date(date2,'YYYY-MM-DD') ASC) as table1 WHERE 1=1  "

  if(start_vol !== '9999' || end_vol !== '9999') query = query + " AND mcvol >= "+start_vol ;
  if(min_intensity !== '9999' || max_intensity !== '9999') query = query + " OR mcmax >= "+min_intensity;

	db.any(query)
	.then(data => {
		// success
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(data));
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

exports.intersectArea = function(req, res) {
  var params = req.params;
  var storm_id = params.id;
  var subprovince_id = params.id;

  // var sql="SELECT f.id_0, f.id_1, f.id_2,  f.proportion, f.name_0, f.name_1, f.name_2, f.st_asgeojson, t1.trunks, t1.primary, t1.secondary, t2.total_pop, t2.female, t2.male, t2.f_0_15, t2.f_15_65, t2.f_65, t2.m_0_15, t2.m_15_65, t2.m_65, t3.hospitals \
  // FROM (SELECT adm2.* ,ST_AsGeoJSON(adm2.geom), (ST_Area(ST_Intersection(adm2.geom, ST_MakePolygon(ST_MakeLine(array[\
  //     ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  // ]))))/ST_Area(ST_MakePolygon(ST_MakeLine(array[\
  //     ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  // ])))) as proportion ,ST_Intersects(adm2.geom, ST_MakePolygon(ST_MakeLine(array[ \
  //     ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  // ])))\
  // FROM adm2, tbl_realtime_events e WHERE e.id= "+storm_id+"\
  // AND ST_Intersects(adm2.geom, ST_MakePolygon(ST_MakeLine(array[\
  //     ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  // ])))) AS f\
  // INNER JOIN road_table as t1 on f.id_0 = t1.id_0 AND f.id_1 = t1.id_1 AND f.id_2 = t1.id_2\
  // INNER JOIN population_table as t2 on f.id_0 = t2.id_0 AND f.id_1 = t2.id_1 AND f.id_2 = t2.id_2\
  // INNER JOIN hospital_table as t3 on f.id_0 = t3.id_0 AND f.id_1 = t3.id_1 AND f.id_2 = t3.id_2\
  // ORDER BY id_0, id_1, id_2 ASC"


  var sql=  "SELECT f.id_0, f.id_1, f.id_2,  f.name_0, f.name_1, f.name_2, f.st_asgeojson, t1.trunks, t1.primary, t1.secondary, t2.total_pop, t2.female, t2.male, t2.f_0_15, t2.f_15_65, t2.f_65, t2.m_0_15, t2.m_15_65, t2.m_65, t3.hospitals\
    FROM (SELECT adm2.* ,ST_AsGeoJSON(adm2.geom) FROM adm2 WHERE id_2 in ("+subprovince_id+")) AS f\
    INNER JOIN road_table as t1 on f.id_0 = t1.id_0 AND f.id_1 = t1.id_1 AND f.id_2 = t1.id_2\
    INNER JOIN population_table as t2 on f.id_0 = t2.id_0 AND f.id_1 = t2.id_1 AND f.id_2 = t2.id_2\
    INNER JOIN hospital_table as t3 on f.id_0 = t3.id_0 AND f.id_1 = t3.id_1 AND f.id_2 = t3.id_2\
    ORDER BY id_0, id_1, id_2 ASC"

  db.any(sql)
    .then(data => {
      // success
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(data));
    })
    .catch(error => {
      console.log('ERROR:', error); // print the error;
      console.log('ERROR');
    });
}

exports.realtimeintersectArea = function(req, res) {
  var params = req.params;
  var storm_id = params.id;
  var subprovince_id = params.id;

  // var sql="SELECT f.id_0, f.id_1, f.id_2,  f.proportion, f.name_0, f.name_1, f.name_2, f.st_asgeojson, t1.trunks, t1.primary, t1.secondary, t2.total_pop, t2.female, t2.male, t2.f_0_15, t2.f_15_65, t2.f_65, t2.m_0_15, t2.m_15_65, t2.m_65, t3.hospitals \
  // FROM (SELECT adm2.* ,ST_AsGeoJSON(adm2.geom), (ST_Area(ST_Intersection(adm2.geom, ST_MakePolygon(ST_MakeLine(array[\
  //     ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  // ]))))/ST_Area(ST_MakePolygon(ST_MakeLine(array[\
  //     ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  // ])))) as proportion ,ST_Intersects(adm2.geom, ST_MakePolygon(ST_MakeLine(array[ \
  //     ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  // ])))\
  // FROM adm2, tbl_realtime_events e WHERE e.id= "+storm_id+"\
  // AND ST_Intersects(adm2.geom, ST_MakePolygon(ST_MakeLine(array[\
  //     ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_min_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_max_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_max_y),4326)\
  //    ,ST_SetSRID(ST_MakePoint(e.ext_min_x,e.ext_min_y),4326)\
  // ])))) AS f\
  // INNER JOIN road_table as t1 on f.id_0 = t1.id_0 AND f.id_1 = t1.id_1 AND f.id_2 = t1.id_2\
  // INNER JOIN population_table as t2 on f.id_0 = t2.id_0 AND f.id_1 = t2.id_1 AND f.id_2 = t2.id_2\
  // INNER JOIN hospital_table as t3 on f.id_0 = t3.id_0 AND f.id_1 = t3.id_1 AND f.id_2 = t3.id_2\
  // ORDER BY id_0, id_1, id_2 ASC"


  var sql=  "SELECT f.id_0, f.id_1, f.id_2,  f.name_0, f.name_1, f.name_2, f.st_asgeojson, t1.trunks, t1.primary, t1.secondary, t2.total_pop, t2.female, t2.male, t2.f_0_15, t2.f_15_65, t2.f_65, t2.m_0_15, t2.m_15_65, t2.m_65, t3.hospitals\
    FROM (SELECT adm2.* ,ST_AsGeoJSON(adm2.geom) FROM adm2 WHERE id_2 in ("+subprovince_id+")) AS f\
    INNER JOIN road_table as t1 on f.id_0 = t1.id_0 AND f.id_1 = t1.id_1 AND f.id_2 = t1.id_2\
    INNER JOIN population_table as t2 on f.id_0 = t2.id_0 AND f.id_1 = t2.id_1 AND f.id_2 = t2.id_2\
    INNER JOIN hospital_table as t3 on f.id_0 = t3.id_0 AND f.id_1 = t3.id_1 AND f.id_2 = t3.id_2\
    ORDER BY id_0, id_1, id_2 ASC"

  db.any(sql)
    .then(data => {
      // success
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(data));
    })
    .catch(error => {
      console.log('ERROR:', error); // print the error;
      console.log('ERROR');
    });
}
