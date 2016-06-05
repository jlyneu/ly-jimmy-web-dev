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

            // basic validation checks
            if (!user.username) {
                vm.error = "Username is required";
            }
            else if (!user.password) {
                vm.error = "Password is required";
            }
            else {
                // determine whether the username and password are valid
                UserService
                    .findUserByCredentials(user.username, user.password)
                    .then(loginSuccess, loginError);
            }
        }

        // a 200 was returned from the server, so login should be successful.
        // the user should be returned from the server. if so, then route to the profile page.
        // otherwise, something went wrong so display an error.
        function loginSuccess(response) {
            var existingUser = response.data;
            if (!$.isEmptyObject(existingUser)) {
                $location.url("/user/" + existingUser._id);
            } else {
                vm.error = "Unable to login. Please try again later.";
            }
        }

        // display the error message from the server if provided
        function loginError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to login. Please try again later.";
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
                // try to create the user. if a user already exists with the
                // provided username, then the server will throw an error.
                UserService
                    .createUser(user)
                    .then(createUserSuccess, createUserError);
            }
        }

        // a 200 was returned from the server, so registration should be successful.
        // the new user should be returned from the server. if so, then route to the profile page.
        // otherwise, something went wrong so display an error.
        function createUserSuccess(response) {
            var newUser = response.data;
            if (!$.isEmptyObject(newUser)) {
                $location.url("/user/" + newUser._id);
            } else {
                vm.error = "Unable to register user. Please try again later.";
            }
        }

        // display the error message from the server if provided
        function createUserError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to register user. Please try again later";
            }
        }
    }

    // controller for the profile.view.client.html template
    function ProfileController($location, $routeParams, UserService) {
        var vm = this;

        // event handler declarations
        vm.update = update;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];

        vm.success = "";
        vm.error = "";
        
        // initialize the page by fetching the current user
        function init() {
            UserService
                .findUserById(vm.userId)
                .then(findUserByIdSuccess, findUserByIdError);
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
                .then(updateUserSuccess, updateUserError);
        }

        // a 200 was returned from the server, so the user should have been found.
        // the existing user should be returned from the server. if so, then populate the input fields.
        // otherwise, something went wrong so display an error.
        function findUserByIdSuccess(response) {
            var user = response.data;
            if (!$.isEmptyObject(user)) {
                vm.user = user;
            } else {
                vm.error = "Unable to fetch profile information. Please try again later.";
            }
        }

        // if the server sends a 404, there is no user with given userId, so route to login page.
        // otherwise display error message from server if provided
        function findUserByIdError(error) {
            if (error.status === 404) {
                $location.url("/");
            } else if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to fetch profile information. Please try again later.";
            }
        }

        // a 200 was returned from the server, so update should be successful.
        // the updated user should be returned from the server. if so, then populate the display a success message.
        // otherwise, something went wrong so display an error.
        function updateUserSuccess(response) {
            var user = response.data;
            if (!$.isEmptyObject(user)) {
                vm.success = "Profile successfully updated.";
            } else {
                vm.error = "Unable to update profile. Please try again later.";
            }
        }

        // display error message from server if provided
        function updateUserError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to update profile. Please try again later.";
            }
        }
    }
})();