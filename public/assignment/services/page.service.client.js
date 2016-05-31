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
            "createPage"           : createPage,
            "findPagesByWebsiteId" : findPagesByWebsiteId,
            "findPageById"         : findPageById,
            "updatePage"           : updatePage,
            "deletePage"           : deletePage
        };
        return api;

        // adds the page parameter instance to the local pages array.
        // The new page's websiteId is set to the websiteId parameter.
        // return the page if the creation is successful, otherwise return null.
        function createPage(websiteId, page) {
            page["_id"] = (new Date()).getTime().toString();
            page["websiteId"] = websiteId;
            pages.push(page);
            return page;
        }

        // retrieves the pages in local pages array whose websiteId
        // matches the parameter websiteId
        function findPagesByWebsiteId(websiteId) {
            sitePages = [];
            for (var i in pages) {
                if (pages[i]['websiteId'] === websiteId) {
                    sitePages.push(pages[i]);
                }
            }
            return sitePages;
        }

        // retrieves the page in local pages array whose _id matches
        // the pageId parameter
        function findPageById(pageId) {
            for (var i in pages) {
                if (pages[i]['_id'] === pageId) {
                    return pages[i];
                }
            }
            return null;
        }

        // updates the page in local pages array whose _id matches
        // the pageId parameter.
        // return the page if the update is successful, otherwise return null.
        function updatePage(pageId, page) {
            for (var i in pages) {
                if (pages[i]['_id'] === pageId) {
                    pages[i] = page;
                    return page;
                }
            }
            return null;
        }

        // removes the page from local pages array whose _id matches
        // the pageId parameter.
        // return true if the deletion is successful, otherwise return false.
        function deletePage(pageId) {
            for (var i in pages) {
                if (pages[i]['_id'] === pageId) {
                    pages.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    }
})();