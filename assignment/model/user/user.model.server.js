var mongoose = require("mongoose");
var q = require("q");

module.exports = function(db) {
    var UserSchema = require("./user.schema.server.js")();
    var User = mongoose.model("User", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser
    };
    return api;

    // create a new user instance
    function createUser(user) {
        var deferred = q.defer();
        User.create(user, function(err, doc) {
            if (!err) {
                deferred.resolve(doc);
            } else {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }

    // retrieve a user instance whose _id is equal to parameter userId
    function findUserById(userId) {
        var deferred = q.defer();
        User
            .findOne(
                { _id: userId },
                function(err, user) {
                    if (!err) {
                        deferred.resolve(user);
                    } else {
                        deferred.reject(err);
                    }
                });
        return deferred.promise;
    }

    // retrieve a user instance whose username is equal to parameter username
    function findUserByUsername(username) {
        var deferred = q.defer();
        User
            .findOne(
                { username: username },
                function(err, user) {
                    if (!err) {
                        deferred.resolve(user);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }

    // Retrieves a user instance whose username and password are equal to
    // parameters userId and password
    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        User
            .findOne(
                {
                    username: username,
                    password: password
                },
                function(err, user) {
                    if (!err) {
                        deferred.resolve(user);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }

    // Updates user instance whose _id is equal to parameter userId
    function updateUser(userId, user) {
        var deferred = q.defer();
        User
            .update(
                { _id: userId },
                { $set: user },
                function(err, numUpdated) {
                    if (!err) {
                        deferred.resolve(numUpdated);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }

    // Removes user instance whose _id is equal to parameter userId
    function deleteUser(userId) {
        var deferred = q.defer();
        User
            .remove(
                { _id: userId },
                function(err, numDeleted) {
                    if (!err) {
                        deferred.resolve(numDeleted);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }
};