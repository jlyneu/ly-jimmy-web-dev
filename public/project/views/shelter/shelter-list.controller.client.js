(function() {
    angular
        .module("PetShelter")
        .controller("ShelterListController", ShelterListController);

    // controller for the shelter-list.view.client.html template
    function ShelterListController($rootScope, ShelterService) {
        var vm = this;

        // no event handlers

        // initialize shelter list page by fetching shelters form the server that current user manages
        function init() {
            // get current user from rootScope if present
            vm.user = $rootScope.currentUser;
            
            ShelterService
                .findSheltersByUserId(vm.user._id)
                .then(findSheltersByUserIdSuccess, findSheltersByUserIdError);

            // a 200 came back so make sure null didn't come back from server. if null, display an error.
            // otherwise populate the shelter list
            function findSheltersByUserIdSuccess(response) {
                vm.shelters = response.data;
                if (vm.shelters.length === 0) {
                    vm.noShelters = true;
                }
            }

            // an error occurred so display an error
            function findSheltersByUserIdError(error) {
                vm.error = "Could not get shelters at this time. Please try again later.";
            }
        }
        init();
    }
})();