(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('operational-map', {
				url: '/operational-map',
				templateUrl: 'modules/operational-map/client/views/operational-map.client.view.html'
			});
	}
})();
