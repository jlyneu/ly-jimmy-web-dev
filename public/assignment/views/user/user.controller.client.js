(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    // controller for the login.view.client.html template
    function LoginController($location, UserService) {
        var vm = this;

        // event handler declarations
        vm.login = login;

        // initialize model.user object
        vm.user = {};

        // use the UserService to determine whether the given user exists
        // based on the provided username and password. If the user exists,
        // then navigate to their profile page. Otherwise, display an error message.
        function login(user) {
            user = UserService.findUserByCredentials(user.username, user.password);
            if (user) {
                $location.url("/user/" + user._id);
            } else {
                vm.alert = "unable to login";
            }
        }

    }

    // controller for the register.view.client.html
    function RegisterController($location, UserService) {
        var vm = this;

        // event handler declarations
        vm.register = register;

        // initialize model.user object
        vm.user = {};

        // use the UserService to create the given user. If the user
        // is successfully registered, then navigate to their profile
        // page. Otherwise, display an error message.
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
    }

    // controller for the profile.view.client.html template
    function ProfileController($routeParams, UserService) {
        var vm = this;

        // event handler declarations
        vm.update = update;

        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];
        
        // initialize the page by fetching the current user
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned user
        // so that modifying form elements won't automatically update the object in the
        // list in the UserService. This won't be necessary once the client is talking to the Node server
        function init() {
            vm.user = JSON.parse(JSON.stringify(UserService.findUserById(vm.userId)));
        }
        init();

        // pass the given user to the UserService to update the user.
        // If the user is successfully updated, then display a success message.
        // Otherwise, display an error message.
        function update(user) {
            UserService.updateUser(vm.userId, user);
        }
    }
})();