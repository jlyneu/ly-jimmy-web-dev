(function() {
    angular
        .module("PetShelter")
        .directive("psHeader", psHeader)
        .directive("psProfileMenu", psProfileMenu)
        .directive("psPetResult", psPetResult);

    function psHeader() {
        return {
            scope: {
                "user": "="
            },
            templateUrl: "/project/directives/header.directive.view.client.html"
        };
    }
    
    function psProfileMenu() {
        return {
            templateUrl: "/project/directives/profile-menu.directive.view.client.html"
        };
    }

    function psPetResult() {
        return {
            controller: "PetResultController",
            controllerAs: "model",
            bindToController: true,
            scope: {
                "pet": "="
            },
            templateUrl: "/project/directives/pet-result.directive.view.client.html"
        }
    }
})();