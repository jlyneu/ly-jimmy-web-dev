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

    function createWidget(req, res) {
        var pageId = req.params["pageId"];
        var widget = req.body;
        widget["_id"] = (new Date()).getTime().toString();
        widget["pageId"] = pageId;
        widgets.push(widget);
        res.json(widget);
    }

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

    function findWidgetById(req, res) {
        var widgetId = req.params["widgetId"];
        for (var i in widgets) {
            if (widgets[i]['_id'] === widgetId) {
                res.json(widgets[i]);
                return;
            }
        }
        res.json({});
    }

    function updateWidget(req, res) {
        var widgetId = req.params["widgetId"];
        var widget = req.body;
        for (var i in widgets) {
            if (widgets[i]['_id'] === widgetId) {
                widgets[i] = widget;
                res.json(widget);
                return;
            }
        }
        res.json({});
    }

    function deleteWidget(req, res) {
        var widgetId = req.params["widgetId"];
        for (var i in widgets) {
            if (widgets[i]['_id'] === widgetId) {
                widgets.splice(i, 1);
                res.send(true);
                return;
            }
        }
        res.send(false);
    }
};