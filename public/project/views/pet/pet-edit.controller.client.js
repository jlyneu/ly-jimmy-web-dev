(function() {
    angular
        .module("PetShelter")
        .controller("PetEditController", PetEditController);

    // controller for the pet-edit.view.client.html template
    function PetEditController($rootScope, $location, $routeParams, PetService) {
        var vm = this;

        vm.updatePet = updatePet;

        vm.shelterId = $routeParams["shelterId"];
        vm.petId = $routeParams["petId"];
        vm.user = $rootScope.currentUser;

        function init() {
            PetService
                .findPetById(vm.petId)
                .then(findPetByIdSuccess, findPetByIdError);

            function findPetByIdSuccess(response) {
                var existingPet = response.data;
                if (existingPet.breeds) {
                    existingPet.breed = existingPet.breeds[0];
                }
                if (!$.isEmptyObject(existingPet)) {
                    vm.pet = existingPet;
                }
            }

            function findPetByIdError(error) {

            }
        }
        init();

        function updatePet(pet) {
            PetService
                .updatePet(vm.petId, pet)
                .then(updatePetSuccess, updatePetError);

            function updatePetSuccess(response) {
                if (!$.isEmptyObject(response)) {
                    $location.url("/shelter/" + vm.shelterId + "/pet/" + vm.petId);
                }
            }

            function updatePetError(error) {

            }
        }
    }
})();