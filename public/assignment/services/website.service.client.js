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

        // adds the website parameter instance to the local websites array.
        // The new website's developerId is set to the userId parameter.
        // Return the created widget if successful, otherwise return null.
        function createWebsite(userId, website) {
            var url = "/api/user/" + userId + "/website";
            return $http.post(url, website);
        }

        // retrieves the websites in local websites array whose developerId
        // matches the parameter userId
        function findWebsitesByUser(userId) {
            var url = "/api/user/" + userId + "/website";
            return $http.get(url);
        }

        // retrieves the website in local websites array whose _id matches
        // the websiteId parameter
        function findWebsiteById(websiteId) {
            var url = "/api/website/" + websiteId;
            return $http.get(url);
        }

        // updates the website in local websites array whose _id matches
        // the websiteId parameter
        // return the updated website if successful, otherwise return null.
        function updateWebsite(websiteId, website) {
            var url = "/api/website/" + websiteId;
            return $http.put(url, website);
        }

        // removes the website from local websites array whose _id matches
        // the websiteId parameter.
        // return true if the website is successfully deleted, otherwise return null.
        function deleteWebsite(websiteId) {
            var url = "/api/website/" + websiteId;
            return $http.delete(url);
        }
    }
})();