var request = require("request");
var util = require("../utils/petfinder.util.server.js")();
var multer = require('multer');
var upload = multer({ dest: __dirname + '/../../public/uploads' });

module.exports = function(app, models) {

    // declare the API
    app.post("/api/petshelter/pet/upload", upload.single("myFile"), uploadImage);
    app.post("/api/petshelter/shelter/:shelterId/pet", createPet);
    app.get("/api/petshelter/shelter/:shelterId/pet", findAllPetsForShelter);
    app.get("/api/petshelter/pet", findPet);
    app.get("/api/petshelter/pet/:petId", findPetById);
    app.get("/api/petshelter/petfinder/pet/:petfinderId", findPetByPetfinderId);
    app.get("/api/petfinder/pet/:petfinderId", findPetfinderPetById);
    app.put("/api/petshelter/pet/:petId", updatePet);
    app.delete("/api/petshelter/pet/:petId", deletePet);

    var shelterModel = models.shelterModel;
    var petModel = models.petModel;

    // upload the image in the body of the request to the server and
    // return a path to the uploaded image
    function uploadImage(req, res) {
        var shelterId = req.body.shelterId;
        var petId     = req.body.petId;
        var myFile    = req.file;

        // if file isn't provided, then redirect user back to pet detail page
        if (!myFile) {
            redirectToPetDetail();
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        // find the pet by the given petId. If successful, try to update the url of the pet with
        // the path to the newly uploaded file on the server. If successful then update the pet in the
        // database. Make sure the user is redirected to the pet detail page
        petModel
            .updatePet(petId, { photoUrl: "/uploads/" + filename })
            .then(redirectToPetDetail, redirectToPetDetail);

        // redirect the user to the pet detail page
        function redirectToPetDetail() {
            res.redirect("/project/#/shelter/" + shelterId + "/pet/" + petId);
        }
    }

    // adds the pet body parameter instance to the database.
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

    // retrieves the pets in the database whose shelterId
    // matches the parameter shelterId
    function findAllPetsForShelter(req, res) {
        var shelterId = req.params["shelterId"];
        var source = req.query["source"];
        if (source == "PETFINDER") {
            findPetfinderPetsForShelter(shelterId, res);
        } else {
            findPetshelterPetsForShelter(shelterId, res);
        }
    }

    // retrieves the petshelter pets for the shelter with the given shelter id
    // from the database
    function findPetshelterPetsForShelter(shelterId, res) {
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

    // uses the third party petfinder API to find the petfinder pets for the
    // shelter with the given shelterId
    function findPetfinderPetsForShelter(shelterId, res) {
        var results = [];
        var errorMessage = {};

        shelterModel
            .findShelterById(shelterId)
            .then(findShelterByIdSuccess, findShelterByIdError);

        // if the shelter is returned from the database, make a request to the third party
        // API to get the pets for the shelter
        function findShelterByIdSuccess(shelter) {
            if (shelter) {
                var url = "http://api.petfinder.com/shelter.getPets?key=" + process.env.PETFINDER_KEY;
                url += "&id=" + shelter.petfinderId;
                url += "&format=json";

                request(url, requestCallback);
            } else {
                errorMessage.message = "Could not fetch pets at this time. Please try again later.";
                return res.status(500).json(errorMessage);
            }
        }

        // an error occurred so return an error
        function findShelterByIdError(error) {
            errorMessage.message = "Could not fetch pets at this time. Please try again later.";
            return res.status(500).json(errorMessage);
        }

        // when the data comes back from the petfinder API, convert the pet responses to a form
        // closer to the pet schema then return the list to the client.
        function requestCallback(error, response, body) {
            // decode certain special characters in response from petfinder. if there is a malformed URI component,
            // then simply parse the body into JSON, leaving special characters.
            var data;
            try {
                data = JSON.parse(decodeURIComponent(escape(body)));
            } catch (e) {
                data = JSON.parse(body);
            }
            if (!error && response.statusCode == 200) {
                // check for an error first
                if (data.petfinder.header.status.message && data.petfinder.header.status.message.$t) {
                    errorMessage.message = data.petfinder.header.status.message.$t;
                    return res.status(400).json(errorMessage);
                }
                else {
                    // loop through the pets and convert the response to the pet schema-like format
                    var pets = data.petfinder.pets.pet;
                    if (pets) {
                        for (var i = 0; i < pets.length; i++) {
                            results.push(util.cleanPetObj(pets[i]));
                        }
                        return res.json(results);
                    } else {
                        return res.json([]);
                    }
                }
            } else {
                // if there was an error then return an error
                return res.status(500).json(error);
            }
        }
    }

    // given a search query in the request, look in the database for pets that match the
    // query criteria, then use the third party petfinder API to find the petfinder pets
    // that match the search query criteria
    function findPet(req, res) {
        var results = [];
        var errorMessage = {};
        var url = "http://api.petfinder.com/pet.find?key=" + process.env.PETFINDER_KEY;
        // make sure the user provides a location
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

        // look for pets in the database that match the query criteria
        petModel
            .findPetByQuery(req.query)
            .then(findPetByQuerySuccess, findPetByQueryError);

        // add the pets to the result list then make a request to the petfinder API
        // to find petfinder pets that match the query criteria
        function findPetByQuerySuccess(pets) {
            for (var i = 0; i < pets.length; i++) {
                results.push(pets[i]);
            }
            request(url, requestCallback);
        }

        // an error occurred so return an error
        function findPetByQueryError(error) {
            errorMessage.message("Could not find pets at this time. Please try again later.");
            return res.status(500).json(errorMessage);
        }

        // when the data comes back from the petfinder API, convert the pet responses to a form
        // closer to the pet schema then return the list to the client.
        function requestCallback(error, response, body) {
            // decode certain special characters in response from petfinder. if there is a malformed URI component,
            // then simply parse the body into JSON, leaving special characters.
            var data;
            try {
                data = JSON.parse(decodeURIComponent(escape(body)));
            } catch (e) {
                data = JSON.parse(body);
            }
            // first check for errors
            if (!error && response.statusCode == 200) {
                if (data.petfinder.header.status.message && data.petfinder.header.status.message.$t) {
                    errorMessage.message = data.petfinder.header.status.message.$t;
                    return res.status(400).json(errorMessage);
                }
                else {
                    // convert pet responses to format similar to pet schema, add to results,
                    // then return results to client
                    var pets = data.petfinder.pets.pet;
                    if (pets) {
                        for (var i = 0; i < pets.length; i++) {
                            results.push(util.cleanPetObj(pets[i]));
                        }
                        return res.json(results);
                    } else {
                        return res.json([]);
                    }
                }
            } else {
                // if an error occurred then return an error
                return res.status(500).json(error);
            }
        }
    }

    // retrieves the pet in the database whose _id matches
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

    // find pet in database with petfinderId parameter value
    function findPetByPetfinderId(req, res) {
        var petfinderId = req.params["petfinderId"];
        var errorMessage = {};

        petModel
            .findPetByPetfinderId(petfinderId)
            .then(findPetByPetfinderIdSuccess, findPetByPetfinderIdError);

        // return the pet to the client
        function findPetByPetfinderIdSuccess(pet) {
            return res.json(pet);
        }

        // an error occurred so return an error to the client
        function findPetByPetfinderIdError(error) {
            errorMessage.message = "Could not fetch pet. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // use the third party petfinder API to find the pet with the provided petfinderId
    // and return to the client
    function findPetfinderPetById(req, res) {
        var petfinderId = req.params["petfinderId"];
        var errorMessage = {};

        var url = "http://api.petfinder.com/pet.get?key=" + process.env.PETFINDER_KEY;
        url += "&id=" + petfinderId;
        url += "&format=json";
        request(url, requestCallback);

        // when the data comes back from the petfinder API, convert the pet responses to a form
        // closer to the pet schema then return the list to the client.
        function requestCallback(error, response, body) {
            // decode certain special characters in response from petfinder. if there is a malformed URI component,
            // then simply parse the body into JSON, leaving special characters.
            var data;
            try {
                data = JSON.parse(decodeURIComponent(escape(body)));
            } catch (e) {
                data = JSON.parse(body);
            }
            // first check for errors
            if (!error && response.statusCode == 200) {
                if (data.petfinder.header.status.message && data.petfinder.header.status.message.$t) {
                    errorMessage.message = data.petfinder.header.status.message.$t;
                    return res.status(400).json(errorMessage);
                }
                else {
                    // convert pet response to format like pet schema then return to client
                    var pet = data.petfinder.pet;
                    if (pet) {
                        return res.json(util.cleanPetObj(pet));
                    } else {
                        return res.json({});
                    }
                }
            } else {
                // an error occurred so return an error
                return res.status(500).json(error);
            }
        }
    }

    // updates the pet in the database whose _id matches the petId parameter
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

    // removes the pet from the database whose _id matches the petId parameter.
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