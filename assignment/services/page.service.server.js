module.exports = function(app) {

    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456" },
        { "_id": "432", "name": "Post 2", "websiteId": "456" },
        { "_id": "543", "name": "Post 3", "websiteId": "456" }
    ];

    // declare the API
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    // adds the page body parameter instance to the local pages array.
    // return the page if creation was successful, otherwise return an error.
    function createPage(req, res) {
        var websiteId = req.params["websiteId"];
        var page = req.body;
        var errorMessage = {};

        // first check for validation errors
        if (!websiteId) {
            errorMessage.message = "A websiteId is required.";
            res.status(400).json(errorMessage);
            return;
        } else if (!page.name) {
            errorMessage.message = "A page name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        page["_id"] = (new Date()).getTime().toString();
        page["websiteId"] = websiteId;
        pages.push(page);
        res.json(page);
    }

    // retrieves the pages in local pages array whose websiteId
    // matches the parameter websiteId
    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params["websiteId"];
        var sitePages = [];
        for (var i in pages) {
            if (pages[i]['websiteId'] === websiteId) {
                sitePages.push(pages[i]);
            }
        }
        res.json(sitePages);
    }

    // retrieves the page in local pages array whose _id matches
    // the pageId parameter. return an error if the page cannot be found.
    function findPageById(req, res) {
        var pageId = req.params["pageId"];
        for (var i in pages) {
            if (pages[i]['_id'] === pageId) {
                // the page was found so return the page
                res.json(pages[i]);
                return;
            }
        }
        // the page could not be found so return an error
        var errorMessage = {
            message: "Page with id " + pageId + " was not found."
        };
        res.status(404).json(errorMessage);
    }

    // updates the page in local pages array whose _id matches
    // the pageId parameter
    // return the updated page if successful, otherwise return an error
    function updatePage(req, res) {
        var pageId = req.params["pageId"];
        var page = req.body;
        var errorMessage = {};

        if (!page.name) {
            errorMessage.message = "A page name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        for (var i in pages) {
            if (pages[i]['_id'] === pageId) {
                // page was found so update and return the page
                pages[i] = page;
                res.json(page);
                return;
            }
        }
        // page was not found so return an error
        errorMessage.message = "Page with id " + pageId + " was not found.";
        res.status(404).json(errorMessage);
    }

    // removes the page from local pages array whose _id matches
    // the pageId parameter.
    // return true if the page is successfully deleted, otherwise return an error.
    function deletePage(req, res) {
        var pageId = req.params["pageId"];
        for (var i in pages) {
            if (pages[i]['_id'] === pageId) {
                // page was found so delete page and return true
                pages.splice(i, 1);
                res.send(true);
                return;
            }
        }
        // page was not found so return an error
        var errorMessage = {
            message: "Page with id " + pageId + " was not found."
        };
        res.status(404).send(errorMessage);
    }
};