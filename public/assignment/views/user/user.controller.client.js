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
                UserService
                    .findUserByCredentials(user.username, user.password)
                    .then(
                        function(response) {
                            var existingUser = response.data;
                            if (!$.isEmptyObject(existingUser)) {
                                $location.url("/user/" + existingUser._id);
                            } else {
                                vm.error = "The provided username and password combination is invalid";
                            }
                        },
                        function(error) {
                            vm.error = "Unable to login";
                        }
                    );
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
            } else {
                UserService
                    .findUserByUsername(user.username)
                    .then(
                        function (response) {
                            var existingUser = response.data;
                            if (!$.isEmptyObject(existingUser)) {
                                vm.error = user.username + " is already taken";
                            } else {
                                UserService
                                    .createUser(user)
                                    .then(
                                        function(response) {
                                            var newUser = response.data;
                                            if (!$.isEmptyObject(newUser)) {
                                                $location.url("/user/" + newUser._id);
                                            } else {
                                                vm.error = "Unable to register user. Please try again later";
                                            }
                                        },
                                        function(error) {
                                            vm.error = "Unable to register user. Please try again later";
                                        }
                                    );
                            }
                        },
                        function(error) {
                            vm.error = "Unable to register user. Please try again later";
                        }
                    );
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
            UserService
                .findUserById(vm.userId)
                .then(
                    function(response) {
                        var user = response.data;
                        if (!$.isEmptyObject(user)) {
                            vm.user = user;
                        } else {
                            vm.user = {};
                        }
                    },
                    function(error) {
                        vm.user = {};
                    }
                );
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
            UserService
                .updateUser(vm.userId, user)
                .then(
                    function(response) {
                        var user = response.data;
                        if (!$.isEmptyObject(user)) {
                            vm.success = "Profile successfully updated";
                        } else {
                            vm.error = "Unable to update profile. Please try again later";
                        }
                    },
                    function(error) {
                        vm.error = "Unable to update profile. Please try again later";
                    }
                );
        }
    }
})();