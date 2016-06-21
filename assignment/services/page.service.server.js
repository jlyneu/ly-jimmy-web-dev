module.exports = function(app, models) {

    // declare the API
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    var pageModel = models.pageModel;

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

        // try to create the page in the database
        pageModel
            .createPage(websiteId, page)
            .then(createPageSuccess, createPageError);

        // if the page creation is successful, then return the new page
        function createPageSuccess(newPage) {
            if (newPage) {
                res.json(newPage);
            } else {
                errorMessage.message = "Could not create page. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function createPageError(error) {
            errorMessage.message = "Could not create page. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the pages in local pages array whose websiteId
    // matches the parameter websiteId
    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params["websiteId"];
        var errorMessage = {};

        // try to find the pages in the database
        pageModel
            .findAllPagesForWebsite(websiteId)
            .then(findAllPagesForWebsiteSuccess, findAllPagesForWebsiteError);

        // return the pages from the model. otherwise, something went wrong
        function findAllPagesForWebsiteSuccess(pages) {
            if (pages) {
                res.json(pages);
            } else {
                errorMessage.message = "Could not fetch pages. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findAllPagesForWebsiteError(error) {
            errorMessage.message = "Could not fetch pages. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the page in local pages array whose _id matches
    // the pageId parameter. return an error if the page cannot be found.
    function findPageById(req, res) {
        var pageId = req.params["pageId"];
        var errorMessage = {};

        // try to find the page in the database
        pageModel
            .findPageById(pageId)
            .then(findPageByIdSuccess, findPageByIdError);

        // return the page from the model. otherwise, the page wasn't found
        function findPageByIdSuccess(page) {
            if (page) {
                res.json(page);
            } else {
                errorMessage.message = "Page with id " + pageId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findPageByIdError(error) {
            errorMessage.message = "Could not fetch page. Please try again later.";
            res.status(500).json(errorMessage);
        }
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

        // try to update the page in the database
        pageModel
            .updatePage(pageId, page)
            .then(updatePageSuccess, updatePageError);

        // return the page if update successful. otherwise the page wasn't found
        function updatePageSuccess(numUpdated) {
            if (numUpdated) {
                res.json(page);
            } else {
                errorMessage.message = "Page with id " + pageId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function updatePageError(error) {
            errorMessage.message = "Could not update page. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the page from local pages array whose _id matches
    // the pageId parameter.
    // return true if the page is successfully deleted, otherwise return an error.
    function deletePage(req, res) {
        var pageId = req.params["pageId"];
        var errorMessage = {};

        // try to delete the page from the database
        pageModel
            .deletePage(pageId)
            .then(deletePageSuccess, deletePageError);

        // if deletion is successful, then return true. otherwise, the page wasn't found
        function deletePageSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "Page with id " + pageId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function deletePageError(error) {
            errorMessage.message = "Could not delete page. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }
};