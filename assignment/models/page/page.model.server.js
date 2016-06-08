module.exports = function(mongoose) {

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
        return Page.create(page);
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
        return Page.remove({ _id: pageId });
    }
};