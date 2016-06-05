(function() {
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", FlickrImageSearchController);

    // controller for the widget-flickr-search.view.client.html template
    function FlickrImageSearchController($location, $routeParams, WidgetService, FlickrService) {
        var vm = this;

        // event handler declarations
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];
        vm.pageId = $routeParams["pageId"];
        vm.widgetId = $routeParams["widgetId"];

        // pass the searchTerm from the search input field to the FlickrService
        // to query Flickr images related to the search term
        function searchPhotos(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(searchPhotosSuccess, searchPhotosError);

            function searchPhotosSuccess(response) {
                // parse the JSONP response and bind the resulting photos to the model
                data = response.data.replace("jsonFlickrApi(", "");
                data = data.substring(0, data.length - 1);
                data = JSON.parse(data);
                vm.photos = data.photos;
            }

            function searchPhotosError(error) {
                vm.error = "The Flickr service is currently unavailable. Please try again later.";
            }
        }

        // when a user clicks on one of the result photos, update the image widget
        // such that the url is set to the url of the clicked photo
        function selectPhoto(photo) {
            // url of the selected photo
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";

            // get the image widget and update it with the url of the selected photo
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(findWidgetByIdSuccess, findWidgetByIdError);

            // a 200 was returned from the server, so the widget should have been found.
            // the existing widget should be returned from the server. if so, then populate the input fields.
            // otherwise, something went wrong so display an error.
            function findWidgetByIdSuccess(response) {
                var existingWidget = response.data;
                if (!$.isEmptyObject(existingWidget)) {
                    existingWidget.url = url;
                    WidgetService
                        .updateWidget(vm.widgetId, existingWidget)
                        .then(updateWidgetSuccess, updateWidgetError);
                }
            }

            // display error message from server if provided
            function findWidgetByIdError(error) {
                if (error.data && error.data.message) {
                    vm.error = err.data.message;
                } else {
                    vm.error = "Cannot update widget at this time. Please try again later.";
                }
            }

            // a 200 was returned from the server, so update should be successful.
            // the updated widget should be returned from the server. if so, then route to the widget edit page.
            // otherwise, something went wrong so display an error.
            function updateWidgetSuccess(response) {
                existingWidget = response.data;
                if (!$.isEmptyObject(existingWidget)) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + vm.widgetId);
                } else {
                    vm.error = "Cannot update widget at this time. Please try again later.";
                }
            }

            // display error message from server if provided
            function updateWidgetError(error) {
                if (error.data && error.data.message) {
                    vm.error = error.data.message;
                } else {
                    vm.error = "Cannot update widget at this time. Please try again later.";
                }
            }
        }
    }
})();