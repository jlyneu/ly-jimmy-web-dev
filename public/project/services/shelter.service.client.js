(function() {
    angular
        .module("PetShelter")
        .factory("ShelterService", ShelterService);
    function ShelterService($http) {
        var api = {
            "createShelter"           : createShelter,
            "findSheltersByUserId"    : findSheltersByUserId,
            "findShelterById"         : findShelterById,
            "findShelterByPetfinderId": findShelterByPetfinderId,
            "findPetfinderShelterById": findPetfinderShelterById,
            "updateShelter"           : updateShelter,
            "saveShelter"             : saveShelter,
            "deleteShelter"           : deleteShelter
        };
        return api;

        // return a promise for creating a shelter on the server. if the shelter was created
        // successfully, then the promise will resolve with the new shelter.
        // if the shelter was not created, the promise will resolve with an error.
        function createShelter(userId, shelter) {
            var url = "/api/petshelter/user/" + userId + "/shelter";
            return $http.post(url, shelter);
        }

        // return a promise for finding shelters by the given user id. if the shelters were found,
        // then the promise will resolve with the existing shelters. if the shelters were not
        // found, then the promise will resolve with an error.
        function findSheltersByUserId(userId) {
            var url = "/api/petshelter/user/" + userId + "/shelter";
            return $http.get(url);
        }

        // return a promise for finding a shelter by the given id. if the shelter was found,
        // then the promise will resolve with the existing shelter. if the shelter was not
        // found, then the promise will resolve with an error.
        function findShelterById(shelterId) {
            var url = "/api/petshelter/shelter/" + shelterId;
            return $http.get(url);
        }

        function findShelterByPetfinderId(petfinderId) {
            var url = "/api/petshelter/petfinder/shelter/" + petfinderId;
            return $http.get(url);
        }

        function findPetfinderShelterById(petfinderId) {
            var url = "/api/petfinder/shelter/" + petfinderId;
            return $http.get(url);
        }

        // return a promise for updating the given shelter on the server. if the shelter was updated
        // successfully, then the promise will resolve with the updated shelter. if the shelter was not
        // updated, then the promise will resolve with an error.
        function updateShelter(shelterId, shelter) {
            var url = "/api/petshelter/shelter/" + shelterId;
            return $http.put(url, shelter);
        }

        function saveShelter(userId, shelterId, isSaved) {
            var url = "/api/petshelter/user/" + userId + "/shelter/" + shelterId;
            return $http.put(url, { isSaved: isSaved });
        }

        // return a promise for deleting the given shelter on the server. if the shelter was deleted
        // successfully, then the promise will resolve with 'true'. if the shelter was not
        // deleted, then the promise will resolve with an error.
        function deleteShelter(shelterId) {
            var url = "/api/petshelter/shelter/" + shelterId;
            return $http.delete(url);
        }
    }
})();