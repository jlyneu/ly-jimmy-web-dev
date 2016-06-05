(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService($http) {
        var api = {
            "createUser"            : createUser,
            "findUserById"          : findUserById,
            "findUserByUsername"    : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser"            : updateUser,
            "deleteUser"            : deleteUser
        };
        return api;

        // return a promise for creating a user on the server. if the user was created
        // successfully, then the promise will resolve with the new user.
        // if the user was not created, the promise will resolve with an error.
        function createUser(user) {
            var url = "/api/user";
            return $http.post(url, user);
        }

        // return a promise for finding a user by the given id. if the user was found,
        // then the promise will resolve with the existing user. if the user was not
        // found, then the promise will resolve with an error.
        function findUserById(userId) {
            var url = "/api/user/" + userId;
            return $http.get(url);
        }

        // return a promise for finding a user by the given username. if the user was found,
        // then the promise will resolve with the existing user. if the user was not
        // found, then the promise will resolve with an error.
        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        // return a promise for finding a user by the given credentials. if the user was found,
        // then the promise will resolve with the existing user. if the user was not
        // found, then the promise will resolve with an error.
        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        // return a promise for updating the given user on the server. if the user was updated
        // successfully, then the promise will resolve with the updated user. if the user was not
        // updated, then the promise will resolve with an error.
        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        // return a promise for deleting the given user on the server. if the user was deleted
        // successfully, then the promise will resolve with 'true'. if the user was not
        // deleted, then the promise will resolve with an error.
        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }
    }
})();