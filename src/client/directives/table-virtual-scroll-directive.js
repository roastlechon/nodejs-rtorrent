function tableVirtualScroll ($interval) {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {
			console.log('tableVirtualScroll');



			var rowHeight = 46;
			var headerHeight = 31;

			// height of the non viewable items
			// calculated by height of a row * (count - per_page)

			var thresholdRow = 1;

			var parent = elem.parent();
			var parentHeight = parent.height() - headerHeight;

			function findVisibleElements(index) {
				var found = false;
				var visibleItems = [];

				while (!found) {
					var topPosition = elem.find('tr[data-index="0"]').position().top;
					topPosition =- headerHeight;

					if (visibleItems.indexOf(index) > 0) {
						found = true;
						break;
					}

					// element is not on the screen
					// 0 could be a lesser number, depending
					// on the buffer amount desired
					if (topPosition < 0) {
						index++;
					}

					if (topPosition > parentHeight) {
						index--;
					}

					visibleItems.push(index);
					index++;
				}

				console.log(visibleItems);
			}

			setTimeout(function () {
				findVisibleElements(0);
			}, 1000);

		},
		scope: {}
	};
}

angular
	.module('app')
	.directive('tableVirtualScroll', ['$interval', tableVirtualScroll]);
