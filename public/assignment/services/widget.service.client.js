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
                "url": "https://www.youtube.com/embed/AM2Ivdi9c4E" },
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
        // array. The new widget's pageId is set to the pageId parameter
        function createWidget(pageId, widget) {
            widgets["pageId"] = pageId;
            widgets.push(widget);
        }

        // retrieves the widgets in local widgets array whose pageId
        // matches the parameter pageId
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
        }

        // updates the widget in local pages array whose _id
        // matches the widgetId parameter
        function updateWidget(widgetId, widget) {
            for (var i in widgets) {
                if (widgets[i]['_id'] === widgetId) {
                    widgets[i] = widget;
                }
            }
        }

        // removes the widget from local widgets array whose _id
        // matches the widgetId parameter
        function deleteWidget(widgetId) {
            for (var i in widgets) {
                if (widgets[i]['_id'] === widgetId) {
                    widgets.splice(i, 1);
                    return;
                }
            }
        }
    }
})();