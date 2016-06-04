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
        vm.userId = $routeParams["userId"];

        // initialize the page by fetching the websites for the current user
        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .then(
                    function(response) {
                        var existingWebsites = response.data;
                        if (existingWebsites) {
                            vm.websites = existingWebsites;
                        } else {
                            vm.error = "Your websites could not be fetched from the server. Please try again later.";
                        }
                    },
                    function(error) {
                        vm.error = "Your websites could not be fetched from the server. Please try again later.";
                    }
                );
        }
        init();
    }

    // controller for the website-new.view.client.html template
    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;

        // event handler declarations
        vm.createWebsite = createWebsite;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];

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
            WebsiteService
                .createWebsite(vm.userId, website)
                .then(
                    function(response) {
                        var newWebsite = response.data;
                        if (!$.isEmptyObject(newWebsite)) {
                            $location.url("/user/" + vm.userId + "/website");
                        } else {
                            vm.error = "Unable to create a new website. Please try again later";
                        }
                    },
                    function(error) {
                        vm.error = "Unable to create a new website. Please try again later";
                    }
                );
        }
    }

    // controller for the website-edit.view.client.html template
    function EditWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;

        // event handler declarations
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];

        vm.error = "";
        
        // initialize the page by fetching the current website
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned website
        // so that modifying form elements won't automatically update the object in the
        // list in the WebsiteService. This won't be necessary once the client is talking to the Node server
        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(
                    function(response) {
                        var existingWebsite = response.data;
                        if (!$.isEmptyObject(existingWebsite)) {
                            vm.website = existingWebsite;
                        }
                    },
                    function(error) {
                        vm.error = "Cannot fetch the website at this time. Please try again later.";
                    }
                );
        }
        init();

        // pass the given website to the WebsiteService to update the website
        function updateWebsite(website) {
            vm.error = "";

            if (!website.name) {
                vm.error = "A website name is required";
                return;
            }

            // route the user to the website-list page if website creation is successful
            var updatedWebsite = WebsiteService.updateWebsite(vm.websiteId, vm.website);
            WebsiteService
                .updateWebsite(vm.websiteId, vm.website)
                .then(
                    function(response) {
                        var existingWebsite = response.data;
                        if (!$.isEmptyObject(existingWebsite)) {
                            $location.url("/user/" + vm.userId + "/website");
                        } else {
                            vm.error = "Unable to update the website. Please try again later";
                        }
                    },
                    function(error) {
                        vm.error = "Unable to update the website. Please try again later";
                    }
                );
        }

        // use the WebsiteService to delete the current website
        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .then(
                    function(response) {
                        var isDeleted = response.data;
                        if (isDeleted) {
                            $location.url("/user/" + vm.userId + "/website");
                        } else {
                            vm.error = "Unable to delete the website. Please try again later";
                        }
                    },
                    function(error) {
                        vm.error = "Unable to update the website. Please try again later";
                    }
                );

        }
    }
})();