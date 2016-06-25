(function() {
    angular
        .module("PetShelter")
        .controller("ShelterEditController", ShelterEditController);

    // controller for the shelter-edit.view.client.html template
    function ShelterEditController($rootScope, $location, $routeParams, ShelterService) {
        var vm = this;

        vm.updateShelter = updateShelter;

        vm.shelterId = $routeParams["shelterId"];
        vm.user = $rootScope.currentUser;

        function init() {
            ShelterService
                .findShelterById(vm.shelterId)
                .then(findShelterByIdSuccess, findShelterByIdError);

            function findShelterByIdSuccess(response) {
                var existingShelter = response.data;
                if (!$.isEmptyObject(existingShelter)) {
                    vm.shelter = existingShelter;
                }
            }

            function findShelterByIdError(error) {

            }
        }
        init();

        function updateShelter(shelter) {
            ShelterService
                .updateShelter(vm.shelterId, shelter)
                .then(updateShelterSuccess, updateShelterError);

            function updateShelterSuccess(response) {
                if (!$.isEmptyObject(response)) {
                    $location.url("/shelter/" + vm.shelterId);
                }
            }

            function updateShelterError(error) {

            }
        }
    }
})();