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
            website["_id"] = (new Date()).getTime().toString();
            website["developerId"] = userId;
            websites.push(website);
            return website;
        }

        // retrieves the websites in local websites array whose developerId
        // matches the parameter userId
        function findWebsitesByUser(userId) {
            userSites = [];
            for (var i in websites) {
                if (websites[i]['developerId'] === userId) {
                    userSites.push(websites[i]);
                }
            }
            return userSites;
        }

        // retrieves the website in local websites array whose _id matches
        // the websiteId parameter
        function findWebsiteById(websiteId) {
            for (var i in websites) {
                if (websites[i]['_id'] === websiteId) {
                    return websites[i];
                }
            }
            return null;
        }

        // updates the website in local websites array whose _id matches
        // the websiteId parameter
        // return the updated website if successful, otherwise return null.
        function updateWebsite(websiteId, website) {
            for (var i in websites) {
                if (websites[i]['_id'] === websiteId) {
                    websites[i] = website;
                    return website;
                }
            }
            return null;
        }

        // removes the website from local websites array whose _id matches
        // the websiteId parameter.
        // return true if the website is successfully deleted, otherwise return null.
        function deleteWebsite(websiteId) {
            for (var i in websites) {
                if (websites[i]['_id'] === websiteId) {
                    websites.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    }
})();