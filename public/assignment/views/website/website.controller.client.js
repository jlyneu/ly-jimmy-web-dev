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

    function NewWebsiteController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];

        // event handler declarations
        vm.createWebsite = createWebsite;

        // event handler functions
        function createWebsite(website) {
            WebsiteService.createWebsite(vm.userId, website);
        }

        // initialize model.website object
        vm.website = {};
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
        // use JSON.parse(JSON.stringify(...)) to effectively "clone" the returned website
        // so that modifying form elements won't automatically update the object in the
        // list in the WebsiteService. This won't be necessary once the client is talking to the Node server
        function init() {
            vm.website = JSON.parse(JSON.stringify(WebsiteService.findWebsiteById(vm.websiteId)));
        }
        init();
    }
})();