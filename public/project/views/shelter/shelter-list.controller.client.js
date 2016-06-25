(function() {
    angular
        .module("PetShelter")
        .controller("ShelterListController", ShelterListController);

    // controller for the shelter-list.view.client.html template
    function ShelterListController($rootScope, ShelterService) {
        var vm = this;

        vm.user = $rootScope.currentUser;

        function init() {
            ShelterService
                .findSheltersByUserId(vm.user._id)
                .then(findSheltersByUserIdSuccess, findSheltersByUserIdError);

            function findSheltersByUserIdSuccess(response) {
                vm.shelters = response.data;
                if (vm.shelters.length === 0) {
                    vm.noShelters = true;
                }
            }

            function findSheltersByUserIdError(error) {

            }
        }
        init();
    }
})();