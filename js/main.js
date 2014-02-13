require.config({
	baseUrl: '/js/libs',
	paths : {
		app: '../app',
		jquery : 'jquery-1.10.2.min',
		'async' : 'async',
		'domReady' : 'domReady'
	}
});

/* Load Modules below */
require(['app/global'], function(){});
