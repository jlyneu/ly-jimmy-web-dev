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
                .then(findWebsitesByUserSuccess, findWebsitesByUserError);
        }
        init();

        // a 200 was returned from the server, so the websites should have been found.
        // the existing websites should be returned from the server. if so, then populate the website list.
        // otherwise, something went wrong so display an error.
        function findWebsitesByUserSuccess(response) {
            var existingWebsites = response.data;
            if (existingWebsites) {
                vm.websites = existingWebsites;
            } else {
                vm.error = "Your websites could not be fetched from the server. Please try again later.";
            }
        }

        // display error message from server if provided
        function findWebsitesByUserError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Your websites could not be fetched from the server. Please try again later.";
            }
        }
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
                .then(createWebsiteSuccess, createWebsiteError);

            // a 200 was returned from the server, so website creation should be successful.
            // the new website should be returned from the server. if so, then route to the website list page.
            // otherwise, something went wrong so display an error.
            function createWebsiteSuccess(response) {
                var newWebsite = response.data;
                if (!$.isEmptyObject(newWebsite)) {
                    $location.url("/user/" + vm.userId + "/website");
                } else {
                    vm.error = "Unable to create a new website. Please try again later";
                }
            }

            // display the error message from the server if provided
            function createWebsiteError(error) {
                if (error.data && error.data.message) {
                    vm.error = error.data.message;
                } else {
                    vm.error = "Unable to create a new website. Please try again later";
                }
            }
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
        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(findWebsiteByIdSuccess, findWebsiteByIdError);
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
            WebsiteService
                .updateWebsite(vm.websiteId, vm.website)
                .then(updateWebsiteSuccess, updateWebsiteError);
        }

        // use the WebsiteService to delete the current website
        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .then(deleteWebsiteSuccess, deleteWebsiteError);
        }

        // a 200 was returned from the server, so the website should have been found.
        // the existing website should be returned from the server. if so, then populate the input fields.
        // otherwise, something went wrong so display an error.
        function findWebsiteByIdSuccess(response) {
            var existingWebsite = response.data;
            if (!$.isEmptyObject(existingWebsite)) {
                vm.website = existingWebsite;
            } else {
                vm.error = "Unable to fetch website information. Please try again later.";
            }
        }

        // display error message from server if provided
        function findWebsiteByIdError(error) {
            if (error.data && error.data.message) {
                vm.error = err.data.message;
            } else {
                vm.error = "Unable to fetch website information. Please try again later.";
            }
        }

        // a 200 was returned from the server, so update should be successful.
        // the updated website should be returned from the server. if so, then route to the website list page.
        // otherwise, something went wrong so display an error.
        function updateWebsiteSuccess(response) {
            var existingWebsite = response.data;
            if (!$.isEmptyObject(existingWebsite)) {
                $location.url("/user/" + vm.userId + "/website");
            } else {
                vm.error = "Unable to update the website. Please try again later";
            }
        }

        // display error message from server if provided
        function updateWebsiteError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to update the website. Please try again later";
            }
        }

        // a 200 was returned from the server, so delete should be successful.
        // 'true' should be returned from the server. if so, then route to the website list page.
        // otherwise, something went wrong so display an error.
        function deleteWebsiteSuccess(response) {
            var isDeleted = response.data;
            if (isDeleted) {
                $location.url("/user/" + vm.userId + "/website");
            } else {
                vm.error = "Unable to delete the website. Please try again later";
            }
        }

        // display error message from server if provided
        function deleteWebsiteError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to delete the website. Please try again later";
            }
        }
    }
})();