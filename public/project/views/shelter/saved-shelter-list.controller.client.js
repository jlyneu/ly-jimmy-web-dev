(function() {
    angular
        .module("PetShelter")
        .controller("SavedShelterListController", SavedShelterListController);

    // controller for the saved-shelter-list.view.client.html template
    function SavedShelterListController($rootScope, UserService) {
        var vm = this;

        // no event handlers

        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;

        // initialize saved shelter list page by fetching user's saved shelters from server
        function init() {
            UserService
                .findUserById(vm.user._id)
                .then(findUserByIdSuccess, findUserByIdError);
            
            // a 200 came back so make sure that the user object isn't empty. if empty, display an error.
            // otherwise, populate saved shelters
            function findUserByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    var user = response.data;
                    vm.savedShelters = user.savedShelters;
                } else {
                    vm.error = "Could not fetch shelters at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function findUserByIdError(error) {
                vm.error = "Could not fetch shelters at this time. Please try again later.";
            }
        }
        init();
    }
})();