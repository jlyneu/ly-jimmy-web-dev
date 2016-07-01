(function() {
    angular
        .module("PetShelter")
        .factory("UserService", UserService);
    function UserService($http) {
        var api = {
            "login"                 : login,
            "logout"                : logout,
            "register"              : register,
            "createUser"            : createUser,
            "findUserById"          : findUserById,
            "findUserByUsername"    : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "saveShelter"           : saveShelter,
            "savePet"               : savePet,
            "updateUser"            : updateUser,
            "deleteUser"            : deleteUser
        };
        return api;

        // return a promise for logging in a user on the server. if the user was
        // logged in successfully, then the promise will resolve with the user object.
        // if the user was not logged in, the promise will resolve with an error.
        function login(user) {
            var url = "/api/petshelter/login";
            return $http.post(url, user);
        }

        // return a promise for logging out a user on the server. if the user was
        // logged out successfully, then the promise will resolve with a 200 status
        // and an empty object. if the user was not logged out properly, then the
        // promise will resolve with an error.
        function logout() {
            var url = "/api/petshelter/logout";
            return $http.post(url);
        }

        // return a promise for creating a user on the server. if the user was created
        // successfully, then the promise will resolve with the new user.
        // if the user was not created, the promise will resolve with an error.
        function register(user) {
            var url = "/api/petshelter/register";
            return $http.post(url, user);
        }

        // return a promise for creating a user on the server. if the user was created
        // successfully, then the promise will resolve with the new user.
        // if the user was not created, the promise will resolve with an error.
        function createUser(user) {
            var url = "/api/petshelter/user";
            return $http.post(url, user);
        }

        // return a promise for finding a user by the given id. if the user was found,
        // then the promise will resolve with the existing user. if the user was not
        // found, then the promise will resolve with an error.
        function findUserById(userId) {
            var url = "/api/petshelter/user/" + userId;
            return $http.get(url);
        }

        // return a promise for finding a user by the given username. if the user was found,
        // then the promise will resolve with the existing user. if the user was not
        // found, then the promise will resolve with an error.
        function findUserByUsername(username) {
            var url = "/api/petshelter/user?username=" + username;
            return $http.get(url);
        }

        // return a promise for finding a user by the given credentials. if the user was found,
        // then the promise will resolve with the existing user. if the user was not
        // found, then the promise will resolve with an error.
        function findUserByCredentials(username, password) {
            var url = "/api/petshelter/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        // return a promise for saving or unsaving a shelter for the user with the given userId.
        // if the shelter was saved/unsaved properly, then the promise will resolve with the updated
        // user. if not, then the promise will resolve with an error.
        function saveShelter(userId, shelterId, isSaved) {
            var url = "/api/petshelter/user/" + userId + "/shelter/" + shelterId;
            return $http.put(url, { isSaved: isSaved });
        }

        // return a promise for saving or unsaving a pet for the user with the given userId.
        // if the pet was saved/unsaved properly, then the promise will resolve with the updated
        // user. if not, then the promise will resolve with an error.
        function savePet(userId, petId, isSaved) {
            var url = "/api/petshelter/user/" + userId + "/pet/" + petId;
            return $http.put(url, { isSaved: isSaved });
        }

        // return a promise for updating the given user on the server. if the user was updated
        // successfully, then the promise will resolve with the updated user. if the user was not
        // updated, then the promise will resolve with an error.
        function updateUser(userId, user) {
            var url = "/api/petshelter/user/" + userId;
            return $http.put(url, user);
        }

        // return a promise for deleting the given user on the server. if the user was deleted
        // successfully, then the promise will resolve with 'true'. if the user was not
        // deleted, then the promise will resolve with an error.
        function deleteUser(userId) {
            var url = "/api/petshelter/user/" + userId;
            return $http.delete(url);
        }
    }
})();