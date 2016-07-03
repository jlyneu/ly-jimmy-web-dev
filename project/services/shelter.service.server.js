var request = require("request");
var util = require("../utils/petfinder.util.server.js")();

module.exports = function(app, models) {

    // declare the API
    app.post("/api/petshelter/user/:userId/shelter", createShelter);
    app.get("/api/petshelter/user/:userId/shelter", findAllSheltersForUser);
    app.get("/api/petshelter/shelter/:shelterId", findShelterById);
    app.get("/api/petshelter/petfinder/shelter/:petfinderId", findShelterByPetfinderId);
    app.get("/api/petfinder/shelter/:petfinderId", findPetfinderShelterById);
    app.put("/api/petshelter/shelter/:shelterId", updateShelter);
    app.put("/api/petshelter/shelter/:shelterId/user/:userId/add", addUserToShelter);
    app.put("/api/petshelter/shelter/:shelterId/user/:userId/remove", removeUserFromShelter);
    app.delete("/api/petshelter/shelter/:shelterId", deleteShelter);

    var shelterModel = models.shelterModel;

    // adds the shelter body parameter instance to the database.
    // return the shelter if creation was successful, otherwise return an error.
    function createShelter(req, res) {
        var userId = req.params["userId"];
        var shelter = req.body;
        var errorMessage = {};

        // first check for validation errors
        if (!userId) {
            errorMessage.message = "A userId is required.";
            res.status(400).json(errorMessage);
            return;
        } else if (!shelter.name) {
            errorMessage.message = "A shelter name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to create the shelter in the database
        shelterModel
            .createShelterForUser(userId, shelter)
            .then(createShelterForUserSuccess, createShelterForUserError);

        // if the shelter creation is successful, then return the new shelter
        function createShelterForUserSuccess(newShelter) {
            if (newShelter) {
                res.json(newShelter);
            } else {
                errorMessage.message = "Could not create shelter. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function createShelterForUserError(error) {
            errorMessage.message = "Could not create shelter. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the shelters in the database whose userId
    // matches the parameter userId
    function findAllSheltersForUser(req, res) {
        var userId = req.params["userId"];
        var errorMessage = {};

        // try to find the shelters in the database
        shelterModel
            .findAllSheltersForUser(userId)
            .then(findAllSheltersForUserSuccess, findAllSheltersForUserError);

        // return the shelters from the model. otherwise, something went wrong
        function findAllSheltersForUserSuccess(shelters) {
            if (shelters) {
                res.json(shelters);
            } else {
                errorMessage.message = "Could not fetch shelters. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findAllSheltersForUserError(error) {
            errorMessage.message = "Could not fetch shelters. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the shelter in the database whose _id matches
    // the shelterId parameter. return an error if the shelter cannot be found.
    function findShelterById(req, res) {
        var shelterId = req.params["shelterId"];
        var errorMessage = {};

        // try to find the shelter in the database
        shelterModel
            .findShelterById(shelterId)
            .then(findShelterByIdSuccess, findShelterByIdError);

        // return the shelter from the model. otherwise, the shelter wasn't found
        function findShelterByIdSuccess(shelter) {
            if (shelter) {
                res.json(shelter);
            } else {
                errorMessage.message = "Shelter with id " + shelterId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findShelterByIdError(error) {
            errorMessage.message = "Could not fetch shelter. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // find shelter in database with petfinderId parameter value
    function findShelterByPetfinderId(req, res) {
        var petfinderId = req.params["petfinderId"];
        var errorMessage = {};

        shelterModel
            .findShelterByPetfinderId(petfinderId)
            .then(findShelterByPetfinderIdSuccess, findShelterByPetfinderIdError);

        // return the shelter to the client
        function findShelterByPetfinderIdSuccess(shelter) {
            return res.json(shelter);
        }
        
        // an error occurred so return an error to the client
        function findShelterByPetfinderIdError(error) {
            errorMessage.message = "Could not fetch shelter. Please try again later.";
            return res.status(500).json(errorMessage);
        }
    }

    // use the third party petfinder API to find the shelter with the provided petfinderId
    // and return to the client
    function findPetfinderShelterById(req, res) {
        var petfinderId = req.params["petfinderId"];
        var errorMessage = {};

        var url = "http://api.petfinder.com/shelter.get?key={key}&id={id}&format=json"
            .replace("{key}", process.env.PETFINDER_KEY).replace("{id}", petfinderId);

        request(url, requestCallback);
        
        // when the data comes back from the petfinder API, convert the shelter responses to a form
        // closer to the shelter schema then return the list to the client.
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
                    // convert shelter response to format like shelter schema then return to client
                    var shelter = data.petfinder.shelter;
                    if (shelter) {
                        return res.json(util.cleanShelterObj(shelter));
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

    // updates the shelter in the database whose _id matches the shelterId parameter
    // return the updated shelter if successful, otherwise return an error
    function updateShelter(req, res) {
        var shelterId = req.params["shelterId"];
        var shelter = req.body;
        var errorMessage = {};

        if (!shelter.name) {
            errorMessage.message = "A shelter name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to update the shelter in the database
        shelterModel
            .updateShelter(shelterId, shelter)
            .then(updateShelterSuccess, updateShelterError);

        // return the shelter if update successful. otherwise the shelter wasn't found
        function updateShelterSuccess(numUpdated) {
            if (numUpdated) {
                res.json(shelter);
            } else {
                errorMessage.message = "Shelter with id " + shelterId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function updateShelterError(error) {
            errorMessage.message = "Could not update shelter. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // adds the user with the parameter userId to the shelter with the parameter shelterId.
    // return the updated shelter if the user is successfully added to the shelter. otherwise, return an error
    function addUserToShelter(req, res) {
        var shelterId = req.params["shelterId"];
        var userId = req.params["userId"];
        var errorMessage = {};

        shelterModel
            .pushUser(shelterId, userId)
            .then(pushUserSuccess, pushUserError)
            .then(findShelterByIdSuccess, findShelterByIdError);

        // if the user was added to the shelter successfully, then find the shelter to return
        function pushUserSuccess(numUpdated) {
            return shelterModel.findShelterById(shelterId);
        }

        // an error occurred so return an error to the client
        function pushUserError(error) {
            throw new Error("Could not update shelter at this time. Please try again later.");
        }

        // if the shelter comes back, then send the shelter back to the client. otherwise, an error occurred
        function findShelterByIdSuccess(shelter) {
            if (shelter) {
                res.json(shelter);
            } else {
                errorMessage.message = "Could not update shelter at this time. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // an error occurred to return an error to the client
        function findShelterByIdError(error) {
            errorMessage.message = "Could not update shelter at this time. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the user with the parameter userId from the shelter with the parameters shelterId.
    // return the updated shelter if the user is successfully removed from the shelter. otherwise, return an error
    function removeUserFromShelter(req, res) {
        var shelterId = req.params["shelterId"];
        var userId = req.params["userId"];
        var errorMessage = {};

        shelterModel
            .pullUser(shelterId, userId)
            .then(pullUserSuccess, pullUserError)
            .then(findShelterByIdSuccess, findShelterByIdError);

        // if the user was added to the shelter successfully, then find the shelter to return
        function pullUserSuccess(numUpdated) {
            return shelterModel.findShelterById(shelterId);
        }

        // an error occurred so return an error to the client
        function pullUserError(error) {
            throw new Error("Could not update shelter at this time. Please try again later.");
        }

        // if the shelter comes back, then send the shelter back to the client. otherwise, an error occurred
        function findShelterByIdSuccess(shelter) {
            if (shelter) {
                res.json(shelter);
            } else {
                errorMessage.message = "Could not update shelter at this time. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // an error occurred to return an error to the client
        function findShelterByIdError(error) {
            errorMessage.message = "Could not update shelter at this time. Please try again later.";
            res.status(500).json(errorMessage);
        }

    }

    // removes the shelter from the database whose _id matches the shelterId parameter.
    // return true if the shelter is successfully deleted, otherwise return an error.
    function deleteShelter(req, res) {
        var shelterId = req.params["shelterId"];
        var errorMessage = {};

        // try to delete the shelter from the database
        shelterModel
            .deleteShelter(shelterId)
            .then(deleteShelterSuccess, deleteShelterError);

        // if deletion is successful, then return true. otherwise, the shelter wasn't found
        function deleteShelterSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "Shelter with id " + shelterId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function deleteShelterError(error) {
            errorMessage.message = "Could not delete shelter. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }
};