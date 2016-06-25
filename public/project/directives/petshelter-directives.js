(function() {
    angular
        .module("petshelterDirectives", [])
        .directive("psHeader", psHeader);

    function psHeader() {
        return {
            templateUrl: "/project/directives/header.directive.client.html"
        };
    }
})();