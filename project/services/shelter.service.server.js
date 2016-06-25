module.exports = function(app, models) {

    // declare the API
    app.post("/api/petshelter/user/:userId/shelter", createShelter);
    app.get("/api/petshelter/user/:userId/shelter", findAllSheltersForUser);
    app.get("/api/petshelter/shelter/:shelterId", findShelterById);
    app.put("/api/petshelter/shelter/:shelterId", updateShelter);
    app.delete("/api/petshelter/shelter/:shelterId", deleteShelter);

    var shelterModel = models.shelterModel;

    // adds the shelter body parameter instance to the local shelters array.
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
            console.log(error);
            errorMessage.message = "Could not create shelter. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the shelters in local shelters array whose userId
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

    // retrieves the shelter in local shelters array whose _id matches
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

    // updates the shelter in local shelters array whose _id matches
    // the shelterId parameter
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

    // removes the shelter from local shelters array whose _id matches
    // the shelterId parameter.
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