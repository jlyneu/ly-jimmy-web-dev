(function() {
    angular
        .module("PetShelter")
        .controller("ShelterNewController", ShelterNewController);

    // controller for the shelter-new.view.client.html template
    function ShelterNewController($rootScope, $location, ShelterService) {
        var vm = this;
        
        vm.createShelter = createShelter;

        vm.user = $rootScope.currentUser;
        
        function createShelter(shelter) {
            ShelterService
                .createShelter(vm.user._id, shelter)
                .then(createShelterSuccess, createShelterError);

            function createShelterSuccess(response) {
                var newShelter = response.data;
                if (!$.isEmptyObject(newShelter)) {
                    $location.url("/shelter/" + newShelter._id);
                }
            }

            function createShelterError(error) {

            }
        }
    }
})();