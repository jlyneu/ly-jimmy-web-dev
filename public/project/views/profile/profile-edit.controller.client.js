(function() {
    angular
        .module("PetShelter")
        .controller("ProfileEditController", ProfileEditController);

    // controller for the profile-edit.view.client.html template
    function ProfileEditController($rootScope, $location, UserService) {
        var vm = this;

        // event handlers
        vm.update = update;

        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;
        // regex to validate phone numbers
        vm.phoneRegex = "^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$";

        // send the user object to the server to update the user in the database.
        // if an error returned, then display an error. Otherwise, navigate back to profile
        function update(user) {

            // validate the form before sending to server
            if (!user) {
                vm.error = "A username is required.";
                scrollToError();
                return;
            }

            // make sure required fields are provided
            var requiredFields = [
                {
                    fieldName: "firstName",
                    displayName: "first name"
                },{
                    fieldName: "lastName",
                    displayName: "last name"
                }];
            for (var i = 0; i < requiredFields.length; i++) {
                if (!user[requiredFields[i]["fieldName"]]) {
                    vm.error = "A {} is required.".replace("{}", requiredFields[i]["displayName"]);
                    scrollToError();
                    return;
                }
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

            UserService
                .updateUser(user._id, user)
                .then(updateUserSuccess, updateUserError);

            function updateUserSuccess(response) {
                if (!$.isEmptyObject(response)) {
                    // update cached current user
                    $rootScope.user = user;
                    $location.url("/profile");
                } else {
                    vm.error = "Could not update profile. Please try again later.";
                }
            }

            function updateUserError(error) {
                vm.error = "Could not update profile. Please try again later.";
            }

            // scroll to the top of the page so that the user can more easily see the validation/registration error
            function scrollToError() {
                $('html, body').animate({
                    scrollTop: $('ps-header').offset().top + 'px'
                }, 'slow');
            }
        }
    }
})();