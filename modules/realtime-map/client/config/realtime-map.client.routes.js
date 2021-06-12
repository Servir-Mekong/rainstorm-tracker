(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('realtime-map', {
				url: '/realtime-map',
				templateUrl: 'modules/realtime-map/client/views/realtime-map.client.view.html'
			});
	}
})();
