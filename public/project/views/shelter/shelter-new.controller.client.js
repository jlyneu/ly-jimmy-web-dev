(function() {
    angular
        .module("PetShelter")
        .controller("ShelterNewController", ShelterNewController);

    // controller for the shelter-new.view.client.html template
    function ShelterNewController($rootScope, $location, ShelterService, PetShelterConstants) {
        var vm = this;

        // event handlers
        vm.createShelter = createShelter;

        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;
        // get list of state abbreviations from constants for state dropdown
        vm.states = PetShelterConstants.getStates();
        // regex to validate zip codes
        vm.zipRegex = '^\\d{5}$';

        // pass the new shelter object to the server to create an entry in the database
        function createShelter(shelter) {

            // validate the form before sending to server
            if (!shelter) {
                vm.error = "A name is required.";
                scrollToError();
                return;
            }
            
            // check for valid zip code based on regex
            if ($('input[type="text"]').hasClass('ng-invalid-pattern')) {
                vm.error = "Please provide a valid five digit zip code";
                scrollToError();
                return;
            }

            // check for valid email based on Angular's default email validation
            if ($('input[type="email"]').hasClass('ng-invalid-email')) {
                vm.error = "Please provide a valid email address";
                scrollToError();
                return;
            }

            // make sure required fields are provided
            var requiredFields = ["name",{field: "address1", display: "address"},"city","state","zip","country","email"];
            for (var i = 0; i < requiredFields.length; i++) {
                if (typeof(requiredFields[i]) === "string" && !shelter[requiredFields[i]]) {
                    vm.error = "{} is required.".replace("{}", requiredFields[i]);
                    scrollToError();
                    return;
                } else if (typeof(requiredFields[i]) !== "string" && !shelter[requiredFields[i].field]) {
                    vm.error = "{} is required.".replace("{}", requiredFields[i].display);
                    scrollToError();
                    return;
                }
            }

            shelter.source = "PETSHELTER";
            ShelterService
                .createShelter(vm.user._id, shelter)
                .then(createShelterSuccess, createShelterError);

            // a 200 came back. if the shelter object isn't empty, then route the user to the shelter detail page.
            // otherwise an error occurred so
            function createShelterSuccess(response) {
                var newShelter = response.data;
                if (!$.isEmptyObject(newShelter)) {
                    $location.url("/shelter/" + newShelter._id);
                } else {
                    vm.error = "Could not create shelter at this time. Please try again later.";
                    scrollToError()
                }
            }

            // an error occurred so display an error
            function createShelterError(error) {
                vm.error = "Could not create shelter at this time. Please try again later.";
                scrollToError()
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