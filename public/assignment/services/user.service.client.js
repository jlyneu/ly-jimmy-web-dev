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

        // adds the user parameter instance to the local users array.
        // return the user if creation was successful, otherwise return null.
        function createUser(user) {
            var url = "/api/user";
            return $http.post(url, user);
        }

        // returns the user in the local users array whose _id matches
        // the userId parameter
        function findUserById(userId) {
            var url = "/api/user/" + userId;
            return $http.get(url);
        }

        // returns the user in local users array whose username matches
        // the parameter username
        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        // returns the user whose username and password match
        // the username and password parameters
        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        // updates the user in local users array whose _id matches
        // the userId parameter.
        // return the user if update was successful, otherwise return null.
        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        // removes the user whose _id matches the userId parameter.
        // return true if the deletion was successful, otherwise return false.
        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }
    }
})();