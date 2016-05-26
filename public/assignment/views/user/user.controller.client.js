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

        // event handler declarations
        vm.update = update;

        // event handler functions
        function update(user) {
            UserService.updateUser(vm.userId, user);
        }

        // initialization to populate form fields
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned user
        // so that modifying form elements won't automatically update the object in the
        // list in the UserService. This won't be necessary once the client is talking to the Node server
        function init() {
            vm.user = JSON.parse(JSON.stringify(UserService.findUserById(vm.userId)));
        }
        init();
    }
})();