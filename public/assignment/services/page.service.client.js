(function() {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);
    function PageService() {
        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456" },
            { "_id": "432", "name": "Post 2", "websiteId": "456" },
            { "_id": "543", "name": "Post 3", "websiteId": "456" }
        ];
        var api = {
            "createPage"          : createPage,
            "findPageByWebsiteId" : findPageByWebsiteId,
            "findPageById"        : findPageById,
            "updatePage"          : updatePage,
            "deletePage"          : deletePage
        };
        return api;

        // adds the page parameter instance to the local pages array.
        // The new page's websiteId is set to the websiteId parameter
        function createPage(websiteId, page) {
            pages["websiteId"] = websiteId;
            pages.append(page);
        }

        // retrieves the pages in local pages array whose websiteId
        // matches the parameter websiteId
        function findPageByWebsiteId(websiteId) {
            for (var i in pages) {
                if (pages[i]['websiteId'] === websiteId) {
                    return pages[i];
                }
            }
        }

        // retrieves the page in local pages array whose _id matches
        // the pageId parameter
        function findPageById(pageId) {
            for (var i in pages) {
                if (pages[i]['_id'] === pageId) {
                    return pages[i];
                }
            }
        }

        // updates the page in local pages array whose _id matches
        // the pageId parameter
        function updatePage(pageId, page) {
            for (var i in pages) {
                if (pages[i]['_id'] === pageId) {
                    pages[i] = page;
                }
            }
        }

        // removes the page from local pages array whose _id matches
        // the pageId parameter
        function deletePage(pageId) {
            for (var i in pages) {
                if (pages[i]['_id'] === pageId) {
                    pages.splice(i, 1);
                    return;
                }
            }
        }
    }
})();