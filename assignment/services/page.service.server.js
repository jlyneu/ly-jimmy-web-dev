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

    function createPage(req, res) {
        var websiteId = req.params["websiteId"];
        var page = req.body;
        page["_id"] = (new Date()).getTime().toString();
        page["websiteId"] = websiteId;
        pages.push(page);
        res.json(page);
    }

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

    function findPageById(req, res) {
        var pageId = req.params["pageId"];
        for (var i in pages) {
            if (pages[i]['_id'] === pageId) {
                res.json(pages[i]);
                return;
            }
        }
        res.json({});
    }

    function updatePage(req, res) {
        var pageId = req.params["pageId"];
        var page = req.body;
        for (var i in pages) {
            if (pages[i]['_id'] === pageId) {
                pages[i] = page;
                res.json(page);
                return;
            }
        }
        res.json({});
    }

    function deletePage(req, res) {
        var pageId = req.params["pageId"];
        for (var i in pages) {
            if (pages[i]['_id'] === pageId) {
                pages.splice(i, 1);
                res.send(true);
                return;
            }
        }
        res.send(false);
    }
};