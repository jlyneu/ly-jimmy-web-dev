(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService($http) {
        var api = {
            "createWebsite"      : createWebsite,
            "findWebsitesByUser" : findWebsitesByUser,
            "findWebsiteById"    : findWebsiteById,
            "updateWebsite"      : updateWebsite,
            "deleteWebsite"      : deleteWebsite
        };
        return api;

        // return a promise for creating a website on the server. if the website was created
        // successfully, then the promise will resolve with the new website.
        // if the website was not created, the promise will resolve with an error.
        function createWebsite(userId, website) {
            var url = "/api/user/" + userId + "/website";
            return $http.post(url, website);
        }

        // return a promise for finding websites by the given user id. if the websites were found,
        // then the promise will resolve with the existing websites. if the websites were not
        // found, then the promise will resolve with an error.
        function findWebsitesByUser(userId) {
            var url = "/api/user/" + userId + "/website";
            return $http.get(url);
        }

        // return a promise for finding a website by the given id. if the website was found,
        // then the promise will resolve with the existing website. if the website was not
        // found, then the promise will resolve with an error.
        function findWebsiteById(websiteId) {
            var url = "/api/website/" + websiteId;
            return $http.get(url);
        }

        // return a promise for updating the given website on the server. if the website was updated
        // successfully, then the promise will resolve with the updated website. if the website was not
        // updated, then the promise will resolve with an error.
        function updateWebsite(websiteId, website) {
            var url = "/api/website/" + websiteId;
            return $http.put(url, website);
        }

        // return a promise for deleting the given website on the server. if the website was deleted
        // successfully, then the promise will resolve with 'true'. if the website was not
        // deleted, then the promise will resolve with an error.
        function deleteWebsite(websiteId) {
            var url = "/api/website/" + websiteId;
            return $http.delete(url);
        }
    }
})();