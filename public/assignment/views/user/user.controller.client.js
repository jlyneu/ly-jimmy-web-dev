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

        vm.error = "";

        // use the UserService to determine whether the given user exists
        // based on the provided username and password. If the user exists,
        // then navigate to their profile page. Otherwise, display an error message.
        function login(user) {
            // temporarily remove error messages
            vm.error = "";

            if (!user.username) {
                vm.error = "Username is required";
            }
            else if (!user.password) {
                vm.error = "Password is required";
            }
            else {
                user = UserService.findUserByCredentials(user.username, user.password);
                if (user) {
                    $location.url("/user/" + user._id);
                } else {
                    vm.error = "Unable to login";
                }
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

        vm.error = "";

        // use the UserService to create the given user. If the user
        // is successfully registered, then navigate to their profile
        // page. Otherwise, display an error message.
        function register(user) {
            // temporarily remove any error messages
            vm.error = "";

            // first check for validation errors
            if (!user.username) {
                vm.error = "Username is required";
            }
            else if (!user.password) {
                vm.error = "Password is required";
            }
            // make sure passwords match
            else if (user.password !== user.verifyPassword) {
                vm.error = "Passwords do not match";
            }
            // check to see that the username isn't already taken
            else if (UserService.findUserByUsername(user.username)) {
                vm.error = user.username + " is already taken"
            }
            // try creating user with the UserService. If registration
            // is successful and a user is returned, then navigate to the
            // profile page
            else {
                var newUser = UserService.createUser(user);
                if (newUser) {
                    $location.url("/user/" + newUser._id);
                } else {
                    vm.error = "Unable to register user. Please try again later";
                }
            }
        }
    }

    // controller for the profile.view.client.html template
    function ProfileController($routeParams, UserService) {
        var vm = this;

        // event handler declarations
        vm.update = update;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];

        vm.success = "";
        vm.error = "";
        
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
            // temporarily remove success and error messages
            vm.success = "";
            vm.error = "";
            // check for valid email based on Angular's default email validation
            if ($('input[type="email"]').hasClass('ng-invalid-email')) {
                vm.error = "Please provide a valid email address";
                return;
            }
            var updatedUser = UserService.updateUser(vm.userId, user);
            if (updatedUser) {
                vm.success = "Profile successfully updated";
            } else {
                vm.error = "Unable to update profile. Please try again later"
            }
        }
    }
})();