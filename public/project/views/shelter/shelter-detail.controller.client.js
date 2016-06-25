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

        function init() {
            ShelterService
                .findShelterById(vm.shelterId)
                .then(findShelterByIdSuccess, findShelterByIdError);


            function findShelterByIdSuccess(response) {
                vm.shelter = response.data;
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
                    for (i = 0; i < vm.shelter.users.length; i++) {
                        if (vm.shelter.users[i] === vm.user._id) {
                            vm.isOwner = true;
                            return PetService
                                .findPetsByShelterId(vm.shelterId)
                                .then(findPetsByShelterIdSuccess, findPetsByShelterIdError);
                        }
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

            function pushShelter(shelterId) {
                vm.user.savedShelters.push(shelterId);
                $rootScope.savedShelters.push(shelterId);
            }

            function pullShelter(shelterId) {
                for (var i = 0; i < vm.user.savedShelters.length; i++) {
                    if (vm.user.savedShelters[i] === shelterId) {
                        vm.user.savedShelters.splice(i, 1);
                        $rootScope.currentUser.savedShelters.splice(i, 1);
                    }
                }
            }
        }
    }
})();