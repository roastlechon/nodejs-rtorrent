module.exports = angular.module("nodejs-rtorrent.directives", ["nodejs-rtorrent.services"]).value("version", "0.1");

require("./directives/ActionBarDirective");
require("./directives/AppVersionDirective");
require("./directives/MultiClickDirective");
require("./directives/ResizeDirective");