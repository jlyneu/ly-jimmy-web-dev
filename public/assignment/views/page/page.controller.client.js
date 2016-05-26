(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        function init() {
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
        }
        init();
    }

    function NewPageController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];

        // event handler declarations
        vm.createPage = createPage;

        // event handler functions
        function createPage(page) {
            PageService.createPage(vm.websiteId, page);
        }

        // initialize model.website object
        vm.page = {};
    }

    function EditPageController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];

        // event handler declarations
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        // event handler functions
        function updatePage(page) {
            PageService.updatePage(vm.pageId, vm.page);
        }

        function deletePage() {
            PageService.deletePage(vm.pageId);
        }

        // initialization to populate form fields
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned website
        // so that modifying form elements won't automatically update the object in the
        // list in the WebsiteService. This won't be necessary once the client is talking to the Node server
        function init() {
            vm.page = JSON.parse(JSON.stringify(PageService.findPageById(vm.pageId)));
        }
        init();
    }
})();