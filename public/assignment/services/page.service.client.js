(function() {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);
    function PageService($http) {
        var api = {
            "createPage"           : createPage,
            "findPagesByWebsiteId" : findPagesByWebsiteId,
            "findPageById"         : findPageById,
            "updatePage"           : updatePage,
            "deletePage"           : deletePage
        };
        return api;

        // return a promise for creating a page on the server. if the page was created
        // successfully, then the promise will resolve with the new page.
        // if the page was not created, the promise will resolve with an error.
        function createPage(websiteId, page) {
            var url = "/api/website/" + websiteId + "/page";
            return $http.post(url, page);
        }

        // return a promise for finding pages by the given user id. if the pages were found,
        // then the promise will resolve with the existing pages. if the pages were not
        // found, then the promise will resolve with an error.
        function findPagesByWebsiteId(websiteId) {
            var url = "/api/website/" + websiteId + "/page";
            return $http.get(url);
        }

        // return a promise for finding a page by the given id. if the page was found,
        // then the promise will resolve with the existing page. if the page was not
        // found, then the promise will resolve with an error.
        function findPageById(pageId) {
            var url = "/api/page/" + pageId;
            return $http.get(url);
        }

        // return a promise for updating the given page on the server. if the page was updated
        // successfully, then the promise will resolve with the updated page. if the page was not
        // updated, then the promise will resolve with an error.
        function updatePage(pageId, page) {
            var url = "/api/page/" + pageId;
            return $http.put(url, page);
        }

        // return a promise for deleting the given page on the server. if the page was deleted
        // successfully, then the promise will resolve with 'true'. if the page was not
        // deleted, then the promise will resolve with an error.
        function deletePage(pageId) {
            var url = "/api/page/" + pageId;
            return $http.delete(url);
        }
    }
})();