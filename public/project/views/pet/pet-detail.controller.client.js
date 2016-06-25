(function() {
    angular
        .module("PetShelter")
        .controller("PetDetailController", PetDetailController);

    // controller for the pet-detail.view.client.html template
    function PetDetailController($scope, $rootScope, $routeParams, ShelterService, PetService) {
        var vm = this;

        vm.savePet = savePet;

        vm.shelterId = $routeParams["shelterId"];
        vm.petId = $routeParams["petId"];
        vm.user = $rootScope.currentUser;
        vm.isSaved = false;
        vm.isSavedDisplay = "Not Saved";

        function init() {
            if (vm.user) {
                // determine if the user has saved this pet or not
                vm.isSaved = false;
                vm.isSavedDisplay = "Not Saved";
                for (var i = 0; i < vm.user.savedPets.length; i++) {
                    if (vm.user.savedPets[i]._id === vm.petId) {
                        vm.isSaved = true;
                        vm.isSavedDisplay = "Saved";
                    }
                }
            }

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
                if (vm.user) {
                    for (var i = 0; i < vm.shelter.users.length; i++) {
                        if (vm.shelter.users[i] === vm.user._id) {
                            vm.isOwner = true;
                        }
                    }
                }
            }

            function findShelterByIdError(error) {

            }
        }
        init();
        
        function savePet() {
            PetService
                .savePet(vm.user._id, vm.petId, vm.isSaved)
                .then(savePetSuccess, savePetError);

            function savePetSuccess(response) {
                vm.user = response.data;
                $rootScope.currentUser = response.data;
                vm.isSaved = !vm.isSaved;
                if (vm.isSaved) {
                    vm.isSavedDisplay = "Saved";
                } else {
                    vm.isSavedDisplay = "Not Saved";
                }
            }

            function savePetError(error) {

            }
        }
    }
})();