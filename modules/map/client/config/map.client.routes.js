(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('map', {
				url: '/map',
				templateUrl: 'modules/map/client/views/map.client.view.html'
			});
	}
})();
