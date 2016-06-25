(function() {
    angular
        .module("PetShelter")
        .controller("SavedPetListController", SavedPetListController);

    // controller for the saved-pet-list.view.client.html template
    function SavedPetListController($rootScope, UserService) {
        var vm = this;

        vm.user = $rootScope.currentUser;

        function init() {
            UserService
                .findUserById(vm.user._id)
                .then(findUserByIdSuccess, findUserByIdError);


            function findUserByIdSuccess(response) {
                var user = response.data;
                vm.savedPets = user.savedPets;
            }

            function findUserByIdError(error) {

            }
        }
        init();
    }
})();