// Filename: main.js
require.config({
	paths: {
		"jquery": "libs/jquery/jquery",
		"underscore": "libs/underscore/underscore-min",
		"backbone": "libs/backbone/backbone",
		"backbone-relational": "libs/backbone/backbone-relational",
		"bootstrap": "//netdna.bootstrapcdn.com/bootstrap/3.0.0-rc1/js/bootstrap.min",
		"socket.io": "libs/socket.io/socket.io",
		"tmpl": "libs/template/tmpl",
		"mustache": "libs/template/mustache",
		"jquery.fileupload": "libs/jquery/jquery.fileupload",
		"jquery.iframe-transport": "libs/jquery/jquery.iframe-transport",
		"jquery.ui.widget": "libs/jquery/jquery.ui.widget"
	},
	shim: {
		"backbone": {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		"backbone-relational": {
			deps: ["backbone"]
		},
		"underscore": {
			exports: "_"
		},
		"ich": {
			deps: ["jquery"],
			exports: "ich"
		},
		"socket.io": {
			exports: "io"
		},
		"bootstrap": {
			deps: ["jquery"]
		}
	}
});

require([
	"app"
], function(App) {
	App.initialize();
})