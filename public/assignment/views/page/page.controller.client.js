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
        vm.pageId = $routeParams["pid"];
        function init() {
            vm.page = PageService.findPageById(vm.pageId);
        }
        init();
    }
})();