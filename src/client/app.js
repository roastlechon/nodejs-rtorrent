'use strict';

require('jquery');
require('angular');
require('angular-bootstrap');
require('angular-ui-router');
require('ui-router-extras');
require('floatThead');
require('underscore');
require('restangular');
require('angular-floatThead');

require('./templates');

var log = require('./log/log');
var session = require('./session/session');
var authentication = require('./authentication/authentication');
var top = require('./top/top');
var modal = require('./modal/modal');
var notification = require('./notification/notification');
var settings = require('./settings/settings');
var login = require('./login/login');
var socket = require('./socket/socket');
var torrents = require('./torrents/torrents');
var feeds = require('./feeds/feeds');

angular.module('app', [
	'ui.bootstrap',
	'ui.router',
	'ct.ui.router.extras',
	'floatThead',
	'restangular',
	'templates',
	log.name,
	top.name,
	modal.name,
	notification.name,
	login.name,
	session.name,
	authentication.name,
	socket.name,
	torrents.name,
	feeds.name,
	settings.name
]).config(['$urlRouterProvider', '$stateProvider', '$stickyStateProvider', appConfig]);

function appConfig ($urlRouterProvider, $stateProvider, $stickyStateProvider) {

	$stickyStateProvider.enableDebug(true);

	$urlRouterProvider.otherwise('/');
}

require('./filters/bytes-filter');
require('./filters/datatransferrate-filter');
require('./filters/percentage-filter');
require('./filters/time-filter');
require('./directives/resize-directive');
require('./directives/torrent-url-validator-directive');
require('./directives/app-version-directive');