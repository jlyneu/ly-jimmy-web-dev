module.exports = function(mongoose, websiteModel) {

    var q = require("q");
    var PageSchema = require("./page.schema.server.js")(mongoose);
    var Page = mongoose.model("Page", PageSchema);

    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage
    };
    return api;

    // Creates a new page instance for website whose _id is websiteId
    function createPage(websiteId, page) {
        page._website = websiteId;
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var newPage;

        // create the page in the db, push the page id to the website's pages array,
        // then resolve the promise with the newly created page
        Page
            .create(page)
            .then(pushPageForWebsite,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the page creation is successful, then push the page id onto the website's pages array
        function pushPageForWebsite(page) {
            newPage = page;
            return websiteModel.pushPage(websiteId, newPage._id);
        }

        // if the page id is successfully pushed onto the website's pages array then resolve the promise
        // with the newly created page
        function resolvePromise(numUpdated) {
            deferred.resolve(newPage);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }
    }

    // Retrieves all page instances for website whose _id is websiteId
    function findAllPagesForWebsite(websiteId) {
        return Page.find({ _website: websiteId });
    }

    // Retrieves single page instance whose _id is pageId
    function findPageById(pageId) {
        return Page.findById(pageId);
    }

    // Updates page instance whose _id is pageId
    function updatePage(pageId, page) {
        return Page.update(
            { _id: pageId },
            { $set:
                {
                    name: page.name,
                    title: page.title,
                    dateUpdated: Date.now()
                }
            }
        );
    }

    // Removes page instance whose _id is pageId
    function deletePage(pageId) {
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var errorMessage = {};
        var numDeleted;
        var pageObj;

        // find the page by id to determine the parent website, then
        // remove the page from the database, then remove the page id
        // from teh website's pages array, then resolve the promise with
        // the number of pages deleted
        Page
            .findById(pageId)
            .then(removePage,rejectError)
            .then(pullPageFromWebsite,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the page is successfully found, then remove the page from the db
        function removePage(page) {
            if (page) {
                pageObj = page;
                return Page.remove({ _id: pageId });
            } else {
                errorMessage.message = "Could not find page with id" + pageId;
                throw new Error(errorMessage);
            }
        }

        // if the page is successfully removed from the db, then remove the page id from the
        // website's array of page ids
        function pullPageFromWebsite(deleted) {
            // make sure a page was actually found and deleted
            if (deleted) {
                numDeleted = deleted;
                return websiteModel.pullPage(pageObj._website, pageId);
            } else {
                errorMessage.message = "Could not find page with id" + pageId;
                throw new Error(errorMessage);
            }
        }

        // if the page id is successfully removed from the website array of page ids, then resolve
        // the promise with the number of pages deleted.
        function resolvePromise(numUpdated) {
            deferred.resolve(numDeleted);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }
    }
};