module.exports = function(app) {

    var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456" },
        { "_id": "234", "name": "Tweeter",     "developerId": "456" },
        { "_id": "456", "name": "Gizmodo",     "developerId": "456" },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123" },
        { "_id": "678", "name": "Checkers",    "developerId": "123" },
        { "_id": "789", "name": "Chess",       "developerId": "234" }
    ];

    // declare the API
    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

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

        website["_id"] = (new Date()).getTime().toString();
        website["developerId"] = userId;
        websites.push(website);
        res.json(website);
    }

    // retrieves the websites in local websites array whose developerId
    // matches the parameter userId
    function findAllWebsitesForUser(req, res) {
        var userId = req.params['userId'];
        userSites = [];
        for (var i in websites) {
            if (websites[i]['developerId'] === userId) {
                userSites.push(websites[i]);
            }
        }
        res.json(userSites);
    }

    // retrieves the website in local websites array whose _id matches
    // the websiteId parameter. return an error if the website cannot be found.
    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];
        for (var i in websites) {
            if (websites[i]['_id'] === websiteId) {
                // the website was found so return the website
                res.json(websites[i]);
                return;
            }
        }
        // the website could not be found so return an error
        var errorMessage = {
            message: "Website with id " + websiteId + " was not found."
        };
        res.status(404).json(errorMessage);
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

        for (var i in websites) {
            if (websites[i]['_id'] === websiteId) {
                // website was found so update and return the website
                websites[i] = website;
                res.json(website);
                return;
            }
        }
        // website was not found so return an error
        errorMessage.message = "Website with id " + websiteId + " was not found.";
        res.status(404).json(errorMessage);
    }

    // removes the website from local websites array whose _id matches
    // the websiteId parameter.
    // return true if the website is successfully deleted, otherwise return an error.
    function deleteWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        for (var i in websites) {
            if (websites[i]['_id'] === websiteId) {
                // website was found so delete website and return true
                websites.splice(i, 1);
                res.send(true);
                return;
            }
        }
        // website was not found so return an error
        var errorMessage = {
            message: "Website with id " + websiteId + " was not found."
        };
        res.status(404).send(errorMessage);
    }
};