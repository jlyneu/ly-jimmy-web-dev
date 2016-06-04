(function() {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    function WidgetService($http) {
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
            var url = "/api/page/" + pageId + "/widget";
            return $http.post(url, widget);
        }

        // retrieves the widgets in local widgets array whose pageId
        // matches the parameter pageId.
        function findWidgetsByPageId(pageId) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.get(url);
        }

        // retrieves the page in local pages array whose _id
        // matches the widgetId parameter
        function findWidgetById(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.get(url);
        }

        // updates the widget in local pages array whose _id
        // matches the widgetId parameter.
        // Return the updated widget if the update is successful. Return null otherwise.
        function updateWidget(widgetId, widget) {
            var url = "/api/widget/" + widgetId;
            return $http.put(url, widget);
        }

        // removes the widget from local widgets array whose _id
        // matches the widgetId parameter
        // Return true if the widget is successfully deleted. Return null otherwise.
        function deleteWidget(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.delete(url);
        }
    }
})();