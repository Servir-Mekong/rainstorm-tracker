(function () {

	'use strict';



	angular.module('core').constant('settings', {
		downloadServerURL: 'ftp://ftpuser:_ftpuser_@203.170.246.170/',
		menus: [
			{
				'name': 'MAP',
				'url': '/map',
				'show': true
			},
			{
				'name': 'HOW_TO_USE',
				'url': 'https://goo.gl/rxeaKN',
				'show': false,
				'target': '_blank'
			},
			{
				'name': 'DOCUMENT',
				'url': 'http://bit.ly/RDCYIS-Technical-Docs',
				'show': true,
				'target': '_blank'
			},
			{
				'name': 'FEEDBACK',
				'url': 'https://goo.gl/forms/P2Lc5yBOOshT5uem1',
				'show': true,
				'target': '_blank'
			}
		],
		footerLinks: [
			{
				'name': 'ABOUT',
				'url': 'https://servir.adpc.net/about/about-servir-mekong',
				'show': true
			},
			{
				'name': 'TOOLS',
				'url': 'https://servir.adpc.net/tools',
				'show': true
			},
			{
				'name': 'GEOSPATIAL_DATASETS',
				'url': 'https://servir.adpc.net/geospatial-datasets',
				'show': true
			},
			{
				'name': 'RESOURCES_PUB',
				'url': 'https://servir.adpc.net/publications',
				'show': true
			},
			{
				'name': 'NEWS',
				'url': 'https://servir.adpc.net/news',
				'show': true
			},
			{
				'name': 'EVENTS',
				'url': 'https://servir.adpc.net/events',
				'show': true
			},
			{
				'name': 'CONTACT_US',
				'url': 'https://servir.adpc.net/about/contact-servir-mekong',
				'show': true
			},
			{
				'name': 'PRIVACY_USAGE_POLICY',
				'url': 'https://servir.adpc.net/policy',
				'show': true
			}
		],
		partnersHeader: [
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
		],
		partnersFooter: [
			{
				'alt': 'Spatial Infomatics Group',
				'url': 'https://sig-gis.com/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sig.png',
				'className': 'partner-sig'
			},
			{
				'alt': 'Stockholm Environment Institute',
				'url': 'https://www.sei-international.org/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sei-2.png',
				'className': 'partner-sei'
			},
			{
				'alt': 'Deltares',
				'url': 'https://www.deltares.nl/en/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-deltares.png',
				'className': 'partner-deltares'
			}
		]

	});
})();
