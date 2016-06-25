(function() {
    angular
        .module("PetShelter")
        .factory("PetFinderService", PetFinderService);
    function PetFinderService($http) {
        var api = {
            "getPet"        : getPet,
            "findPet"       : findPet,
            "getShelter"    : getShelter,
            "getShelterPets": getShelterPets,
        };
        return api;

        // return a promise for finding a pet from the PetFinder data. if the pet was found
        // successfully, then the promise will resolve with the pet.
        // if the pet was not found, the promise will resolve with an error.
        function getPet(petId) {
            var url = "/api/petfinder/getpet/" + petId;
            return $http.get(url);
        }

        // return a promise for finding pets by the given query. if the search was successful,
        // then the promise will resolve with the list of pets. if the search was not successful,
        // then the promise will resolve with an error.
        function findPet(query) {
            var url = "/api/petfinder/findpet?";
            url += query.location;
            if (query.type) {
                url += "&location=" + query.type;
            }
            if (query.breed) {
                url += "&breed=" + query.breed;
            }
            if (query.size) {
                url += "&size=" + query.size;
            }
            if (query.sex) {
                url += "&sex=" + query.sex;
            }
            if (query.age) {
                url += "&age=" + query.age;
            }
            return $http.get(url);
        }

        // return a promise for finding a shelter by the given id. if the shelter was found,
        // then the promise will resolve with the existing shelter. if the shelter was not
        // found, then the promise will resolve with an error.
        function getShelter(shelterId) {
            var url = "/api/petfinder/getshelter/" + shelterId;
            return $http.get(url);
        }

        // return a promise for finding the pets of the specified shelter in the . if the message was updated
        // successfully, then the promise will resolve with the updated message. if the message was not
        // updated, then the promise will resolve with an error.
        function getShelterPets(shelterId) {
            var url = "/api/petfinder/getshelterpets/" + shelterId;
            return $http.get(url);
        }

        // return a promise for deleting the given message on the server. if the message was deleted
        // successfully, then the promise will resolve with 'true'. if the message was not
        // deleted, then the promise will resolve with an error.
        function deleteMessage(messageId) {
            var url = "/api/petshelter/message/" + messageId;
            return $http.delete(url);
        }
    }
})();