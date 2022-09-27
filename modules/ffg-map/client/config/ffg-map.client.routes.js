(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('ffg-map', {
				url: '/',
				templateUrl: 'modules/ffg-map/client/views/ffg-map.client.view.html'
			});
	}
})();
