module.exports = function(mongoose) {
    var UserSchema = require("./user.schema.server.js")(mongoose);
    var User = mongoose.model("User", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByFacebookId: findUserByFacebookId,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        pushWebsite: pushWebsite,
        pullWebsite: pullWebsite
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

    // retrieve a user instance whose facebook.id is equal to parameter facebookId
    function findUserByFacebookId(facebookId) {
        return User.findOne({ "facebook.id": facebookId });
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
            { $set:
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    dateUpdated: Date.now()
                }
            }
        );
    }

    // Removes user instance whose _id is equal to parameter userId
    function deleteUser(userId) {
        return User.remove({ _id: userId });
    }

    // Add the given websiteId to the list of website ids for the user with the given userId
    function pushWebsite(userId, websiteId) {
        return User.update(
            { _id: userId },
            { $pushAll:
                {
                    websites: [websiteId]
                }
            }
        );
    }

    // Remove the given websiteId from the list of website ids for the user with the given userId
    function pullWebsite(userId, websiteId) {
        return User.update(
            { _id: userId },
            { $pullAll:
                {
                    websites: [websiteId]
                }
            }
        );
    }
};