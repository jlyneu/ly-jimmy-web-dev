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
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];

        // initialize the page by fetching the pages for the current website
        function init() {
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
        }
        init();
    }

    // controller for the page-new.view.client.html template
    function NewPageController($routeParams, PageService) {
        var vm = this;
        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];

        // event handler declarations
        vm.createPage = createPage;

        // initialize model.page object
        vm.page = {};

        // pass the given page to the PageService to create the new page
        function createPage(page) {
            PageService.createPage(vm.websiteId, page);
        }
    }

    // controller for the page-edit.view.client.html template
    function EditPageController($routeParams, PageService) {
        var vm = this;
        // get various id route parameters from the current url
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];

        // event handler declarations
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        // initialize the page by fetching the current page
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned page
        // so that modifying form elements won't automatically update the object in the
        // list in the PageService. This won't be necessary once the client is talking to the Node server
        function init() {
            vm.page = JSON.parse(JSON.stringify(PageService.findPageById(vm.pageId)));
        }
        init();

        // pass the given page to the PageService to update the page
        function updatePage(page) {
            PageService.updatePage(vm.pageId, page);
        }

        // use the PageService to delete the current page
        function deletePage() {
            PageService.deletePage(vm.pageId);
        }
    }
})();