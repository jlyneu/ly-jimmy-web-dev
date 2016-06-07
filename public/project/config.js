(function() {
    angular
        .module("PetShelter")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "/project/views/home/home.view.client.html",
            controller: "HomeController",
            controllerAs: "model"
        }).otherwise({
            redirectTo: "/"
        });
    }
})();