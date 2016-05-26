(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        vm.trustSrc = trustSrc;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
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

    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        
        // event handler declarations
        vm.createWidget = createWidget;
        
        // event handler functions
        function createWidget(widgetType) {
            var newId = (new Date).getTime().toString();
            // create a widget with an _id and the provided widget type so that
            // the edit-widget page will know which view to show, ie header,
            // image, YouTube, etc.
            var widget = {
                "_id": newId,
                "widgetType": widgetType
            };
            WidgetService.createWidget(vm.pageId, widget);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + newId);
        }
        
    }

    function EditWidgetController($routeParams, WidgetService) {
        var vm = this;
        vm.widgetId = $routeParams["wgid"];
        function init() {
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
        }
        init();
    }
})();