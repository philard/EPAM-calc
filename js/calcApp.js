

requirejs.config({
	baseUrl: 'js/lib',
	paths: {
		app: '../app',
		jquery:'jquery',
		underscore:'underscore',
		backbone:'backbone',
		'localStorage':'backbone.localStorage'
	}
	
	
});

requirejs(["app/calc"]);
