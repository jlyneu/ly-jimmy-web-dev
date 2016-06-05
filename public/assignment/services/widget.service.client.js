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

        // return a promise for creating a widget on the server. if the widget was created
        // successfully, then the promise will resolve with the new widget.
        // if the widget was not created, the promise will resolve with an error.
        function createWidget(pageId, widget) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.post(url, widget);
        }

        // return a promise for finding widgets by the given user id. if the widgets were found,
        // then the promise will resolve with the existing widgets. if the widgets were not
        // found, then the promise will resolve with an error.
        function findWidgetsByPageId(pageId) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.get(url);
        }

        // return a promise for finding a widget by the given id. if the widget was found,
        // then the promise will resolve with the existing widget. if the widget was not
        // found, then the promise will resolve with an error.
        function findWidgetById(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.get(url);
        }

        // return a promise for updating the given widget on the server. if the widget was updated
        // successfully, then the promise will resolve with the updated widget. if the widget was not
        // updated, then the promise will resolve with an error.
        function updateWidget(widgetId, widget) {
            var url = "/api/widget/" + widgetId;
            return $http.put(url, widget);
        }

        // return a promise for deleting the given widget on the server. if the widget was deleted
        // successfully, then the promise will resolve with 'true'. if the widget was not
        // deleted, then the promise will resolve with an error.
        function deleteWidget(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.delete(url);
        }
    }
})();