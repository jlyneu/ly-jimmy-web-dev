(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    // controller for the website-list.view.client.html template
    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        
        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];

        // initialize the page by fetching the websites for the current user
        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();
    }

    // controller for the website-new.view.client.html template
    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;

        // event handler declarations
        vm.createWebsite = createWebsite;

        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];

        // initialize model.website object
        vm.website = {};

        vm.error = "";

        // pass the given website to the WebsiteService to create the new website
        function createWebsite(website) {
            vm.error = "";

            if (!website.name) {
                vm.error = "A website name is required";
                return;
            }

            // route the user to the website-list page if website creation is successful
            var newWebsite = WebsiteService.createWebsite(vm.userId, website);
            if (newWebsite) {
                $location.url("/user/" + vm.userId + "/website");
            } else {
                vm.error = "Unable to create a new website. Please try again later";
            }
        }
    }

    // controller for the website-edit.view.client.html template
    function EditWebsiteController($routeParams, WebsiteService) {
        var vm = this;

        // event handler declarations
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        
        // initialize the page by fetching the current website
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned website
        // so that modifying form elements won't automatically update the object in the
        // list in the WebsiteService. This won't be necessary once the client is talking to the Node server
        function init() {
            vm.website = JSON.parse(JSON.stringify(WebsiteService.findWebsiteById(vm.websiteId)));
        }
        init();

        // pass the given website to the WebsiteService to update the website
        function updateWebsite(website) {
            WebsiteService.updateWebsite(vm.websiteId, vm.website);
        }

        // use the WebsiteService to delete the current website
        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.websiteId);
        }
    }
})();