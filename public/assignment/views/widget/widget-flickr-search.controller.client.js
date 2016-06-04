(function() {
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", FlickrImageSearchController);

    function FlickrImageSearchController($location, $routeParams, WidgetService, FlickrService) {
        var vm = this;

        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];
        vm.pageId = $routeParams["pageId"];
        vm.widgetId = $routeParams["widgetId"];

        function searchPhotos(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(function (response) {
                    data = response.data.replace("jsonFlickrApi(", "");
                    data = data.substring(0, data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";

            WidgetService
                .findWidgetById(vm.widgetId)
                .then(
                    function(response) {
                        var existingWidget = response.data;
                        if (!$.isEmptyObject(existingWidget)) {
                            existingWidget.url = url;
                            WidgetService
                                .updateWidget(vm.widgetId, existingWidget)
                                .then(
                                    function(response) {
                                        existingWidget = response.data;
                                        if (!$.isEmptyObject(existingWidget)) {
                                            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + vm.widgetId);
                                        } else {
                                            vm.error = "Cannot update widget at this time. Please try again later.";
                                        }
                                    },
                                    function(error) {
                                        vm.error = "Cannot update widget at this time. Please try again later.";
                                    }
                                );
                        }
                    },
                    function(error) {
                        vm.error = "Cannot update widget at this time. Please try again later.";
                    }
                );
        }
    }
})();