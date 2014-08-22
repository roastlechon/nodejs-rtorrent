module.exports = angular.module("nodejs-rtorrent.controllers", ["nodejs-rtorrent.services"]);

require("./controllers/FeedController");
require("./controllers/FeedsController");
require("./controllers/IndexController");
require("./controllers/LoginController");
require("./controllers/LogoutController");
require("./controllers/NavigationController");
require("./controllers/NotificationsController");
require("./controllers/SearchController");
require("./controllers/SettingsController");
require("./controllers/TorrentsController");
require("./controllers/AddTorrentController");