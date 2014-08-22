module.exports = angular.module("nodejs-rtorrent.services", []);

require("./services/AuthenticationFactory");
require("./services/AuthenticationInterceptor");
require("./services/FeedFactory");
require("./services/MultiClickService");
require("./services/SocketFactory");
require("./services/TorrentFactory");
require("./services/SessionService");