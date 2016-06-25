(function() {
    angular
        .module("PetShelter")
        .controller("SavedShelterListController", SavedShelterListController);

    // controller for the saved-shelter-list.view.client.html template
    function SavedShelterListController($rootScope, UserService) {
        var vm = this;

        vm.user = $rootScope.currentUser;

        function init() {
            UserService
                .findUserById(vm.user._id)
                .then(findUserByIdSuccess, findUserByIdError);


            function findUserByIdSuccess(response) {
                var user = response.data;
                vm.savedShelterss = user.savedShelters;
            }

            function findUserByIdError(error) {

            }
        }
        init();
    }
})();