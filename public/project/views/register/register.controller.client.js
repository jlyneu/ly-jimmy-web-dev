(function() {
    angular
        .module("PetShelter")
        .controller("RegisterController", RegisterController);

    // controller for the register.view.client.html template
    function RegisterController($rootScope, $location, UserService) {
        var vm = this;

        // event handlers
        vm.register = register;

        // get current user from rootScope if present
        vm.currentUser = $rootScope.currentUser;
        // regex to validate phone numbers
        vm.phoneRegex = "^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$";

        // send the user object to the server to create an instance in the database.
        // if an error returned, then display an error. Otherwise navigate to the profile page.
        function register(user) {

            // validate the form before sending to server
            if (!user) {
                vm.error = "A username is required.";
                scrollToError();
                return;
            }

            // make sure required fields are provided
            var requiredFields = ["username", "password", "firstName", "lastName"];
            for (var i = 0; i < requiredFields.length; i++) {
                if (!user[requiredFields[i]]) {
                    vm.error = "A {} is required.".replace("{}", requiredFields[i]);
                    scrollToError();
                    return;
                }
            }
            // make sure the passwords match
            if (user.password !== user.verifyPassword) {
                vm.error = "Passwords do not match.";
                scrollToError();
                return;
            }

            // check for valid phone number based on regex
            if ($('input[type="text"]').hasClass('ng-invalid-pattern')) {
                vm.error = "Please provide a valid phone number";
                scrollToError();
                return;
            }

            // check for valid email based on Angular's default email validation
            if ($('input[type="email"]').hasClass('ng-invalid-email')) {
                vm.error = "Please provide a valid email address";
                scrollToError();
                return;
            }

            // send the user to the server to create a new entry in the database
            UserService
                .register(user)
                .then(registerSuccess, registerError);

            // a 200 came back. make sure the new user is returned. if so, return to the profile. otherwise,
            // and error occurred so display an error.
            function registerSuccess(response) {
                var newUser = response.data;
                if (!$.isEmptyObject(newUser)) {
                    $rootScope.currentUser = newUser;
                    $location.url("/profile");
                } else {
                    vm.error = "Could not create user at this time. Please try again later.";
                    scrollToError();
                }
            }

            // if an error occurred, either the username is already taken or there was a server error
            // so display an error ot the user.
            function registerError(error) {
                if (error && error.data && error.data.message) {
                    vm.error = error.data.message;
                } else {
                    vm.error = "Could not create user at this time. Please try again later.";
                }
                scrollToError();
            }

            function scrollToError() {
                $('html, body').animate({
                    scrollTop: $('ps-header').offset().top + 'px'
                }, 'slow');
            }
        }
    }
})();