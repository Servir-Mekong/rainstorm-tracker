'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

  // APIs
  // app.route('/action=map-data&index=:index?&timeFrequency=:timeFrequency&date=:date?').post(core.getMapData);
  //
  // app.route('/action=graph-data&index=:index?').post(core.getGraphData);

  app.route('/action=get-events').post(core.getEvents);
  app.route('/action=get-detail&id=:id?').post(core.getDetail);
  app.route('/action=get-operational-events').post(core.getNearRealTimeEvents);
  app.route('/action=get-operational-detail&id=:id?').post(core.getNearRealTimeDetail);
  app.route('/action=filter-events&yearRange=:yearRange&monthRange=:monthRange&start_vol=:start_vol&end_vol=:end_vol&start_duration=:start_duration&end_duration=:end_duration&min_intensity=:min_intensity&max_intensity=:max_intensity&filter_area=:filter_area').post(core.filterEvents);
  app.route('/action=filter-operational-events&start_vol=:start_vol&end_vol=:end_vol&start_duration=:start_duration&end_duration=:end_duration&min_intensity=:min_intensity&max_intensity=:max_intensity&filter_area=:filter_area').post(core.filterOperationalEvents);
  app.route('/action=get-realtime-events').post(core.getRealTimeEvents);
  app.route('/action=get-realtime-detail&id=:id?').post(core.getRealTimeDetail);
  app.route('/action=filter-realtime-events&start_vol=:start_vol&end_vol=:end_vol&start_duration=:start_duration&end_duration=:end_duration&min_intensity=:min_intensity&max_intensity=:max_intensity&filter_area=:filter_area').post(core.filterRealTimeEvents);
  app.route('/action=get-number-events').post(core.getNumberofStorms);
  app.route('/action=get-intersect-area&id=:id?').post(core.intersectArea);
  app.route('/action=get-realtime-intersect-area&id=:id?').post(core.realtimeintersectArea);
};
