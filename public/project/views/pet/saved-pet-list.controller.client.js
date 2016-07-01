(function() {
    angular
        .module("PetShelter")
        .controller("SavedPetListController", SavedPetListController);

    // controller for the saved-pet-list.view.client.html template
    function SavedPetListController($rootScope, UserService) {
        var vm = this;

        // no event handlers

        // get the current user from the rootScope if present
        vm.user = $rootScope.currentUser;

        // initialize the saved pet list page by fetching the user's list of saved pets
        function init() {
            UserService
                .findUserById(vm.user._id)
                .then(findUserByIdSuccess, findUserByIdError);


            // a 200 came back. if the user object was returned, then populate the page with
            // the user's saved pets. otherwise, display an error.
            function findUserByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    var user = response.data;
                    vm.savedPets = user.savedPets;
                } else {
                    vm.error = "Could not fetch saved pets at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function findUserByIdError(error) {
                vm.error = "Could not fetch saved pets at this time. Please try again later.";
            }
        }
        init();
    }
})();