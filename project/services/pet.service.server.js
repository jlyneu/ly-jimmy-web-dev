var request = require("request");
var util = require("../utils/petfinder.util.server.js")();

module.exports = function(app, models) {

    // declare the API
    app.post("/api/petshelter/shelter/:shelterId/pet", createPet);
    app.get("/api/petshelter/shelter/:shelterId/pet", findAllPetsForShelter);
    app.get("/api/petshelter/pet", findPet);
    app.get("/api/petshelter/pet/:petId", findPetById);
    app.put("/api/petshelter/pet/:petId", updatePet);
    app.delete("/api/petshelter/pet/:petId", deletePet);

    var petModel = models.petModel;

    // adds the pet body parameter instance to the local pets array.
    // return the pet if creation was successful, otherwise return an error.
    function createPet(req, res) {
        var shelterId = req.params["shelterId"];
        var pet = req.body;
        var errorMessage = {};

        // first check for validation errors
        if (!shelterId) {
            errorMessage.message = "A shelterId is required.";
            res.status(400).json(errorMessage);
            return;
        } else if (!pet.name) {
            errorMessage.message = "A pet name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to create the pet in the database
        petModel
            .createPet(shelterId, pet)
            .then(createPetSuccess, createPetError);

        // if the pet creation is successful, then return the new pet
        function createPetSuccess(newPet) {
            if (newPet) {
                res.json(newPet);
            } else {
                errorMessage.message = "Could not create pet. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function createPetError(error) {
            errorMessage.message = "Could not create pet. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the pets in local pets array whose shelterId
    // matches the parameter shelterId
    function findAllPetsForShelter(req, res) {
        var shelterId = req.params["shelterId"];
        var errorMessage = {};

        // try to find the pets in the database
        petModel
            .findAllPetsForShelter(shelterId)
            .then(findAllPetsForShelterSuccess, findAllPetsForShelterError);

        // return the pets from the model. otherwise, something went wrong
        function findAllPetsForShelterSuccess(pets) {
            if (pets) {
                res.json(pets);
            } else {
                errorMessage.message = "Could not fetch pets. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findAllPetsForShelterError(error) {
            errorMessage.message = "Could not fetch pets. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    function findPet(req, res) {
        var errorMessage = {};
        var url = "http://api.petfinder.com/pet.find?key=" + process.env.PETFINDER_KEY;
        if (req.query.location) {
            url += "&location=" + req.query.location;
        } else {
            errorMessage.message = "Location is required for finding a pet.";
            res.status(400).json(errorMessage);
            return;
        }
        if (req.query.animal) {
            url += "&animal=" + req.query.animal;
        }
        if (req.query.breed) {
            url += "&breed=" + req.query.breed;
        }
        if (req.query.size) {
            url += "&size=" + req.query.size;
        }
        if (req.query.sex) {
            url += "&sex=" + req.query.sex;
        }
        if (req.query.age) {
            url += "&age=" + req.query.age;
        }
        url += "&format=json";
        request(url, requestCallback);

        function requestCallback(error, response, body) {
            // decode certain special characters in response from petfinder
            var data = JSON.parse(decodeURIComponent(escape(body)));
            if (!error && response.statusCode == 200) {
                if (!data.petfinder.header.message) {
                    var pets = data.petfinder.pets.pet;
                    var cleanPetList = [];
                    for (var i = 0; i < pets.length; i++) {
                        cleanPetList.push(util.cleanPetObj(pets[i]));
                    }
                    return res.json(cleanPetList);
                } else {
                    errorMessage.message = data.petfinder.header.status.message.$t;
                    return res.status(400).json(errorMessage);
                }
            } else {
                return res.status(500).json(error);
            }
        }
    }

    // retrieves the pet in local pets array whose _id matches
    // the petId parameter. return an error if the pet cannot be found.
    function findPetById(req, res) {
        var petId = req.params["petId"];
        var errorMessage = {};

        // try to find the pet in the database
        petModel
            .findPetById(petId)
            .then(findPetByIdSuccess, findPetByIdError);

        // return the pet from the model. otherwise, the pet wasn't found
        function findPetByIdSuccess(pet) {
            if (pet) {
                res.json(pet);
            } else {
                errorMessage.message = "Pet with id " + petId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findPetByIdError(error) {
            errorMessage.message = "Could not fetch pet. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // updates the pet in local pets array whose _id matches
    // the petId parameter
    // return the updated pet if successful, otherwise return an error
    function updatePet(req, res) {
        var petId = req.params["petId"];
        var pet = req.body;
        var errorMessage = {};

        if (!pet.name) {
            errorMessage.message = "A pet name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to update the pet in the database
        petModel
            .updatePet(petId, pet)
            .then(updatePetSuccess, updatePetError);

        // return the pet if update successful. otherwise the pet wasn't found
        function updatePetSuccess(numUpdated) {
            if (numUpdated) {
                res.json(pet);
            } else {
                errorMessage.message = "Pet with id " + petId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function updatePetError(error) {
            errorMessage.message = "Could not update pet. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the pet from local pets array whose _id matches
    // the petId parameter.
    // return true if the pet is successfully deleted, otherwise return an error.
    function deletePet(req, res) {
        var petId = req.params["petId"];
        var errorMessage = {};

        // try to delete the pet from the database
        petModel
            .deletePet(petId)
            .then(deletePetSuccess, deletePetError);

        // if deletion is successful, then return true. otherwise, the pet wasn't found
        function deletePetSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "Pet with id " + petId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function deletePetError(error) {
            errorMessage.message = "Could not delete pet. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }
};