(function() {
    angular
        .module("PetShelter")
        .directive("psHeader", psHeader)
        .directive("psProfileMenu", psProfileMenu)
        .directive("psPetResult", psPetResult);

    // directive for the header menu with the logo, search, and sign in links
    function psHeader() {
        return {
            scope: {
                "user": "="
            },
            templateUrl: "/project/directives/header.directive.view.client.html"
        };
    }

    // directive for the menu users see after the login, linking to their profile, messages, etc.
    function psProfileMenu() {
        return {
            templateUrl: "/project/directives/profile-menu.directive.view.client.html"
        };
    }

    // directive for a single pet search result. displays a thumbnail and summary. clicking on
    // this will direct the user to the pet's detail page
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