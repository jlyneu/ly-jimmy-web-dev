module.exports = function(app, models) {

    // declare the API
    app.post("/api/petshelter/user/:userId/messagethread", createMessagethread);
    app.get("/api/petshelter/user/:userId/messagethread", findAllMessagethreadsForUser);
    app.get("/api/petshelter/messagethread/:messagethreadId", findMessagethreadById);
    app.put("/api/petshelter/messagethread/:messagethreadId", updateMessagethread);
    app.delete("/api/petshelter/messagethread/:messagethreadId", deleteMessagethread);

    var shelterModel = models.shelterModel;
    var messagethreadModel = models.messagethreadModel;

    // adds the messagethread body parameter instance to the database.
    // return the messagethread if creation was successful, otherwise return an error.
    function createMessagethread(req, res) {
        var userId = req.params["userId"];
        var messagethread = req.body;
        var errorMessage = {};

        // first check for validation errors
        if (!userId) {
            errorMessage._user = "A userId is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to create the messagethread in the database
        messagethreadModel
            .createMessagethread(userId, messagethread)
            .then(createMessagethreadSuccess, createMessagethreadError);

        // if the messagethread creation is successful, then return the new messagethread
        function createMessagethreadSuccess(newMessagethread) {
            if (newMessagethread) {
                res.json(newMessagethread);
            } else {
                errorMessage.message = "Could not create messagethread. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function createMessagethreadError(error) {
            errorMessage.message = "Could not create messagethread. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the messagethreads in the database whose userId matches the parameter userId
    function findAllMessagethreadsForUser(req, res) {
        var userId = req.params["userId"];
        var errorMessage = {};
        var results = [];

        // try to find the messagethreads in the database
        messagethreadModel
            .findAllMessagethreadsForUser(userId)
            .then(findAllMessagethreadsForUserSuccess, findAllMessagethreadsForUserError)
            .then(findAllSheltersForUserSuccess, findAllSheltersForUserError);

        // add the messagethreads for the user, then look for shelters for the user
        // to find messagethreads associated with those shelters. otherwise, something went wrong
        function findAllMessagethreadsForUserSuccess(messagethreads) {
            if (messagethreads) {
                results = results.concat(messagethreads);

                return shelterModel.findAllSheltersForUser(userId);
            } else {
                throw new Error("Could not fetch messagethreads. Please try again later.");
            }
        }

        // if an error occurred, then throw an error
        function findAllMessagethreadsForUserError(error) {
            throw new Error("Could not fetch messagethreads. Please try again later.");
        }

        // if shelters were returned, then get message threads for the returned shelters
        function findAllSheltersForUserSuccess(shelters) {
            if (shelters) {
                var shelterIds = [];
                for (var i = 0; i < shelters.length; i++) {
                    shelterIds.push(shelters[i]._id);
                }
                messagethreadModel
                    .findAllMessagethreadsForShelters(shelterIds)
                    .then(findAllMessagethreadsForSheltersSuccess, findAllMessagethreadsForSheltersError);
            } else {
                return res.json(results);
            }
        }

        // an error occurred so return an error
        function findAllSheltersForUserError(error) {
            errorMessage.message = "Could not fetch messagethreads. Please try again later.";
            res.status(500).json(errorMessage);
        }

        // append messagethreads from shelters and send list of messagethreads back to client
        function findAllMessagethreadsForSheltersSuccess(messagethreads) {
            res.json(results.concat(messagethreads));
        }

        // an error occurred so return an error
        function findAllMessagethreadsForSheltersError(error) {
            errorMessage.message = "Could not fetch messagethreads. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the messagethread in database whose _id matches
    // the messagethreadId parameter. return an error if the messagethread cannot be found.
    function findMessagethreadById(req, res) {
        var messagethreadId = req.params["messagethreadId"];
        var errorMessage = {};

        // try to find the messagethread in the database
        messagethreadModel
            .findMessagethreadById(messagethreadId)
            .then(findMessagethreadByIdSuccess, findMessagethreadByIdError);

        // return the messagethread from the model. otherwise, the messagethread wasn't found
        function findMessagethreadByIdSuccess(messagethread) {
            if (messagethread) {
                res.json(messagethread);
            } else {
                errorMessage.message = "Messagethread with id " + messagethreadId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findMessagethreadByIdError(error) {
            errorMessage.message = "Could not fetch messagethread. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // updates the messagethread in the database whose _id matches the messagethreadId parameter
    // return the updated messagethread if successful, otherwise return an error
    function updateMessagethread(req, res) {
        var messagethreadId = req.params["messagethreadId"];
        var messagethread = req.body;
        var errorMessage = {};

        if (!messagethread.name) {
            errorMessage.message = "A messagethread name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to update the messagethread in the database
        messagethreadModel
            .updateMessagethread(messagethreadId, messagethread)
            .then(updateMessagethreadSuccess, updateMessagethreadError);

        // return the messagethread if update successful. otherwise the messagethread wasn't found
        function updateMessagethreadSuccess(numUpdated) {
            if (numUpdated) {
                res.json(messagethread);
            } else {
                errorMessage.message = "Messagethread with id " + messagethreadId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function updateMessagethreadError(error) {
            errorMessage.message = "Could not update messagethread. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the messagethread from the database whose _id matches the messagethreadId parameter.
    // return true if the messagethread is successfully deleted, otherwise return an error.
    function deleteMessagethread(req, res) {
        var messagethreadId = req.params["messagethreadId"];
        var errorMessage = {};

        // try to delete the messagethread from the database
        messagethreadModel
            .deleteMessagethread(messagethreadId)
            .then(deleteMessagethreadSuccess, deleteMessagethreadError);

        // if deletion is successful, then return true. otherwise, the messagethread wasn't found
        function deleteMessagethreadSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "Messagethread with id " + messagethreadId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function deleteMessagethreadError(error) {
            errorMessage.message = "Could not delete messagethread. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }
};