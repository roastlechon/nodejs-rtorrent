require('jquery');
require('angular');
require('angular-ui-bootstrap');
require('angular-ui-router');
require('ui-router-extras');
require('ng-context-menu');
require('underscore');
require('restangular');
var moment = require('moment');

require('./templates');

var modal = require('./modal/modal');
var notification = require('./notification/notification');
var session = require('./session/session');
var authentication = require('./authentication/authentication');
var home = require('./home/home');
var login = require('./login/login');
var socket = require('./socket/socket');
var torrents = require('./torrents/torrents');
var torrentsAdd = require('./torrents.add/torrents.add');
var feeds = require('./feeds/feeds');
var feed = require('./feed/feed');
var feedsAdd = require('./feeds.add/feeds.add');
var feedsEdit = require('./feeds.edit/feeds.edit');
var feedsDelete = require('./feeds.delete/feeds.delete');

angular.module('app', [
	'ui.bootstrap',
	'ui.router',
	'ct.ui.router.extras',
	'restangular',
	'ng-context-menu',
	'templates',
	modal.name,
	notification.name,
	home.name,
	login.name,
	session.name,
	authentication.name,
	socket.name,
	torrents.name,
	torrentsAdd.name,
	feeds.name,
	feed.name,
	feedsAdd.name,
	feedsEdit.name,
	feedsDelete.name
]).config(function($urlRouterProvider, $stickyStateProvider) {
	$stickyStateProvider.enableDebug(true);
	$urlRouterProvider.otherwise('/');
});

require('./filters/bytes-filter');
require('./filters/datatransferrate-filter');
require('./filters/percentage-filter');
require('./filters/time-filter');
require('./directives/resize-directive');