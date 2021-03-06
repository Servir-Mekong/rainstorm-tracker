(function () {
	'use strict';

	angular
		.module('home')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('index', {
				url: '/',
				templateUrl: 'modules/home/client/views/home.client.view.html'
			});
	}
})();
