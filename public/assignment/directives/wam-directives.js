(function() {
    angular
        .module("wamDirectives", [])
        .directive("wamSortable", wamSortable);

    function linker(scope, element, attributes) {
        var start, end;
        $(element).sortable({
            axis: "y",
            handle: ".widget-edit",
            start: function(event, ui) {
                start = ui.item.index();
            },
            stop: function(event, ui) {
                end = ui.item.index();
                scope.callback({
                    start: start,
                    end: end
                });
            }
        });
    }

    function wamSortable(WidgetService) {
        return {
            scope: {
                callback: "&"
            },
            link: linker
        };
    }
})();