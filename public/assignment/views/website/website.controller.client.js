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
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        
        // event handler declarations
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;
        
        // event handler functions
        function updateWebsite(website) {
            WebsiteService.updateWebsite(vm.websiteId, vm.website);
        }
        
        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.websiteId);
        }
        
        // initialization to populate form fields
        function init() {
            vm.website = WebsiteService.findWebsiteById(vm.websiteId);
        }
        init();
    }
})();