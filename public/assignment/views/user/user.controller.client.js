(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;

        // event handler declarations
        vm.login = login;

        // event handler functions
        function login(user) {
            user = UserService.findUserByCredentials(user.username, user.password);
            if (user) {
                $location.url("/user/" + user._id);
            } else {
                vm.alert = "unable to login";
            }
        }

        // initialize model.user object
        vm.user = {};
    }

    function RegisterController($location, UserService) {
        var vm = this;

        // event handler declarations
        vm.register = register;

        // event handler functions
        function register(user) {
            if (user.username != null &&
                user.password != null &&
                user.password == user.verifyPassword) {
                UserService.createUser(user);
                $location.url("/user/" + user._id);
            } else {
                vm.alert = "unable to register user";
            }
        }

        // initialize model.user object
        vm.user = {};
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        function init() {
            vm.user = UserService.findUserById(vm.userId);
        }
        init();
    }
})();