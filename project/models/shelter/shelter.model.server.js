var q = require("q");

module.exports = function(mongoose) {

    var ShelterSchema = require("./shelter.schema.server.js")(mongoose);
    var Shelter = mongoose.model("Shelter", ShelterSchema);

    var api = {
        createShelterForUser: createShelterForUser,
        findAllSheltersForUser: findAllSheltersForUser,
        findShelterById: findShelterById,
        findShelterByQuery: findShelterByQuery,
        findShelterByPetfinderId: findShelterByPetfinderId,
        updateShelter: updateShelter,
        deleteShelter: deleteShelter,
        pushPet: pushPet,
        pullPet: pullPet
    };
    return api;

    // create a new shelter instance whose users array contains the given userId
    function createShelterForUser(userId, shelter) {
        if (userId != "null") {
            shelter.users = [userId];
        }
        return Shelter.create(shelter);
    }

    // Retrieves all shelter instances for user whose _id is userId
    function findAllSheltersForUser(userId) {
        return Shelter.find({ users: userId });
    }

    // Retrieves single shelter instance whose _id is shelterId
    function findShelterById(shelterId) {
        var errorMessage = {};
        var deferred = q.defer();
        Shelter
            .findById(shelterId)
            .populate("users")
            .exec(function (error, shelter) {
                if (error) {
                    errorMessage.message = "Error populating users for shelter";
                    deferred.reject(errorMessage);
                } else {
                    deferred.resolve(shelter);
                }
            });
        return deferred.promise;
    }

    // find the shelter based on the given query object
    function findShelterByQuery(query) {
        return Shelter.find(query);
    }

    // find the shelter in the database with the given petfinderId
    function findShelterByPetfinderId(petfinderId) {
        return Shelter.findOne({ petfinderId: petfinderId });
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