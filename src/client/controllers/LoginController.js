var controllersModule = require("../controllers");
controllersModule.controller("LoginController", ["$log", "AuthenticationFactory", "SocketFactory", "$previousState",
    function($log, AuthenticationFactory, SocketFactory, $previousState) {
        
        var logger = $log.getInstance("LoginController");

        logger.debug("LoginController loaded");

        var vm = this;

        vm.close = function() {
            $previousState.go("modalInvoker"); // return to previous state
        };

        vm.user = AuthenticationFactory.currentUser();

        vm.login = function() {
            AuthenticationFactory.login({
                email: vm.email,
                password: vm.password
            }).then(function(data) {
                logger.info(data);
                SocketFactory.reconnect();
                $previousState.go("modalInvoker");
            }, function(err) {
                logger.error(err);
            });
        }
    }
]);