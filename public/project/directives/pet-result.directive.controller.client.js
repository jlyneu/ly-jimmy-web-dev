(function() {
    angular
        .module("PetShelter")
        .controller("PetResultController", PetResultController);

    // controller for the pet-result.directive.view.client.html template
    function PetResultController($location, ShelterService, PetService) {
        var vm = this;

        // event handlers
        vm.visitPet = visitPet;

        // when the user clicks on the pet result, try to navigate to the pet's detail page.
        // if the pet is from petfinder instead of petshelter, then create an entry in the
        // database if necessary.
        function visitPet() {
            var petfinderShelter;

            // if the pet is from petshelter, simply navigate to the details page.
            if (vm.pet.source == "PETSHELTER") {
                $location.url("/shelter/" + vm.pet._shelter + "/pet/" + vm.pet._id);
            } else {
                // check if the petfinder shelter exists in the db. if so, return the _id.
                // otherwise, create an entry in the db and return the new _id.
                // then check if the petfinder pet exists in teh db. if so, return the _id.
                // otherwise, create an entry in the db and return the new _id.
                ShelterService
                    .findShelterByPetfinderId(vm.pet.shelterId)
                    .then(findShelterByPetfinderIdSuccess, findShelterByPetfinderIdError);
            }

            // if shelter comes back, next search for pet.
            // if not, then look up the shelter with petfinder API
            function findShelterByPetfinderIdSuccess(response) {
                var existingShelter = response.data;
                if (!$.isEmptyObject(existingShelter)) {
                    petfinderShelter = existingShelter;
                    PetService
                        .findPetByPetfinderId(vm.pet.id)
                        .then(findPetByPetfinderIdSuccess, findPetByPetfinderIdError);
                } else {
                    ShelterService
                        .findPetfinderShelterById(vm.pet.shelterId)
                        .then(findPetfinderShelterByIdSuccess, findPetfinderShelterByIdError);
                }
            }

            // an error occurred so display an error
            function findShelterByPetfinderIdError(error) {
                vm.error = "Could not get shelter info at this time. Please try again later."
            }

            // if pet comes back, navigate user to pet detail page.
            // if not, then create petfinder entry in db
            function findPetByPetfinderIdSuccess(response) {
                var existingPet = response.data;
                if (!$.isEmptyObject(existingPet)) {
                    $location.url("/shelter/" + existingPet._shelter + "/pet/" + existingPet._id);
                } else {
                    var newPet = {
                        animal: vm.pet.animal,
                        name: vm.pet.name,
                        breeds: vm.pet.breeds,
                        photoUrl: vm.pet.photoUrl,
                        _shelter: petfinderShelter._id,
                        source: "PETFINDER",
                        petfinderId: vm.pet.id
                    };
                    PetService
                        .createPet(petfinderShelter._id, newPet)
                        .then(createPetSuccess, createPetError);
                }
            }

            // an error occurred so display an error
            function findPetByPetfinderIdError(error) {
                vm.error = "Could not find pet info at this time. Please try again later.";
            }

            // if shelter comes back, create entry in db.
            // otherwise, an error occurred
            function findPetfinderShelterByIdSuccess(response) {
                var shelterResult = response.data;
                if (!$.isEmptyObject(shelterResult)) {
                    var newShelter = {
                        name: shelterResult.name,
                        zip: shelterResult.zip,
                        source: "PETFINDER",
                        petfinderId: vm.pet.shelterId
                    };
                    ShelterService
                        .createShelter(null, newShelter)
                        .then(createShelterSuccess, createShelterError);
                } else {
                    vm.error = "Could not get shelter info at this time. Please try again later."
                }
            }

            // an error occurred so display an error
            function findPetfinderShelterByIdError(error) {
                vm.error = "Could not get shelter info at this time. Please try again later."
            }

            // navigate user to pet detail page
            function createPetSuccess(response) {
                var newPet = response.data;
                if (!$.isEmptyObject(newPet)) {
                    $location.url("/shelter/" + petfinderShelter._id + "/pet/" + newPet._id);
                } else {

                }
            }

            // an error occurred so display an error
            function createPetError(response) {
                vm.error = "Could not find pet info at this time. Please try again later.";
            }

            // if shelter returned, then shelter was created successfully. now create entry for pet.
            // if not, then an error occurred.
            function createShelterSuccess(response) {
                var newShelter = response.data;
                if (!$.isEmptyObject(newShelter)) {
                    petfinderShelter = newShelter;
                    var newPet = {
                        animal: vm.pet.animal,
                        name: vm.pet.name,
                        breeds: vm.pet.breeds,
                        photoUrl: vm.pet.photoUrl,
                        _shelter: petfinderShelter._id,
                        source: "PETFINDER",
                        petfinderId: vm.pet.id
                    };
                    PetService
                        .createPet(newShelter._id, newPet)
                        .then(createPetSuccess, createPetError);
                } else {
                    vm.error = "Could not find pet info at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function createShelterError(error) {
                vm.error = "Could not find pet info at this time. Please try again later.";
            }
        }
    }
})();