(function() {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    function WidgetService() {
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
        var api = {
            "createWidget"        : createWidget,
            "findWidgetsByPageId" : findWidgetsByPageId,
            "findWidgetById"      : findWidgetById,
            "updateWidget"        : updateWidget,
            "deleteWidget"        : deleteWidget
        };
        return api;

        // adds the widget parameter instance to the local widgets
        // array. The new widget's pageId is set to the pageId parameter.
        // Return the widget if it is successfully created. Otherwise return null.
        function createWidget(pageId, widget) {
            widget["_id"] = (new Date()).getTime().toString();
            widget["pageId"] = pageId;
            widgets.push(widget);
            return widget;
        }

        // retrieves the widgets in local widgets array whose pageId
        // matches the parameter pageId.
        function findWidgetsByPageId(pageId) {
            pageWidgets = [];
            for (var i in widgets) {
                if (widgets[i]['pageId'] === pageId) {
                    pageWidgets.push(widgets[i]);
                }
            }
            return pageWidgets;
        }

        // retrieves the page in local pages array whose _id
        // matches the widgetId parameter
        function findWidgetById(widgetId) {
            for (var i in widgets) {
                if (widgets[i]['_id'] === widgetId) {
                    return widgets[i];
                }
            }
            return null;
        }

        // updates the widget in local pages array whose _id
        // matches the widgetId parameter.
        // Return the updated widget if the update is successful. Return null otherwise.
        function updateWidget(widgetId, widget) {
            for (var i in widgets) {
                if (widgets[i]['_id'] === widgetId) {
                    widgets[i] = widget;
                    return widget;
                }
            }
            return null;
        }

        // removes the widget from local widgets array whose _id
        // matches the widgetId parameter
        // Return true if the widget is successfully deleted. Return null otherwise.
        function deleteWidget(widgetId) {
            for (var i in widgets) {
                if (widgets[i]['_id'] === widgetId) {
                    widgets.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    }
})();