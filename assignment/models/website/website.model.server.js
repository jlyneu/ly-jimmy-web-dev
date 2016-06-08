module.exports = function(mongoose) {

    var WebsiteSchema = require("./website.schema.server.js")(mongoose);
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
        website._user = userId;
        return Website.create(website);
    }

    // Retrieves all website instances for user whose _id is userId
    function findAllWebsitesForUser(userId) {
        return Website.find({ _user: userId });
    }

    // Retrieves single website instance whose _id is websiteId
    function findWebsiteById(websiteId) {
        return Website.findById(websiteId);
    }

    // Updates website instance whose _id is websiteId
    function updateWebsite(websiteId, website) {
        return Website.update(
            { _id: websiteId },
            { $set:
                {
                    name: website.name,
                    description: website.description,
                    dateUpdated: Date.now()
                }
            }
        );
    }

    // Removes website instance whose _id is websiteId
    function deleteWebsite(websiteId) {
        return Website.remove({ _id: websiteId });
    }
};