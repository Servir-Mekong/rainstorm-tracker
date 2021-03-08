
'use strict';
	angular.module('core').controller('settingsCtrl', function ($scope, $http) {
	var partnersHeader= [
		{
			'alt': 'The United States Agency for International Development',
			'url': 'https://www.usaid.gov/',
			'src': 'https://servir.adpc.net/themes/svmk/images/optimized/USAID_Logo_Color.png',
			'className': 'usaid'
		},
		{
			'alt': 'The National Aeronautics and Space Administration',
			'url': 'https://www.nasa.gov/',
			'src': 'https://servir.adpc.net/themes/svmk/images/optimized/NASA_Logo_Color.png',
			'className': 'nasa'
		},
		{
			'alt': 'Asian Disaster Preparedness Center',
			'url': 'http://www.adpc.net/',
			'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-adbc.png',
			'className': 'adpc'
		},
		{
			'alt': 'SERVIR',
			'url': 'https://www.servirglobal.net/',
			'src': 'https://servir.adpc.net/themes/svmk/images/optimized/Servir_Logo_Color.png',
			'className': 'servir'
		}
	];

	$scope.partnersHeader = partnersHeader;
});
