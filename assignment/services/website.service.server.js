module.exports = function(app, models) {

    // declare the API
    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    var websiteModel = models.websiteModel;

    // adds the website body parameter instance to the local websites array.
    // return the website if creation was successful, otherwise return an error.
    function createWebsite(req, res) {
        var userId = req.params['userId'];
        var website = req.body;
        var errorMessage = {};

        // first check for validation errors
        if (!userId) {
            errorMessage.message = "A userId is required.";
            res.status(400).json(errorMessage);
            return;
        } else if (!website.name) {
            errorMessage.message = "A website name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to create the website in the database
        websiteModel
            .createWebsiteForUser(userId, website)
            .then(createWebsiteForUserSuccess, createWebsiteForUserError);

        // if the website creation is successful, then return the new website
        function createWebsiteForUserSuccess(newWebsite) {
            if (newWebsite) {
                res.json(newWebsite);
            } else {
                errorMessage.message = "Could not create website. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function createWebsiteForUserError(error) {
            errorMessage.message = "Could not create website. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the websites in local websites array whose developerId
    // matches the parameter userId
    function findAllWebsitesForUser(req, res) {
        var userId = req.params['userId'];
        var errorMessage = {};

        // try to find the websites in the database
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(findAllWebsitesForUserSuccess, findAllWebsitesForUserError);

        // return the websites from the model. otherwise, something went wrong
        function findAllWebsitesForUserSuccess(websites) {
            if (websites) {
                res.json(websites);
            } else {
                errorMessage.message = "Could not fetch websites. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findAllWebsitesForUserError(error) {
            errorMessage.message = "Could not fetch websites. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the website in local websites array whose _id matches
    // the websiteId parameter. return an error if the website cannot be found.
    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];
        var errorMessage = {};

        // try to find the website in the database
        websiteModel
            .findWebsiteById(websiteId)
            .then(findWebsiteByIdSuccess, findWebsiteByIdError);

        // return the website from the model. otherwise, the website wasn't found
        function findWebsiteByIdSuccess(website) {
            if (website) {
                res.json(website);
            } else {
                errorMessage.message = "Website with id " + websiteId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findWebsiteByIdError(error) {
            errorMessage.message = "Could not fetch website. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // updates the website in local websites array whose _id matches
    // the websiteId parameter
    // return the updated website if successful, otherwise return an error
    function updateWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        var website = req.body;
        var errorMessage = {};

        if (!website.name) {
            errorMessage.message = "A website name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to update the website in the database
        websiteModel
            .updateWebsite(websiteId, website)
            .then(updateWebsiteSuccess, updateWebsiteError);

        // return the website if update successful. otherwise the website wasn't found
        function updateWebsiteSuccess(numUpdated) {
            if (numUpdated) {
                res.json(website);
            } else {
                errorMessage.message = "Website with id " + websiteId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function updateWebsiteError(error) {
            errorMessage.message = "Could not update website. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the website from local websites array whose _id matches
    // the websiteId parameter.
    // return true if the website is successfully deleted, otherwise return an error.
    function deleteWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        var errorMessage = {};

        // try to delete the website from the database
        websiteModel
            .deleteWebsite(websiteId)
            .then(deleteWebsiteSuccess, deleteWebsiteError);

        // if deletion is successful, then return true. otherwise, the website wasn't found
        function deleteWebsiteSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "Website with id " + websiteId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function deleteWebsiteError(error) {
            errorMessage.message = "Could not delete website. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }
};