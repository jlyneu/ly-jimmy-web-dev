(function() {
    angular
        .module("PetShelter")
        .controller("PetEditController", PetEditController);

    // controller for the pet-edit.view.client.html template
    function PetEditController($rootScope, $location, $routeParams, PetService, PetShelterConstants) {
        var vm = this;

        // event handlers
        vm.updatePet = updatePet;
        vm.deletePet = deletePet;

        // initialize pet edit page by fetching pet info from server and populating input fields
        function init() {
            // get current user from rootScope if present
            vm.user = $rootScope.currentUser;
            // get shelter and pet id from URL
            vm.shelterId = $routeParams["shelterId"];
            vm.petId = $routeParams["petId"];
            // get options for field dropdowns
            vm.animals = PetShelterConstants.getAnimals();
            vm.breeds = PetShelterConstants.getBreeds();
            vm.sizes = PetShelterConstants.getSizes();
            vm.sexes = PetShelterConstants.getSexes();
            vm.ages = PetShelterConstants.getAges();
            vm.states = PetShelterConstants.getStates();
            // regex for validating phone, fax, and zip codes
            vm.phoneRegex = "^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$";
            vm.zipRegex = vm.zipRegex = '^\\d{5}$';
            
            PetService
                .findPetById(vm.petId)
                .then(findPetByIdSuccess, findPetByIdError);

            // a 200 came back. if pet object isn't empty, then set pet info to populate input fields.
            // otherwise, an error occurred so display an error.
            function findPetByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    var existingPet = response.data;
                    vm.pet = existingPet;
                    if (vm.pet.breeds) {
                        vm.pet.breed = vm.pet.breeds[0];
                    }
                } else {
                    vm.error = "Could not get pet info at this time. Please try again later.";
                    scrollToError()
                }
            }

            // an error occurred so display an error
            function findPetByIdError(error) {
                vm.error = "Could not get pet info at this time. Please try again later.";
                scrollToError()
            }
        }
        init();

        // send the pet object to the server to update. if successful, send the user to the pet detail page.
        // otherwise, display an error.
        function updatePet(pet) {

            // validate the form before sending to server
            if (!pet) {
                vm.error = "An animal type is required.";
                scrollToError();
                return;
            }

            // check for valid phone based on regex
            if ($('#contact-phone').hasClass('ng-invalid-pattern')) {
                vm.error = "Please provide a valid phone number";
                scrollToError();
                return;
            }

            // check for valid fax based on regex
            if ($('#contact-phone').hasClass('ng-invalid-pattern')) {
                vm.error = "Please provide a valid fax number";
                scrollToError();
                return;
            }

            // check for valid zip code based on regex
            if ($('#contact-zip').hasClass('ng-invalid-pattern')) {
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

            // check required fields
            if (!pet.animal) {
                vm.error = "An animal type is required.";
                scrollToError();
                return;
            }
            if (!pet.name) {
                vm.error = "A name is required.";
                scrollToError();
                return;
            }
            if (!pet.breed) {
                vm.error = "A breed is required.";
                scrollToError();
                return;
            }
            if (!pet.description) {
                vm.error = "A description is required.";
                scrollToError();
                return;
            }

            pet.source = "PETSHELTER";
            // convert values to work with request
            if (pet.breed) {
                pet.breeds = [pet.breed];
                delete pet.breed;
            }

            PetService
                .updatePet(vm.petId, pet)
                .then(updatePetSuccess, updatePetError);

            // if the response is not empty, send the user to the pet detail page.
            // otherwise an error occurred so display an error
            function updatePetSuccess(response) {
                if (!$.isEmptyObject(response)) {
                    $location.url("/shelter/" + vm.shelterId + "/pet/" + vm.petId);
                } else {
                    vm.error = "Could not update pet at this time. Please try again later.";
                    scrollToError()
                }
            }

            // an error occurred so display an error
            function updatePetError(error) {
                vm.error = "Could not update pet at this time. Please try again later.";
                scrollToError()
            }
        }

        // delete this pet from the database. if successful, navigate to the my shelter page.
        // otherwise display an error
        function deletePet() {
            PetService
                .deletePet(vm.petId)
                .then(deletePetSuccess, deletePetError);

            function deletePetSuccess(response) {
                if (response) {
                    $location.url("/shelter/" + vm.shelterId);
                } else {
                    vm.error = "Could not delete pet at this time. Please try again later.";
                    scrollToError();
                }
            }

            function deletePetError(error) {
                vm.error = "Could not delete pet at this time. Please try again later.";
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