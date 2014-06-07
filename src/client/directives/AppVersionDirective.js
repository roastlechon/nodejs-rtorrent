var directivesModule = require("../directives");
directivesModule.directive("appVersion", ["version",
	function(version) {
		return function(scope, element, attributes) {
			element.text(version);
		};
	}
]);