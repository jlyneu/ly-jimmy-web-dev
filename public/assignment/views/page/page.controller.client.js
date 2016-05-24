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

    function NewPageController() {
        var vm = this;
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