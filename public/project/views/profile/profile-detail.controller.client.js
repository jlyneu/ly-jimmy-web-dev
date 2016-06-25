(function() {
    angular
        .module("PetShelter")
        .controller("ProfileDetailController", ProfileDetailController);

    // controller for the profile-detail.view.client.html template
    function ProfileDetailController($rootScope) {
        var vm = this;
        vm.user = $rootScope.currentUser;
    }
})();