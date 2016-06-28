module.exports = function(mongoose, shelterModel) {

    var q = require("q");
    var PetSchema = require("./pet.schema.server.js")(mongoose);
    var Pet = mongoose.model("Pet", PetSchema);

    var api = {
        createPet: createPet,
        findAllPetsForShelter: findAllPetsForShelter,
        findPetById: findPetById,
        findPetByQuery: findPetByQuery,
        findPetByPetfinderId: findPetByPetfinderId,
        updatePet: updatePet,
        deletePet: deletePet
    };
    return api;

    // Creates a new pet instance for shelter whose _id is shelterId
    function createPet(shelterId, pet) {
        pet._shelter = shelterId;
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var newPet;

        // create the pet in the db, push the pet id to the shelter's pets array,
        // then resolve the promise with the newly created pet
        Pet
            .create(pet)
            .then(pushPetForShelter,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the pet creation is successful, then push the pet id onto the shelter's pets array
        function pushPetForShelter(pet) {
            newPet = pet;
            return shelterModel.pushPet(shelterId, newPet._id);
        }

        // if the pet id is successfully pushed onto the shelter's pets array then resolve the promise
        // with the newly created pet
        function resolvePromise(numUpdated) {
            deferred.resolve(newPet);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            console.log(err);
            deferred.reject(err);
        }
    }

    // Retrieves all pet instances for shelter whose _id is shelterId
    function findAllPetsForShelter(shelterId) {
        return Pet.find({ _shelter: shelterId });
    }

    // Retrieves single pet instance whose _id is petId
    function findPetById(petId) {
        return Pet.findById(petId);
    }

    function findPetByQuery(query) {
        var errorMessage = {};
        var deferred = q.defer();
        if (!query.location) {
            errorMessage.message = "Location is required for search";
            deferred.reject(errorMessage);
        }
        // find the shelters that match the provided location,
        // then search for pets that match the other query values
        shelterModel
            .findShelterByQuery({ zip: query.location })
            .then(findShelterByQuerySuccess, findShelterByQueryError);

        return deferred.promise;

        function findShelterByQuerySuccess(shelters) {
            var shelterIds = [];
            for (var i = 0; i < shelters.length; i++) {
                shelterIds.push(shelters[i]._id);
            }
            query._shelter = { $in: shelterIds };
            delete query.location;

            Pet
                .find(query)
                .then(findSuccess, findError);
        }

        function findShelterByQueryError(error) {
            errorMessage.message = "Could not find pets at this time. Please try again later.";
            deferred.reject(errorMessage);
        }

        function findSuccess(pets) {
            deferred.resolve(pets);
        }

        function findError(error) {
            errorMessage.message = "Could not find pets at this time. Please try again later.";
            deferred.reject(errorMessage);
        }
    }

    function findPetByPetfinderId(petfinderId) {
        return Pet.findOne({ petfinderId: petfinderId });
    }

    // Updates pet instance whose _id is petId
    function updatePet(petId, pet) {
        delete pet._id;
        if (pet.animal) {
            pet.animal = pet.animal.toUpperCase();
        }
        if (pet.breed) {
            pet.breeds = [pet.breed];
        }
        return Pet.update(
            { _id: petId },
            { $set: pet }
        );
    }

    // Removes pet instance whose _id is petId
    function deletePet(petId) {
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var errorPet = {};
        var numDeleted;
        var petObj;

        // find the pet by id to determine the parent shelter, then
        // remove the pet from the database, then remove the pet id
        // from the shelter's pets array, then resolve the promise with
        // the number of pets deleted
        Pet
            .findById(petId)
            .then(removePet,rejectError)
            .then(pullPetFromShelter,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the pet is successfully found, then remove the pet from the db
        function removePet(pet) {
            if (pet) {
                petObj = pet;
                return Pet.remove({ _id: petId });
            } else {
                errorPet.pet = "Could not find pet with id" + petId;
                throw new Error(errorPet);
            }
        }

        // if the pet is successfully removed from the db, then remove the pet id from the
        // shelter's array of pet ids
        function pullPetFromShelter(deleted) {
            // make sure a pet was actually found and deleted
            if (deleted) {
                numDeleted = deleted;
                return shelterModel.pullPet(petObj._shelter, petId);
            } else {
                errorPet.pet = "Could not find pet with id" + petId;
                throw new Error(errorPet);
            }
        }

        // if the pet id is successfully removed from the shelter array of pet ids, then resolve
        // the promise with the number of pets deleted.
        function resolvePromise(numUpdated) {
            deferred.resolve(numDeleted);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }
    }
};