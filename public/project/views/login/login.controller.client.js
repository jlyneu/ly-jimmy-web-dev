(function() {
    angular
        .module("PetShelter")
        .controller("LoginController", LoginController);

    // controller for the login.view.client.html template
    function LoginController($rootScope, $location, UserService) {
        var vm = this;

        // event handler declarations
        vm.login = login;

        vm.currentUser = $rootScope.currentUser;
        // initialize model.user object
        vm.user = {};

        vm.error = "";

        // use the UserService to determine whether the given user exists
        // based on the provided username and password. If the user exists,
        // then navigate to their profile page. Otherwise, display an error message.
        function login(user) {
            console.log(user);
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
                    .login(user)
                    .then(loginSuccess, loginError);
            }

            // a 200 was returned from the server, so login should be successful.
            // the user should be returned from the server. if so, then route to the profile page.
            // otherwise, something went wrong so display an error.
            function loginSuccess(response) {
                var existingUser = response.data;
                if (!$.isEmptyObject(existingUser)) {
                    $rootScope.currentUser = existingUser;
                    $location.url("/profile");
                } else {
                    vm.error = "Unable to login. Please try again later.";
                }
            }

            // display the error message from the server if provided
            function loginError(error) {
                if (error && error.data && error.data == "Unauthorized") {
                    vm.error = "The username and password combination is invalid.";
                } else if (error.data && error.data.message) {
                    vm.error = error.data.message;
                } else {
                    vm.error = "Unable to login. Please try again later.";
                }
            }
        }
    }
})();