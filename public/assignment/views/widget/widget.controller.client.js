(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    // controller for the widget-list.view.client.html template
    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        
        vm.getSafeHtml = getSafeHtml;
        vm.getSafeUrl = getSafeUrl;
        vm.reorderWidget = reorderWidget;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];
        vm.pageId = $routeParams["pageId"];

        // initialize the page by fetching the pages for the current website
        function init() {
            WidgetService
                .findWidgetsByPageId(vm.pageId)
                .then(findWidgetsByPageIdSuccess, findWidgetsByPageIdError);
        }
        init();
        
        // sanitize and return the html from the given HTML widget
        // using the Strict Contextual Escaping (sce) module
        function getSafeHtml(widget) {
            return $sce.trustAsHtml(widget.text);
        }

        // parse the url from the given YouTube widget for the id,
        // then return the embed url needed for an iframe to display the video.
        // use the Strict Contextual Escaping (sce) module to
        // allow YouTube url to be displayed in iframe
        function getSafeUrl(widget) {
            var url;

            if (widget.url.includes("youtube")) {
                // then url should be in the format: https://www.youtube.com/watch?v={id}
                // get the string of query parameters
                var queryParamString = widget.url.substring("https://www.youtube.com/watch?".length, widget.url.length);
                var queryParams = queryParamString.split("&");
                // loop through the query parameters until the v parameter is found
                for (var i in queryParams) {
                    var keyValue = queryParams[i].split("=");
                    if (keyValue[0] === "v") {
                        // use the value as the id for the embed url
                        url = "https://www.youtube.com/embed/" + keyValue[1];
                        break;
                    }
                }
            } else {
                // then url should be in the format: https://youtu.be/{id}
                var urlParts = widget.url.split("/");
                var id = urlParts[urlParts.length - 1];
                url = "https://www.youtube.com/embed/" + id;
            }
            return $sce.trustAsResourceUrl(url);
        }

        // send a request to the server to save the new widget ordering
        // to the database
        function reorderWidget(start, end) {
            WidgetService
                .reorderWidget(vm.pageId, start, end)
                .then(reorderWidgetSuccess, reorderWidgetError);

            function reorderWidgetSuccess(success) {
                if (!success) {
                    vm.error = "Could not save new widget order. Please try again later.";
                }
            }

            function reorderWidgetError(error) {
                vm.error = "Could not save new widget order. Please try again later.";
            }
        }

        // a 200 was returned from the server, so the widgets should have been found.
        // the existing widgets should be returned from the server. if so, then populate the widget list.
        // otherwise, something went wrong so display an error.
        function findWidgetsByPageIdSuccess(response) {
            var existingWidgets = response.data;
            if (existingWidgets) {
                vm.widgets = existingWidgets;
            } else {
                vm.error = "Could not fetch the widgets. Please try again later.";
            }
        }

        // display error message from server if provided
        function findWidgetsByPageIdError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Could not fetch the widgets. Please try again later.";
            }
        }
    }

    // controller for the widget-chooser.view.client.html template
    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;

        // event handler declarations
        vm.createWidget = createWidget;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];
        vm.pageId = $routeParams["pageId"];

        vm.error = "";

        // create a widget using the WidgetService with the given
        // widget type so that the edit-widget page will know which
        // view to show, ie header, image, YouTube, etc.
        // If the widget is successfully created, then navigate to the
        // edit-widget page. Otherwise, display an error message.
        function createWidget(widgetType) {
            vm.error = "";

            // default widget with widgetType to be created
            var widget = {
                "widgetType": widgetType
            };
            WidgetService
                .createWidget(vm.pageId, widget)
                .then(createWidgetSuccess, createWidgetError);
        }

        // a 200 was returned from the server, so widget creation should be successful.
        // the new widget should be returned from the server. if so, then route to the widget edit page.
        // otherwise, something went wrong so display an error.
        function createWidgetSuccess(response) {
            var newWidget = response.data;
            if (!$.isEmptyObject(newWidget)) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + newWidget["_id"]);
            } else {
                vm.error = "Unable to create widget. Please try again later";
            }
        }

        function createWidgetError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to create widget. Please try again later.";
            }
        }
    }

    // controller for the widget-edit.view.client.html template
    function EditWidgetController($location, $routeParams, WidgetService) {
        var vm = this;

        // event handler declarations
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];
        vm.pageId = $routeParams["pageId"];
        vm.widgetId = $routeParams["widgetId"];

        vm.error = "";

        // initialize the page by fetching the current widget
        function init() {
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(findWidgetByIdSuccess, findWidgetsByIdError);
        }
        init();

        // pass the given widget to the WidgetService to update the widget
        function updateWidget(widget) {
            vm.error = "";

            // check validation first
            if (!widget.name) {
                vm.error = "Widget name is required.";
                return;
            }

            if (widget.widgetType === "HEADER") {
                if (!widget.text) {
                    vm.error = "Header text is required.";
                    return;
                } else if (!widget.size) {
                    vm.error = "Header size is required.";
                    return;
                }
            } else if (widget.widgetType === "IMAGE") {
                if (!widget.url) {
                    vm.error = "Image URL is required.";
                    return;
                }
            } else if (widget.widgetType === "YOUTUBE") {
                if (!widget.url) {
                    vm.error = "YouTube URL is required.";
                    return;
                }
            } else if (widget.widgetType === "TEXT") {
                if ($("#rows").hasClass("ng-invalid-min")) {
                    vm.error = "Rows must be a non-negative number.";
                    return;
                }
            }

            WidgetService
                .updateWidget(vm.widgetId, widget)
                .then(updateWidgetSuccess, updateWidgetError);
        }

        // use the WidgetService to delete the current widget
        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .then(deleteWidgetSuccess, deleteWidgetError);
        }

        // a 200 was returned from the server, so the widget should have been found.
        // the existing widget should be returned from the server. if so, then populate the input fields.
        // otherwise, something went wrong so display an error.
        function findWidgetByIdSuccess(response) {
            var existingWidget = response.data;
            if (!$.isEmptyObject(existingWidget)) {
                vm.widget = existingWidget;
            } else {
                vm.error = "Could not fetch the widget. Please try again later.";
            }
        }

        // display error message from server if provided
        function findWidgetsByIdError(error) {
            if (error.data && error.data.message) {
                vm.error = err.data.message;
            } else {
                vm.error = "Could not fetch the widget. Please try again later.";
            }
        }

        // a 200 was returned from the server, so update should be successful.
        // the updated widget should be returned from the server. if so, then route to the widget list page.
        // otherwise, something went wrong so display an error.
        function updateWidgetSuccess(response) {
            var existingWidget = response.data;
            if (!$.isEmptyObject(existingWidget)) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            } else {
                vm.error = "Unable to update the widget. Please try again later.";
            }
        }

        // display error message from server if provided
        function updateWidgetError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to update the widget. Please try again later.";
            }
        }

        // a 200 was returned from the server, so delete should be successful.
        // 'true' should be returned from the server. if so, then route to the widget list page.
        // otherwise, something went wrong so display an error.
        function deleteWidgetSuccess(response) {
            var isDeleted = response.data;
            if (isDeleted) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            } else {
                vm.error = "Unable to delete the widget. Please try again later.";
            }
        }

        // display error message from server if provided
        function deleteWidgetError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to delete the widget. Please try again later.";
            }
        }
    }
})();