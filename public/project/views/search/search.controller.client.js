(function() {
    angular
        .module("PetShelter")
        .controller("SearchController", SearchController);

    // controller for the search.view.client.html template
    function SearchController($rootScope, $location, ShelterService, PetService, PetShelterConstants) {
        var vm = this;
        
        vm.search = search;
        vm.visitPet = visitPet;

        vm.user = $rootScope.currentUser;
        vm.animals = PetShelterConstants.getAnimals();
        vm.breeds = PetShelterConstants.getBreeds();
        vm.sizes = PetShelterConstants.getSizes();
        vm.sexes = PetShelterConstants.getSexes();
        vm.ages = PetShelterConstants.getAges();
        
        function search(query) {
            if (!query || !query.location) {
                vm.error = "Location is required";
            }
            
            PetService.findPet(query)
                .then(findPetSuccess, findPetError);

            function findPetSuccess(response) {
                vm.pets = response.data;
            }

            function findPetError(error) {

            }
        }

        function visitPet(pet) {
            var petfinderShelter;

            if (pet.source == "PETSHELTER") {
                $location.url("/shelter/" + pet._shelter + "/pet/" + pet._id);
            } else {
                // check if the petfinder shelter exists in the db. if so, return the _id.
                // otherwise, create an entry in the db and return the new _id.
                // then check if the petfinder pet exists in teh db. if so, return the _id.
                // otherwise, create an entry in the db and return the new _id.
                ShelterService
                    .findShelterByPetfinderId(pet.shelterId)
                    .then(findShelterByPetfinderIdSuccess, findShelterByPetfinderIdError);
            }

            // if shelter comes back, next search for pet.
            // if not, then look up the shelter with petfinder API
            function findShelterByPetfinderIdSuccess(response) {
                var existingShelter = response.data;
                if (!$.isEmptyObject(existingShelter)) {
                    petfinderShelter = existingShelter;
                    PetService
                        .findPetByPetfinderId(pet.id)
                        .then(findPetByPetfinderIdSuccess, findPetByPetfinderIdError);
                } else {
                    ShelterService
                        .findPetfinderShelterById(pet.shelterId)
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
                        animal: pet.animal,
                        name: pet.name,
                        breeds: pet.breeds,
                        photoUrl: pet.photoUrl,
                        _shelter: petfinderShelter._id,
                        source: "PETFINDER",
                        petfinderId: pet.id
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
                        petfinderId: pet.shelterId
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
                        animal: pet.animal,
                        name: pet.name,
                        breeds: pet.breeds,
                        photoUrl: pet.photoUrl,
                        _shelter: petfinderShelter._id,
                        source: "PETFINDER",
                        petfinderId: pet.id
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