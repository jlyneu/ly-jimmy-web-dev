(function() {
    angular
        .module("PetShelter")
        .factory("PetService", PetService);
    function PetService($http) {
        var api = {
            "createPet"            : createPet,
            "findPetsByShelterId"  : findPetsByShelterId,
            "findPet"              : findPet,
            "findPetById"          : findPetById,
            "findPetByPetfinderId" : findPetByPetfinderId,
            "findPetfinderPetById" : findPetfinderPetById,
            "updatePet"            : updatePet,
            "deletePet"            : deletePet
        };
        return api;

        // return a promise for creating a pet on the server. if the pet was created
        // successfully, then the promise will resolve with the new pet.
        // if the pet was not created, the promise will resolve with an error.
        function createPet(shelterId, pet) {
            var url = "/api/petshelter/shelter/" + shelterId + "/pet";
            return $http.post(url, pet);
        }
        
        // return a promise for finding pets by the given user id. if the pets were found,
        // then the promise will resolve with the existing pets. if the pets were not
        // found, then the promise will resolve with an error.
        function findPetsByShelterId(shelterId, source) {
            var url = "/api/petshelter/shelter/" + shelterId + "/pet";
            if (source) {
                url += "?source=" + source;
            }
            return $http.get(url);
        }

        // return a promise for finding pets by the given query. if the search was successful,
        // then the promise will resolve with the list of pets. if the search was not successful,
        // then the promise will resolve with an error.
        function findPet(query) {
            // use the given query to form the url to pass parameters to the server
            var url = "/api/petshelter/pet?";
            url += "location=" + query.location;
            if (query.animal) {
                url += "&animal=" + query.animal.value;
            }
            if (query.breed) {
                url += "&breed=" + query.breed;
            }
            if (query.size) {
                url += "&size=" + query.size.value;
            }
            if (query.sex) {
                url += "&sex=" + query.sex.value;
            }
            if (query.age) {
                url += "&age=" + query.age;
            }
            return $http.get(url);
        }

        // return a promise for finding a pet by the given id. if the pet was found,
        // then the promise will resolve with the existing pet. if the pet was not
        // found, then the promise will resolve with an error.
        function findPetById(petId) {
            var url = "/api/petshelter/pet/" + petId;
            return $http.get(url);
        }

        // return a promise for finding a pet in the database that has the provided
        // petfinderId. if the pet was found, then the promise will resolve with the
        // existing pet. if the pet was not found, then the promise will resolve with an error.
        function findPetByPetfinderId(petfinderId) {
            var url = "/api/petshelter/petfinder/pet/" + petfinderId;
            return $http.get(url);
        }

        // return a promise for finding a petfinder pet using the third party petfinder API.
        // if the pet was found, then the promise will resolve with the pet.
        // if the pet was not found, then the promise will resolve with an error.
        function findPetfinderPetById(petfinderId) {
            var url = "/api/petfinder/pet/" + petfinderId;
            return $http.get(url);
        }

        // return a promise for updating the given pet on the server. if the pet was updated
        // successfully, then the promise will resolve with the updated pet. if the pet was not
        // updated, then the promise will resolve with an error.
        function updatePet(petId, pet) {
            var url = "/api/petshelter/pet/" + petId;
            return $http.put(url, pet);
        }

        // return a promise for deleting the given pet on the server. if the pet was deleted
        // successfully, then the promise will resolve with 'true'. if the pet was not
        // deleted, then the promise will resolve with an error.
        function deletePet(petId) {
            var url = "/api/petshelter/pet/" + petId;
            return $http.delete(url);
        }
    }
})();