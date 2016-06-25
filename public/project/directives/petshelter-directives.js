(function() {
    angular
        .module("petshelterDirectives", [])
        .directive("psHeader", psHeader)
        .directive("psProfileMenu", psProfileMenu);

    function psHeader() {
        return {
            templateUrl: "/project/directives/header.directive.client.html"
        };
    }
    
    function psProfileMenu() {
        return {
            templateUrl: "/project/directives/profile-menu.directive.client.html"
        };
    }
})();