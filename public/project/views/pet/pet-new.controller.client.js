(function() {
    angular
        .module("PetShelter")
        .controller("PetNewController", PetNewController);

    // controller for the pet-new.view.client.html template
    function PetNewController($rootScope, $location, $routeParams, PetService) {
        var vm = this;

        vm.createPet = createPet;

        vm.shelterId = $routeParams["shelterId"];
        vm.user = $rootScope.currentUser;

        function createPet(pet) {
            PetService
                .createPet(vm.shelterId, pet)
                .then(createPetSuccess, createPetError);

            function createPetSuccess(response) {
                var newPet = response.data;
                if (!$.isEmptyObject(newPet)) {
                    $location.url("/shelter/" + vm.shelterId + "/pet/" + newPet._id);
                }
            }

            function createPetError(error) {

            }
        }
    }
})();