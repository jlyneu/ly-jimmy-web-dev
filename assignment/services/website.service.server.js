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

    function createWebsite(req, res) {
        var userId = req.params['userId'];
        var website = req.body;
        website["_id"] = (new Date()).getTime().toString();
        website["developerId"] = userId;
        websites.push(website);
        res.json(website);
    }

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

    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];
        for (var i in websites) {
            if (websites[i]['_id'] === websiteId) {
                res.json(websites[i]);
                return;
            }
        }
        res.json({});
    }

    function updateWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        var website = req.body;

        for (var i in websites) {
            if (websites[i]['_id'] === websiteId) {
                websites[i] = website;
                res.json(website);
                return;
            }
        }
        res.json({});
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        for (var i in websites) {
            if (websites[i]['_id'] === websiteId) {
                websites.splice(i, 1);
                res.send(true);
                return;
            }
        }
        res.send(false);
    }
};