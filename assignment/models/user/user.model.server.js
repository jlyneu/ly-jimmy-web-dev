var mongoose = require("mongoose");

module.exports = function(db) {
    var UserSchema = require("./user.schema.server.js")();
    var User = mongoose.model("User", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
    };
    return api;

    // create a new user instance
    function createUser(user) {
        return User.create(user);
    }

    // retrieve a user instance whose _id is equal to parameter userId
    function findUserById(userId) {
        return User.findById(userId);
    }

    // retrieve a user instance whose username is equal to parameter username
    function findUserByUsername(username) {
        return User.findOne({ username: username });
    }

    // Retrieves a user instance whose username and password are equal to
    // parameters userId and password
    function findUserByCredentials(username, password) {
        return User.findOne({
            username: username,
            password: password
        });
    }

    // Updates user instance whose _id is equal to parameter userId
    function updateUser(userId, user) {
        return User.update(
            { _id: userId },
            { $set: user }
        );
    }

    // Removes user instance whose _id is equal to parameter userId
    function deleteUser(userId) {
        return User.remove({ _id: userId });
    }
};