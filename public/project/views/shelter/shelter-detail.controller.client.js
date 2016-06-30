(function() {
    angular
        .module("PetShelter")
        .controller("ShelterDetailController", ShelterDetailController);

    // controller for the shelter-detail.view.client.html template
    function ShelterDetailController($rootScope, $routeParams, ShelterService, PetService) {
        var vm = this;

        vm.saveShelter = saveShelter;

        vm.shelterId = $routeParams["shelterId"];
        vm.user = $rootScope.currentUser;
        vm.isSaved = false;
        vm.isSavedDisplay = "Not Saved";
        vm.source;

        function init() {
            ShelterService
                .findShelterById(vm.shelterId)
                .then(findShelterByIdSuccess, findShelterByIdError);


            function findShelterByIdSuccess(response) {
                vm.shelter = response.data;
                vm.source = vm.shelter.source;

                if (vm.shelter.source == "PETFINDER") {
                    ShelterService
                        .findPetfinderShelterById(vm.shelter.petfinderId)
                        .then(findPetfinderShelterByIdSuccess, findPetfinderShelterByIdError);
                } else {
                    findShelterPets();
                }
            }

            function findShelterByIdError(error) {

            }

            function findPetfinderShelterByIdSuccess(response) {
                vm.shelter = response.data;
                findShelterPets();
            }

            function findPetfinderShelterByIdError(error) {

            }

            function findShelterPets() {
                if (vm.user) {
                    vm.isSaved = false;
                    vm.isSavedDisplay = "Not Saved";
                    for (var i = 0; i < vm.user.savedShelters.length; i++) {
                        if (vm.user.savedShelters[i]._id === vm.shelterId) {
                            vm.isSaved = true;
                            vm.isSavedDisplay = "Saved";
                            break;
                        }
                    }
                    if (vm.shelter.users) {
                        console.log(vm.shelter.users);
                        console.log(vm.user._id);
                        for (i = 0; i < vm.shelter.users.length; i++) {
                            if (vm.shelter.users[i]._id === vm.user._id) {
                                vm.isOwner = true;
                            }
                        }
                    }
                }
                return PetService
                    .findPetsByShelterId(vm.shelterId, vm.source)
                    .then(findPetsByShelterIdSuccess, findPetsByShelterIdError);
            }

            function findPetsByShelterIdSuccess(response) {
                vm.pets = response.data;
            }

            function findPetsByShelterIdError(error) {

            }
        }
        init();

        function saveShelter() {
            ShelterService
                .saveShelter(vm.user._id, vm.shelterId, vm.isSaved)
                .then(saveShelterSuccess, saveShelterError);

            function saveShelterSuccess(response) {
                vm.user = response.data;
                $rootScope.currentUser = response.data;
                vm.isSaved = !vm.isSaved;
                if (vm.isSaved) {
                    vm.isSavedDisplay = "Saved";

                } else {
                    vm.isSavedDisplay = "Not Saved";
                }
            }

            function saveShelterError(error) {

            }
        }
    }
})();