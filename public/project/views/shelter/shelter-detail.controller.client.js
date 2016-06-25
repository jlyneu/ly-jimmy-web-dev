(function() {
    angular
        .module("PetShelter")
        .controller("ShelterDetailController", ShelterDetailController);

    // controller for the shelter-detail.view.client.html template
    function ShelterDetailController($rootScope, $routeParams, ShelterService, PetService) {
        var vm = this;

        vm.shelterId = $routeParams["shelterId"];
        vm.user = $rootScope.currentUser;

        function init() {
            ShelterService
                .findShelterById(vm.shelterId)
                .then(findShelterByIdSuccess, findShelterByIdError);


            function findShelterByIdSuccess(response) {
                vm.shelter = response.data;
                for (var i = 0; i < vm.shelter.users.length; i++) {
                    if (vm.shelter.users[i] === vm.user._id) {
                        vm.isOwner = true;
                        return PetService
                            .findPetsByShelterId(vm.shelterId)
                            .then(findPetsByShelterIdSuccess, findPetsByShelterIdError);
                    }
                }
            }

            function findShelterByIdError(error) {

            }

            function findPetsByShelterIdSuccess(response) {
                vm.pets = response.data;
            }

            function findPetsByShelterIdError(error) {

            }
        }
        init();
    }
})();