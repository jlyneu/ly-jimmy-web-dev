(function() {
    angular
        .module("PetShelter")
        .controller("PetNewController", PetNewController);

    // controller for the pet-new.view.client.html template
    function PetNewController($rootScope, $location, $routeParams, ShelterService, PetService, PetShelterConstants) {
        var vm = this;

        // event handlers
        vm.createPet = createPet;

        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;
        // get shelter id from URL
        vm.shelterId = $routeParams["shelterId"];
        // get options for field dropdowns
        vm.animals = PetShelterConstants.getAnimals();
        vm.breeds = PetShelterConstants.getBreeds();
        vm.sizes = PetShelterConstants.getSizes();
        vm.sexes = PetShelterConstants.getSexes();
        vm.ages = PetShelterConstants.getAges();
        // regex for validating phone, fax, and zip codes
        vm.phoneRegex = "^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$";
        vm.zipRegex = vm.zipRegex = '^\\d{5}$';

        // initialize the new pet page by fetching the shelter info for this pet and populating the
        // contact info fields with the shelter info by default
        function init() {
            ShelterService
                .findShelterById(vm.shelterId)
                .then(findShelterByIdSuccess, findShelterByIdError);

            // a 200 came back. if the shelter object isn't empty, then populate the contact fields
            // with shelter info. otherwise, an error occurred
            function findShelterByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    var shelter = response.data;
                    vm.pet = {};
                    vm.pet.contact = {};
                    vm.pet.contact.name = vm.user.firstName + " " + vm.user.lastName;
                    vm.pet.contact.address1 = shelter.address1;
                    vm.pet.contact.address2 = shelter.address2;
                    vm.pet.contact.city = shelter.city;
                    vm.pet.contact.state = shelter.state;
                    vm.pet.contact.zip = shelter.zip;
                    vm.pet.contact.phone = shelter.phone;
                    vm.pet.contact.fax = shelter.fax;
                    vm.pet.contact.email = shelter.email;
                }
            }

            // an error occurred. since this is a convenience feature, do nothing.
            function findShelterByIdError(error) {}
        }
        init();

        // send the new pet object to the server to create an entry in the database. if the creation is successful,
        // then the new pet object will be returned. otherwise, an error occurred so display an error
        function createPet(pet) {

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
            if (!pet.animal || !pet.animal.value) {
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
            if (pet.animal && pet.animal.value) {
                pet.animal = pet.animal.value;
            }
            if (pet.size && pet.size.value) {
                pet.size = pet.size.value;
            }
            if (pet.sex && pet.sex.value) {
                pet.sex = pet.sex.value;
            }
            PetService
                .createPet(vm.shelterId, pet)
                .then(createPetSuccess, createPetError);

            // a 200 came back. if the pet object returned is not empty, then navigate to the pet detail
            // page. otherwise, an error occurred to display an error
            function createPetSuccess(response) {
                var newPet = response.data;
                if (!$.isEmptyObject(newPet)) {
                    $location.url("/shelter/" + vm.shelterId + "/pet/" + newPet._id);
                } else {
                    vm.error = "Could not create pet at this time. Please try again later.";
                    scrollToError();
                }
            }

            // an error occurred so display an error
            function createPetError(error) {
                vm.error = "Could not create pet at this time. Please try again later.";
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