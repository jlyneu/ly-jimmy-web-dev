(function() {
    angular
        .module("PetShelter")
        .controller("ShelterListController", ShelterListController);

    // controller for the shelter-list.view.client.html template
    function ShelterListController($rootScope, ShelterService) {
        var vm = this;

        vm.findSheltersByUserId = findSheltersByUserId;

        vm.user = $rootScope.currentUser;

        function findSheltersByUserId(query) {
            ShelterService.findSheltersByUserId(query)
                .then(findSheltersByUserIdSuccess, findSheltersByUserIdError);

            function findSheltersByUserIdSuccess(response) {
                vm.shelters = response.data;
            }

            function findSheltersByUserIdError(error) {

            }
        }
    }
})();