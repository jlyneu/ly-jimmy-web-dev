(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();
    }

    function NewWebsiteController() {
        var vm = this;
    }

    function EditWebsiteController($routeParams, WebsiteService) {
        var vm = this;
        vm.websiteId = $routeParams["wid"];
        function init() {
            vm.website = WebsiteService.findWebsiteById(vm.websiteId);
        }
        init();
    }
})();