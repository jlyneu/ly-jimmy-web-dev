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
                .then(findPagesByWebsiteIdSuccess, findPagesByWebsiteIdError);
        }
        init();

        // a 200 was returned from the server, so the pages should have been found.
        // the existing pages should be returned from the server. if so, then populate the page list.
        // otherwise, something went wrong so display an error.
        function findPagesByWebsiteIdSuccess(response) {
            var existingPages = response.data;
            if (existingPages) {
                vm.pages = existingPages;
            } else {
                vm.error = "Unable to fetch pages. Please try again later.";
            }
        }

        // display error message from server if provided
        function findPagesByWebsiteIdError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to fetch pages. Please try again later.";
            }
        }
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
                .then(createPageSuccess, createPageError);
        }

        // a 200 was returned from the server, so page creation should be successful.
        // the new page should be returned from the server. if so, then route to the page list page.
        // otherwise, something went wrong so display an error.
        function createPageSuccess(response) {
            var newPage = response.data;
            if (!$.isEmptyObject(newPage)) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
            } else {
                vm.error = "Unable to create the new page. Please try again later";
            }
        }

        // display the error message from the server if provided
        function createPageError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to create the new page. Please try again later";
            }
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
        function init() {
            PageService
                .findPageById(vm.pageId)
                .then(findPageByIdSuccess, findPageByIdError);
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
                .then(updatePageSuccess, updatePageError);
        }

        // use the PageService to delete the current page
        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .then(deletePageSuccess, deletePageError);
        }

        // a 200 was returned from the server, so the page should have been found.
        // the existing page should be returned from the server. if so, then populate the input fields.
        // otherwise, something went wrong so display an error.
        function findPageByIdSuccess(response) {
            var existingPage = response.data;
            if (!$.isEmptyObject(existingPage)) {
                vm.page = existingPage;
            } else {
                vm.error = "The page could not be fetched. Please try again later.";
            }
        }

        // display error message from server if provided
        function findPageByIdError(error) {
            if (error.data && error.data.message) {
                vm.error = err.data.message;
            } else {
                vm.error = "The page could not be fetched. Please try again later.";
            }
        }

        // a 200 was returned from the server, so update should be successful.
        // the updated page should be returned from the server. if so, then route to the page list page.
        // otherwise, something went wrong so display an error.
        function updatePageSuccess(response) {
            var existingPage = response.data;
            if (!$.isEmptyObject(existingPage)) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
            } else {
                vm.error = "Unable to update the page. Please try again later";
            }
        }

        // display error message from server if provided
        function updatePageError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to update the page. Please try again later";
            }
        }

        // a 200 was returned from the server, so delete should be successful.
        // 'true' should be returned from the server. if so, then route to the page list page.
        // otherwise, something went wrong so display an error.
        function deletePageSuccess(response) {
            var isDeleted = response.data;
            if (isDeleted) {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
            } else {
                vm.error = "Unable to delete the page. Please try again later";
            }
        }

        // display error message from server if provided
        function deletePageError(error) {
            if (error.data && error.data.message) {
                vm.error = error.data.message;
            } else {
                vm.error = "Unable to delete the page. Please try again later";
            }
        }
    }
})();