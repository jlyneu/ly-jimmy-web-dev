(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService() {
        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456" },
            { "_id": "234", "name": "Tweeter",     "developerId": "456" },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456" },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123" },
            { "_id": "678", "name": "Checkers",    "developerId": "123" },
            { "_id": "789", "name": "Chess",       "developerId": "234" }
        ];
        var api = {
            "createWebsite"      : "createWebsite",
            "findWebsitesByUser" : "findWebsitesByUser",
            "findWebsiteById"    : "findWebsiteById",
            "updateWebsite"      : "updateWebsite",
            "deleteWebsite"      : "deleteWebsite"
        };
        return api;

        // adds the website parameter instance to the local websites array.
        // The new website's developerId is set to the userId parameter
        function createWebsite(userId, website) {
            website["developerId"] = userId;
            websites.append(website);
        }

        // retrieves the websites in local websites array whose developerId
        // matches the parameter userId
        function findWebsitesByUser(userId) {
            for (var i in websites) {
                if (websites[i]['developerId'] === userId) {
                    return websites[i];
                }
            }
        }

        // retrieves the website in local websites array whose _id matches
        // the websiteId parameter
        function findWebsiteById(websiteId) {
            for (var i in websites) {
                if (websites[i]['_id'] === websiteId) {
                    return websites[i];
                }
            }
        }

        // updates the website in local websites array whose _id matches
        // the websiteId parameter
        function updateWebsite(websiteId, website) {
            for (var i in websites) {
                if (websites[i]['_id'] === websiteId) {
                    websites[i] = website;
                }
            }
        }

        // removes the website from local websites array whose _id matches
        // the websiteId parameter
        function deleteWebsite(websiteId) {
            for (var i in websites) {
                if (websites[i]['_id'] === userId) {
                    websites.splice(i, 1);
                    return;
                }
            }
        }
    }
})();