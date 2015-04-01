'use strict';

function fileValidator () {
	return {
		restrict: 'A',
		require:'ngModel',
		link: function ($scope, elem, attrs, ngModel) {
			ngModel.$validators.file = function (modelValue, viewValue) {
				var value = modelValue || viewValue;
				return !!value;
			}
		}
	}
}

module.exports = angular
	.module('app')
	.directive('fileValidator', [fileValidator]);