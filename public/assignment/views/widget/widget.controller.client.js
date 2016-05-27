(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    // controller for the widget-list.view.client.html template
    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];

        // function necessary for displaying YouTube videos within iframes
        // when the url is an Angular.js data-bound value
        vm.trustSrc = trustSrc;

        // initialize the page by fetching the pages for the current website
        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
        }
        init();

        // use the Strict Contextual Escaping (sce) module to
        // allow YouTube url to be displayed in iframe
        function trustSrc(src) {
            return $sce.trustAsResourceUrl(src);
        }
    }

    // controller for the widget-chooser.view.client.html template
    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        
        // event handler declarations
        vm.createWidget = createWidget;

        // create a widget using the WidgetService with the given
        // widget type so that the edit-widget page will know which
        // view to show, ie header, image, YouTube, etc.
        // If the widget is successfully created, then navigate to the
        // edit-widget page. Otherwise, display an error message.
        function createWidget(widgetType) {
            // default widget with widgetType to be created
            var widget = {
                "widgetType": widgetType
            };
            widget = WidgetService.createWidget(vm.pageId, widget);

            if (widget) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widget['_id']);
            } else {
                vm.alert = "Unable to create widget";
            }
        }
    }

    // controller for the widget-edit.view.client.html template
    function EditWidgetController($routeParams, WidgetService) {
        var vm = this;
        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.widgetId = $routeParams["wgid"];

        // event handler declarations
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

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
            WidgetService.updateWidget(vm.widgetId, widget);
        }

        // use the WidgetService to delete the current widget
        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId);
        }
    }
})();