(function() {
    angular
        .module("PetShelter")
        .controller("PetDetailController", PetDetailController);

    // controller for the pet-detail.view.client.html template
    function PetDetailController($rootScope, $routeParams, ShelterService, PetService) {
        var vm = this;

        vm.shelterId = $routeParams["shelterId"];
        vm.petId = $routeParams["petId"];
        vm.user = $rootScope.currentUser;

        function init() {
            PetService
                .findPetById(vm.petId)
                .then(findPetByIdSuccess, findPetByIdError);


            function findPetByIdSuccess(response) {
                vm.pet = response.data;
                // check to see if this user owns this pet
                ShelterService
                    .findShelterById(vm.shelterId)
                    .then(findShelterByIdSuccess, findShelterByIdError);
            }

            function findPetByIdError(error) {

            }

            function findShelterByIdSuccess(response) {
                vm.shelter = response.data;
                for (var i = 0; i < vm.shelter.users.length; i++) {
                    if (vm.shelter.users[i] === vm.user._id) {
                        vm.isOwner = true;
                    }
                }
            }

            function findShelterByIdError(error) {

            }
        }
        init();
    }
})();