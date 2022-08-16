(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('bulletin', {
				url: '/bulletin',
				templateUrl: 'modules/bulletin/client/views/bulletin.client.view.html'
			});
	}
})();
