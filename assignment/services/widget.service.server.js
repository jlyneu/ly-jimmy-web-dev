module.exports = function(app, models) {

    var multer = require('multer');
    var upload = multer({ dest: __dirname + '/../../public/uploads' });
    var pageModel = models.pageModel;
    var widgetModel = models.widgetModel;

    // declare the API
    app.post("/api/upload", upload.single("myFile"), uploadImage);
    app.put("/api/page/:pageId/widget", reorderWidget);
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);

    // upload the image in the body of the request to the server, update the image
    // widget to use the url to the image, then redirect the user to the widget edit
    // page for the image widget
    function uploadImage(req, res) {
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        // if file isn't provided, then redirect user back to edit page
        if (!myFile) {
            res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        for (var i in widgets) {
            if (widgets[i]['_id'] === widgetId) {
                widgets[i].url = "/uploads/" + filename;

            }
        }
        res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
    }

    // move the widget for the page with the given pageId from position 'start'
    // in the list to position 'end'
    function reorderWidget(req, res) {
        var pageId = req.params["pageId"];
        var start = req.query["start"];
        var end = req.query["end"];
        var errorMessage = {};
        pageModel
            .reorderWidget(pageId, start, end)
            .then(reorderWidgetSuccess, reorderWidgetError);

        // if success is true, then widgets were reordered. Otherwise, something went wrong.
        function reorderWidgetSuccess(success) {
            if (success) {
                res.json(true);
            } else {
                errorMessage.message = "Could not reorder widgets. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // an error occurred while reordering widgets so return an error
        function reorderWidgetError(error) {
            errorMessage.message = "Could not reorder widgets. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // adds the widget body parameter instance to the local widgets array.
    // return the widget if creation was successful, otherwise return an error.
    function createWidget(req, res) {
        var pageId = req.params["pageId"];
        var widget = req.body;
        var errorMessage = {};

        // try to create the widget in the database
        widgetModel
            .createWidget(pageId, widget)
            .then(createWidgetSuccess, createWidgetError);

        // if the widget creation is successful, then return the new widget
        function createWidgetSuccess(newWidget) {
            if (newWidget) {
                res.json(newWidget);
            } else {
                errorMessage.message = "Could not create widget. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function createWidgetError(error) {
            errorMessage.message = "Could not create widget. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the widgets in local widgets array whose pageId
    // matches the parameter pageId
    function findAllWidgetsForPage(req, res) {
        var pageId = req.params["pageId"];
        var errorMessage = {};

        // try to find the widgets in the database
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(findAllWidgetsForPageSuccess, findAllWidgetsForPageError);

        // return the widgets from the model. otherwise, something went wrong
        function findAllWidgetsForPageSuccess(widgets) {
            if (widgets) {
                res.json(widgets);
            } else {
                errorMessage.message = "Could not fetch widgets. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findAllWidgetsForPageError(error) {
            errorMessage.message = "Could not fetch widgets. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the widget in local widgets array whose _id matches
    // the widgetId parameter. return an error if the widget cannot be found.
    function findWidgetById(req, res) {
        var widgetId = req.params["widgetId"];
        var errorMessage = {};

        // try to find the widget in the database
        widgetModel
            .findWidgetById(widgetId)
            .then(findWidgetByIdSuccess, findWidgetByIdError);

        // return the widget from the model. otherwise, the widget wasn't found
        function findWidgetByIdSuccess(widget) {
            if (widget) {
                res.json(widget);
            } else {
                errorMessage.message = "Widget with id " + widgetId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findWidgetByIdError(error) {
            errorMessage.message = "Could not fetch widget. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // updates the widget in local widgets array whose _id matches
    // the widgetId parameter
    // return the updated widget if successful, otherwise return an error
    function updateWidget(req, res) {
        var widgetId = req.params["widgetId"];
        var widget = req.body;
        var errorMessage = {};

        // widget validation check
        if (widget.widgetType === "HEADER") {
            if (!widget.name) {
                errorMessage.message = "Widget name is required.";
                res.status(400).json(errorMessage);
                return;
            } else if (!widget.text) {
                errorMessage.message = "Header text is required.";
                res.status(400).json(errorMessage);
                return;
            } else if (!widget.size) {
                errorMessage.message = "Header size is required.";
                res.status(400).json(errorMessage);
                return;
            }
        } else if (widget.widgetType === "IMAGE") {
            if (!widget.name) {
                errorMessage.message = "Widget name is required.";
                res.status(400).json(errorMessage);
                return;
            } else if (!widget.url) {
                errorMessage.message = "Image URL is required.";
                res.status(400).json(errorMessage);
                return;
            }
        } else if (widget.widgetType === "YOUTUBE") {
            if (!widget.name) {
                errorMessage.message = "Widget name is required.";
                res.status(400).json(errorMessage);
                return;
            } else if (!widget.url) {
                errorMessage.message = "YouTube URL is required";
                res.status(400).json(errorMessage);
                return;
            }
        }

        // try to update the widget in the database
        widgetModel
            .updateWidget(widgetId, widget)
            .then(updateWidgetSuccess, updateWidgetError);

        // return the widget if update successful. otherwise the widget wasn't found
        function updateWidgetSuccess(numUpdated) {
            if (numUpdated) {
                res.json(widget);
            } else {
                errorMessage.message = "Widget with id " + widgetId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function updateWidgetError(error) {
            errorMessage.message = "Could not update widget. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the widget from local widgets array whose _id matches
    // the widgetId parameter.
    // return true if the widget is successfully deleted, otherwise return an error.
    function deleteWidget(req, res) {
        var widgetId = req.params["widgetId"];
        var errorMessage = {};

        // try to delete the widget from the database
        widgetModel
            .deleteWidget(widgetId)
            .then(deleteWidgetSuccess, deleteWidgetError);

        // if deletion is successful, then return true. otherwise, the widget wasn't found
        function deleteWidgetSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "Widget with id " + widgetId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function deleteWidgetError(error) {
            errorMessage.message = "Could not delete widget. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }
};