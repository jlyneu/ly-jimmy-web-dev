(function() {
    angular
        .module("PetShelter")
        .controller("ProfileController", ProfileController);

    // controller for the register.view.client.html template
    function ProfileController($rootScope) {
        var vm = this;
        console.log($rootScope.currentUser);
        vm.user = $rootScope.currentUser;
    }
})();