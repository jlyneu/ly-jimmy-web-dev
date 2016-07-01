(function() {
    angular
        .module("PetShelter")
        .controller("ShelterEditController", ShelterEditController);

    // controller for the shelter-edit.view.client.html template
    function ShelterEditController($rootScope, $location, $routeParams, ShelterService, PetShelterConstants) {
        var vm = this;

        // event handlers
        vm.updateShelter = updateShelter;
        vm.deleteShelter = deleteShelter;

        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;
        // get shelter id from URL
        vm.shelterId = $routeParams["shelterId"];
        // get list of state abbreviations from constants for state dropdown
        vm.states = PetShelterConstants.getStates();
        // regex to validate zip codes
        vm.zipRegex = '^\\d{5}$';

        // initialize edit shelter page by getting shelter info from server and populating input fields
        function init() {
            ShelterService
                .findShelterById(vm.shelterId)
                .then(findShelterByIdSuccess, findShelterByIdError);

            // a 200 came back. if the shelter object returned isn't empty, set shelter info.
            // otherwise, an error occurred so display an error
            function findShelterByIdSuccess(response) {
                var existingShelter = response.data;
                if (!$.isEmptyObject(existingShelter)) {
                    vm.shelter = existingShelter;
                } else {
                    vm.error = "Could not get shelter info at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function findShelterByIdError(error) {
                vm.error = "Could not get shelter info at this time. Please try again later.";
            }
        }
        init();

        // send the shelter object to the server to update. if the update is successful, navigate
        // back to the shelter detail page. otherwise display an error.
        function updateShelter(shelter) {

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

            ShelterService
                .updateShelter(vm.shelterId, shelter)
                .then(updateShelterSuccess, updateShelterError);

            // a 200 came back. navigate to the shelter detail page if a response was returned. otherwise
            // display an error
            function updateShelterSuccess(response) {
                if (!$.isEmptyObject(response)) {
                    $location.url("/shelter/" + vm.shelterId);
                }
            }

            // an error occurred so display an error
            function updateShelterError(error) {
                vm.error = "Could not update shelter at this time. Please try again later.";
                scrollToError();
            }
        }

        // delete this shelter from the database. if successful, navigate to the my shelters page.
        // otherwise display an error
        function deleteShelter() {
            ShelterService
                .deleteShelter(vm.shelterId)
                .then(deleteShelterSuccess, deleteShelterError);

            function deleteShelterSuccess(response) {
                if (response) {
                    $location.url("/profile/shelter");
                } else {
                    vm.error = "Could not delete shelter at this time. Please try again later.";
                    scrollToError();
                }
            }

            function deleteShelterError(error) {
                vm.error = "Could not delete shelter at this time. Please try again later.";
                scrollToError();
            }
        }

        // scroll to the top of the page so that the user can more easily see the validation/registration error
        function scrollToError() {
            $('html, body').animate({
                scrollTop: $('ps-header').offset().top + 'px'
            }, 'slow');
        }
    }
})();