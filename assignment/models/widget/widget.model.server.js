module.exports = function(mongoose, pageModel) {

    var q = require("q");
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
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var newWidget;

        // create the widget in the db, push the widget id to the page's widgets array,
        // then resolve the promise with the newly created widget
        Widget
            .create(widget)
            .then(pushWidgetForPage,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the widget creation is successful, then push the widget id onto the page's widgets array
        function pushWidgetForPage(widget) {
            newWidget = widget;
            return pageModel.pushWidget(pageId, newWidget._id);
        }

        // if the widget id is successfully pushed onto the page's widgets array then resolve the promise
        // with the newly created widget
        function resolvePromise(numUpdated) {
            deferred.resolve(newWidget);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }
    }

    // Retrieves all widget instances for page whose _id is pageId
    function findAllWidgetsForPage(pageId) {
        var deferred = q.defer();
        pageModel
            .findPageById(pageId)
            .populate("widgets")
            .exec(resolvePromise);

        return deferred.promise;

        function resolvePromise(err, page) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(page.widgets);
            }
        }
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

        // originally had `$set: widget` after deleting widget._id, but the remote mongo instance was
        // throwing the error `Mod on _id not allowed`, so here we are explicitly setting fields.
        // the `|| null` is there since Mongoose cannot cast undefined to number types, etc.
        return Widget.update(
            { _id: widgetId },
            { $set:
                {
                    name: widget.name || null,
                    text: widget.text || null,
                    placeholder: widget.placeholder || null,
                    description: widget.description || null,
                    url: widget.url || null,
                    width: widget.width || null,
                    height: widget.height || null,
                    rows: widget.rows || null,
                    size: widget.size || null,
                    class: widget.class || null,
                    icon: widget.icon || null,
                    deletable: widget.deletable || null,
                    formatted: widget.formatted || null,
                    dateUpdated: widget.dateUpdated || null
                }
            }
        );
    }

    // Removes widget instance whose _id is widgetId
    function deleteWidget(widgetId) {
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var errorMessage = {};
        var numDeleted;
        var widgetObj;

        // find the widget by id to determine the parent page, then
        // remove the widget from the database, then remove the widget id
        // from teh page's widgets array, then resolve the promise with
        // the number of widgets deleted
        Widget
            .findById(widgetId)
            .then(removeWidget,rejectError)
            .then(pullWidgetFromPage,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the widget is successfully found, then remove the widget from the db
        function removeWidget(widget) {
            if (widget) {
                widgetObj = widget;
                return Widget.remove({ _id: widgetId });
            } else {
                errorMessage.message = "Could not find widget with id" + widgetId;
                throw new Error(errorMessage);
            }
        }

        // if the widget is successfully removed from the db, then remove the widget id from the
        // page's array of widget ids
        function pullWidgetFromPage(deleted) {
            // make sure a widget was actually found and deleted
            if (deleted) {
                numDeleted = deleted;
                return pageModel.pullWidget(widgetObj._page, widgetId);
            } else {
                errorMessage.message = "Could not find widget with id" + widgetId;
                throw new Error(errorMessage);
            }
        }

        // if the widget id is successfully removed from the page array of widget ids, then resolve
        // the promise with the number of widgets deleted.
        function resolvePromise(numUpdated) {
            deferred.resolve(numDeleted);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }
    }
};