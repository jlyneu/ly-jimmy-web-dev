(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService() {
        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        ];
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
            user['_id'] = (new Date()).getTime().toString();
            users.push(user);
            return user;
        }

        // returns the user in the local users array whose _id matches
        // the userId parameter
        function findUserById(userId) {
            for (var i in users) {
                if (users[i]['_id'] === userId) {
                    return users[i];
                }
            }
            return null;
        }

        // returns the user in local users array whose username matches
        // the parameter username
        function findUserByUsername(username) {
            for (var i in users) {
                if (users[i]['username'] === username) {
                    return users[i];
                }
            }
            return null;
        }

        // returns the user whose username and password match
        // the username and password parameters
        function findUserByCredentials(username, password) {
            for (var i in users) {
                if (users[i]['username'] === username &&
                    users[i]['password'] === password) {
                    return users[i];
                }
            }
            return null;
        }

        // updates the user in local users array whose _id matches
        // the userId parameter.
        // return the user if update was successful, otherwise return null.
        function updateUser(userId, user) {
            for (var i in users) {
                if (users[i]['_id'] === userId) {
                    users[i].email = user.email;
                    users[i].firstName = user.firstName;
                    users[i].lastName = user.lastName;
                    return user;
                }
            }
            return null;
        }

        // removes the user whose _id matches the userId parameter.
        // return true if the deletion was successful, otherwise return false.
        function deleteUser(userId) {
            for (var i in users) {
                if (users[i]['_id'] === userId) {
                    users.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    }
})();