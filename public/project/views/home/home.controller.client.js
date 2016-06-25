(function() {
    angular
        .module("PetShelter")
        .controller("HomeController", HomeController);

    // controller for the home.view.client.html template
    function HomeController($rootScope) {
        var vm = this;

        vm.user = $rootScope.currentUser;
    }
})();