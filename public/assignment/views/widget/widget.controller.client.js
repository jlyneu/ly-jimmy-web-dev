(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    // controller for the widget-list.view.client.html template
    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        
        // sanitize functions for html and urls
        vm.getSafeHtml = getSafeHtml;
        vm.getSafeUrl = getSafeUrl;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];
        vm.pageId = $routeParams["pageId"];

        // initialize the page by fetching the pages for the current website
        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
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
            var urlParts = widget.url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
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
            widget = WidgetService.createWidget(vm.pageId, widget);

            if (widget) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widget['_id']);
            } else {
                vm.error = "Unable to create widget. Please try again later";
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
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned widget
        // so that modifying form elements won't automatically update the object in the
        // list in the WidgetService. This won't be necessary once the client is talking to the Node server
        function init() {
            vm.widget = JSON.parse(JSON.stringify(WidgetService.findWidgetById(vm.widgetId)));
        }
        init();

        // pass the given widget to the WidgetService to update the widget
        function updateWidget(widget) {
            vm.error = "";

            if (widget.widgetType === "HEADER") {
                if (!widget.text) {
                    vm.error = "Header text is required";
                    return;
                } else if (!widget.size) {
                    vm.error = "Header size is required";
                    return;
                }
            } else if (widget.widgetType === "IMAGE") {
                if (!widget.url) {
                    vm.error = "Image URL is required";
                    return;
                }
            } else if (widget.widgetType === "YOUTUBE") {
                if (!widget.url) {
                    vm.error = "YouTube URL is required";
                    return;
                }
            }

            var updatedWidget = WidgetService.updateWidget(vm.widgetId, widget);
            if (updatedWidget) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            } else {
                vm.error = "Unable to update the widget. Please try again later";
            }
        }

        // use the WidgetService to delete the current widget
        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId);
        }
    }
})();