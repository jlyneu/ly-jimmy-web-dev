module.exports = function(mongoose, userModel) {

    var q = require("q");
    var ShelterSchema = require("./shelter.schema.server.js")(mongoose);
    var Shelter = mongoose.model("Shelter", ShelterSchema);

    var api = {
        createShelterForUser: createShelterForUser,
        findAllSheltersForUser: findAllSheltersForUser,
        findShelterById: findShelterById,
        updateShelter: updateShelter,
        deleteShelter: deleteShelter,
        pushPet: pushPet,
        pullPet: pullPet
    };
    return api;

    // create a new shelter instance whose users array contains the given userId
    function createShelterForUser(shelter, userId) {
        shelter.users = [userId];
        return Shelter.create(shelter);
    }

    // Retrieves all shelter instances for user whose _id is userId
    function findAllSheltersForUser(userId) {
        return Shelter.find({ _user: userId });
    }

    // Retrieves single shelter instance whose _id is shelterId
    function findShelterById(shelterId) {
        return Shelter.findById(shelterId);
    }

    // Updates shelter instance whose _id is shelterId
    function updateShelter(shelterId, shelter) {
        delete shelter._id;
        return Shelter.update(
            { _id: shelterId },
            { $set: shelter }
        );
    }

    // Removes shelter instance whose _id is shelterId
    function deleteShelter(shelterId) {
        return Shelter.remove({ _id: shelterId });
    }

    // Add the given petId to the list of pet ids for the shelter with the given shelterId
    function pushPet(shelterId, petId) {
        return Shelter.update(
            { _id: shelterId },
            { $pushAll:
                {
                    pets: [petId]
                }
            }
        );
    }

    // Remove the given petId from the list of pet ids for the shelter with the given shelterId
    function pullPet(shelterId, petId) {
        return Shelter.update(
            { _id: shelterId },
            { $pullAll:
                {
                    pets: [petId]
                }
            }
        );
    }
};