module.exports = function(mongoose) {

    var q = require("q");
    var UserSchema = require("./user.schema.server.js")(mongoose);
    // need to use PetUser model since User is already used for the assignment:
    // OverwriteModelError: Cannot overwrite `User` model once compiled.
    var User = mongoose.model("PetUser", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByGoogleId: findUserByGoogleId,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        pushShelter: pushShelter,
        pullShelter: pullShelter,
        pushPet: pushPet,
        pullPet: pullPet
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

    // retrieve a user instance whose google.id is equal to parameter googleId
    function findUserByGoogleId(googleId) {
        return User.findOne({ "google.id": googleId });
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

    // Add the given shelterId to the list of shelter ids for the user with the given userId
    function pushShelter(userId, shelterId) {
        return User.update(
            { _id: userId },
            { $pushAll:
                {
                    shelters: [shelterId]
                }
            }
        );
    }

    // Remove the given shelterId from the list of shelter ids for the user with the given userId
    function pullShelter(userId, shelterId) {
        return User.update(
            { _id: userId },
            { $pullAll:
                {
                    shelters: [shelterId]
                }
            }
        );
    }

    // Add the given petId to the list of pet ids for the user with the given petId
    function pushPet(userId, petId) {
        return User.update(
            { _id: userId },
            { $pushAll:
                {
                    pets: [petId]
                }
            }
        );
    }

    // Remove the given petId from the list of pet ids for the user with the given userId
    function pullPet(userId, petId) {
        return User.update(
            { _id: userId },
            { $pullAll:
                {
                    pets: [petId]
                }
            }
        );
    }
};