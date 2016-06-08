module.exports = function(mongoose) {
    var WebsiteSchema = require("./website.schema.server.js")();
    var Website = mongoose.model("Website", WebsiteSchema);

    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
    };
    return api;

    // Creates a new website instance for user whose _id is userId
    function createWebsiteForUser(userId, website) {
        return User.findById(userId)
            .then(
                function(user) {
                    user.websites.push(website);
                    return user.save();
                }
            );
    }

    // Retrieves all website instances for user whose  _id is userId
    function findAllWebsitesForUser(userId) {
        return User.findById(userId).select("websites");
    }

    // Retrieves single website instance whose _id is websiteId
    function findWebsiteById(websiteId) {
        return Website.findById(websiteId);
    }

    // Updates website instance whose _id is websiteId
    function updateWebsite(websiteId, website) {
        var deferred = q.defer();
        Website
            .update(
                { _id: websiteId },
                { $set: website },
                function(err, numUpdated) {
                    if (!err) {
                        deferred.resolve(numUpdated);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }

    // Removes website instance whose _id is websiteId
    function deleteWebsite(websiteId) {
        var deferred = q.defer();
        Website
            .remove(
                { _id: websiteId },
                function(err, numDeleted) {
                    if (!err) {
                        deferred.resolve(numDeleted);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }
};