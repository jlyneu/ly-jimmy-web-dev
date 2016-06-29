(function() {
    angular
        .module("PetShelter")
        .controller("PetResultController", PetResultController);

    // controller for the pet-result.directive.view.client.html template
    function PetResultController($location, ShelterService, PetService) {
        var vm = this;
        
        vm.visitPet = visitPet;

        function visitPet() {

            var petfinderShelter;

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

            function findShelterByPetfinderIdError(error) {

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

            function findPetByPetfinderIdError(error) {

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
                }
            }

            function findPetfinderShelterByIdError(error) {

            }

            // navigate user to pet detail page
            function createPetSuccess(response) {
                var newPet = response.data;
                if (!$.isEmptyObject(newPet)) {
                    $location.url("/shelter/" + petfinderShelter._id + "/pet/" + newPet._id);
                } else {

                }
            }

            function createPetError(response) {

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

                }
            }

            function createShelterError(error) {

            }
        }
    }
})();