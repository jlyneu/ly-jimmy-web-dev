module.exports = function(app) {
    var multer = require('multer');
    var upload = multer({ dest: __dirname + '/../../public/uploads' });

    var widgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    // declare the API
    app.post("/api/upload", upload.single("myFile"), uploadImage);
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);


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

    // adds the widget body parameter instance to the local widgets array.
    // return the widget if creation was successful, otherwise return an error.
    function createWidget(req, res) {
        var pageId = req.params["pageId"];
        var widget = req.body;
        widget["_id"] = (new Date()).getTime().toString();
        widget["pageId"] = pageId;
        widgets.push(widget);
        res.json(widget);
    }

    // retrieves the widgets in local widgets array whose pageId
    // matches the parameter pageId
    function findAllWidgetsForPage(req, res) {
        var pageId = req.params["pageId"];
        pageWidgets = [];
        for (var i in widgets) {
            if (widgets[i]['pageId'] === pageId) {
                pageWidgets.push(widgets[i]);
            }
        }
        res.json(pageWidgets);
    }

    // retrieves the widget in local widgets array whose _id matches
    // the widgetId parameter. return an error if the widget cannot be found.
    function findWidgetById(req, res) {
        var widgetId = req.params["widgetId"];
        for (var i in widgets) {
            if (widgets[i]['_id'] === widgetId) {
                // the widget was found so return the widget
                res.json(widgets[i]);
                return;
            }
        }
        // the widget could not be found so return an error
        var errorMessage = {
            message: "Widget with id " + pageId + " was not found."
        };
        res.status(404).json(errorMessage);
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
            if (!widget.text) {
                errorMessage.message = "Header text is required.";
                res.status(400).json(errorMessage);
                return;
            } else if (!widget.size) {
                errorMessage.message = "Header size is required.";
                res.status(400).json(errorMessage);
                return;
            }
        } else if (widget.widgetType === "IMAGE") {
            if (!widget.url) {
                errorMessage.message = "Image URL is required.";
                res.status(400).json(errorMessage);
                return;
            }
        } else if (widget.widgetType === "YOUTUBE") {
            if (!widget.url) {
                errorMessage.message = "YouTube URL is required";
                res.status(400).json(errorMessage);
                return;
            }
        }

        for (var i in widgets) {
            if (widgets[i]['_id'] === widgetId) {
                // widget was found so update and return the widget
                widgets[i] = widget;
                res.json(widget);
                return;
            }
        }
        // widget was not found so return an error
        errorMessage.message = "Widget with id " + widgetId + " was not found.";
        res.status(404).json(errorMessage);
    }

    // removes the widget from local widgets array whose _id matches
    // the widgetId parameter.
    // return true if the widget is successfully deleted, otherwise return an error.
    function deleteWidget(req, res) {
        var widgetId = req.params["widgetId"];
        for (var i in widgets) {
            if (widgets[i]['_id'] === widgetId) {
                // widget was found so delete widget and return true
                widgets.splice(i, 1);
                res.send(true);
                return;
            }
        }
        // widget was not found so return an error
        var errorMessage = {
            message: "Widget with id " + widgetId + " was not found."
        };
        res.status(404).send(errorMessage);
    }
};