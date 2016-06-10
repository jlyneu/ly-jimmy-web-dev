module.exports = function(mongoose, userModel) {

    var q = require("q");
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
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var newWebsite;

        // create the website in the db, push the website id to the user's websites array,
        // then resolve the promise with the newly created website
        Website
            .create(website)
            .then(pushWebsiteForUser,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the website creation is successful, then push the user id onto the user's websites array
        function pushWebsiteForUser(website) {
            newWebsite = website;
            return userModel.pushWebsite(userId, newWebsite._id);
        }

        // if the website id is successfully pushed onto the user's websites array then resolve the promise
        // with the newly created website
        function resolvePromise(numUpdated) {
            deferred.resolve(newWebsite);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }

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
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var errorMessage = {};
        var numDeleted;
        var websiteObj;
        Website
            .findById(websiteId)
            .then(removeWebsite,rejectError)
            .then(pullWebsiteFromUser,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the website is successfully found, then remove the website from the db
        function removeWebsite(website) {
            if (website) {
                websiteObj = website;
                return Website.remove({ _id: websiteId });
            } else {
                errorMessage.message = "Could not find website with id" + websiteId;
                throw new Error(errorMessage);
            }
        }

        // if the website is successfully removed from the db, then remove the website id from the
        // user's array of website ids
        function pullWebsiteFromUser(deleted) {
            // make sure a website was actually found and deleted
            if (deleted) {
                numDeleted = deleted;
                return userModel.pullWebsite(websiteObj._user, websiteId);
            } else {
                errorMessage.message = "Could not find website with id" + websiteId;
                throw new Error(errorMessage);
            }
        }

        // if the website id is successfully removed from the user array of website ids, then resolve
        // the promise with the number of websites deleted.
        function resolvePromise(numUpdated) {
            deferred.resolve(numDeleted);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }
    }
};