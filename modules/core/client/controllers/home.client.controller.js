
'use strict';
	angular.module('core').controller('settingsCtrl', function ($scope, $http) {
	var partnersHeader= [
		{
			'alt': 'The United States Agency for International Development',
			'url': 'https://www.usaid.gov/',
			'src': '/img/partners/usaid.png',
			'className': 'usaid'
		},
		{
			'alt': 'The National Aeronautics and Space Administration',
			'url': 'https://www.nasa.gov/',
			'src': '/img/partners/nasa.png',
			'className': 'nasa'
		},
		{
			'alt': 'Asian Disaster Preparedness Center',
			'url': 'http://www.adpc.net/',
			'src': '/img/partners/adpc.png',
			'className': 'adpc'
		},
		{
			'alt': 'SERVIR',
			'url': 'https://servir.adpc.net/',
			'src': '/img/partners/servir.png',
			'className': 'servir'
		}
	];

	$scope.partnersHeader = partnersHeader;
});
