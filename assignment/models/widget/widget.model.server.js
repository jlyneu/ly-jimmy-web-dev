module.exports = function(mongoose) {

    var WidgetSchema = require("./widget.schema.server.js")(mongoose);
    var Widget = mongoose.model("Widget", WidgetSchema);

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget
    };
    return api;

    // Creates a new widget instance for page whose _id is pageId
    function createWidget(pageId, widget) {
        widget._page = pageId;
        return Widget.create(widget);
    }

    // Retrieves all widget instances for page whose _id is pageId
    function findAllWidgetsForPage(pageId) {
        return Widget.find({ _page: pageId });
    }

    // Retrieves single widget instance whose _id is widgetId
    function findWidgetById(widgetId) {
        return Widget.findById(widgetId);
    }

    // Updates widget instance whose _id is widgetId
    function updateWidget(widgetId, widget) {
        // don't update _id, type, or dateCreated
        delete widget._id;
        delete widget.type;
        delete widget.dateCreated;
        // do update the dateUpdated time
        widget.dateUpdated = Date.now();

        return Widget.update(
            { _id: widgetId },
            { $set: widget }
        );
    }

    // Removes widget instance whose _id is widgetId
    function deleteWidget(widgetId) {
        return Widget.remove({ _id: widgetId });
    }
};