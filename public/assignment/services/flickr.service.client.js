(function() {
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    function FlickrService($http) {

        var key = "f10e62d0421f36d7bbe278a0a4df943b";
        var secret = "9cde16713dbbeccd";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        var api = {
            "searchPhotos": searchPhotos
        };
        return api;

        // return a promise for finding Flickr photos related to the provided
        // search term. if the search was successful, then the promise will resolve
        // with the relevant photos. otherwise, the promise will resolve with an error.
        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();