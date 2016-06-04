(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    // controller for the page-list.view.client.html template
    function PageListController($routeParams, PageService) {
        var vm = this;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];

        // initialize the page by fetching the pages for the current website
        function init() {
            PageService
                .findPagesByWebsiteId(vm.websiteId)
                .then(
                    function(response) {
                        var existingPages = response.data;
                        if (existingPages) {
                            vm.pages = existingPages;
                        } else {
                            vm.error = "Unable to fetch pages. Please try again later.";
                        }
                    },
                    function(error) {
                        vm.error = "Unable to fetch pages. Please try again later.";
                    }
                )
        }
        init();
    }

    // controller for the page-new.view.client.html template
    function NewPageController($location, $routeParams, PageService) {
        var vm = this;

        // event handler declarations
        vm.createPage = createPage;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];

        // initialize model.page object
        vm.page = {};

        vm.error = "";

        // pass the given page to the PageService to create the new page
        function createPage(page) {
            vm.error = "";

            if (!page.name) {
                vm.error = "A page name is required";
                return;
            }

            // route the user to the page-list page if page creation is successful
            PageService
                .createPage(vm.websiteId, page)
                .then(
                    function(response) {
                        var newPage = response.data;
                        if (!$.isEmptyObject(newPage)) {
                            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                        } else {
                            vm.error = "Unable to create the new page. Please try again later";
                        }
                    },
                    function(error) {
                        vm.error = "Unable to create the new page. Please try again later";
                    }
                );
        }
    }

    // controller for the page-edit.view.client.html template
    function EditPageController($location, $routeParams, PageService) {
        var vm = this;

        // event handler declarations
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        // get various id route parameters from the current url
        vm.userId = $routeParams["userId"];
        vm.websiteId = $routeParams["websiteId"];
        vm.pageId = $routeParams["pageId"];

        vm.error = "";

        // initialize the page by fetching the current page
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned page
        // so that modifying form elements won't automatically update the object in the
        // list in the PageService. This won't be necessary once the client is talking to the Node server
        function init() {
            PageService
                .findPageById(vm.pageId)
                .then(
                    function(response) {
                        var existingPage = response.data;
                        if (!$.isEmptyObject(existingPage)) {
                            vm.page = existingPage;
                        } else {
                            vm.error = "The page could not be fetched. Please try again later.";
                        }
                    },
                    function(error) {
                        vm.error = "The page could not be fetched. Please try again later.";
                    }
                );
        }
        init();

        // pass the given page to the PageService to update the page
        function updatePage(page) {
            vm.error = "";

            if (!page.name) {
                vm.error = "A page name is required";
                return;
            }

            // route the user to the page-list page if page update is successful
            PageService
                .updatePage(vm.pageId, page)
                .then(
                    function(response) {
                        var existingPage = response.data;
                        if (!$.isEmptyObject(existingPage)) {
                            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                        } else {
                            vm.error = "Unable to update the page. Please try again later";
                        }
                    },
                    function(error) {
                        vm.error = "Unable to update the page. Please try again later";
                    }
                );
        }

        // use the PageService to delete the current page
        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .then(
                    function(response) {
                        var isDeleted = response.data;
                        if (isDeleted) {
                            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                        } else {
                            vm.error = "Unable to delete the page. Please try again later";
                        }
                    },
                    function(error) {
                        vm.error = "Unable to delete the page. Please try again later";
                    }
                );
        }
    }
})();