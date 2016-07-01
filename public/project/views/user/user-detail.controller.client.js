(function() {
    angular
        .module("PetShelter")
        .controller("UserDetailController", UserDetailController);

    // controller for the user-detail.view.client.html template
    function UserDetailController($rootScope, $location, $routeParams, UserService, ShelterService) {
        var vm = this;

        // no event handlers

        // fetch the user object from the database to populate the user details page
        function init() {
            // get current user from rootScope if present
            vm.user = $rootScope.currentUser;
            // initialize empty userDetail object
            vm.userDetail = {};
            // get user id from url
            vm.userDetail._id = $routeParams["userId"];
            
            UserService
                .findUserById(vm.userDetail._id)
                .then(findUserByIdSuccess, findUserByIdError)
                .then(findSheltersByUserIdSuccess, findSheltersByUserIdError);

            // a 200 came back so check to make sure that the user object actually came back. if so, get
            // the shelters that the user owns. otherwise, throw an error
            function findUserByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    // user object came back so populate user details on the page
                    vm.userDetail = response.data;

                    // fetch the shelters that the user owns
                    return ShelterService.findSheltersByUserId(vm.userDetail._id);
                } else {
                    // an empty object came back so an error occurred
                    throw new Error("Could not fetch user data at this time. Please try again later.")
                }
            }

            // an error occurred so propagate error
            function findUserByIdError(error) {
                throw new Error("Could not fetch user data at this time. Please try again later.")
            }

            // a 200 came back so check to make sure that the shelters list isn't null. otherwise display
            // an error.
            function findSheltersByUserIdSuccess(response) {
                if (response.data) {
                    vm.shelters = response.data;
                } else {
                    vm.error = "Could not fetch user data at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function findSheltersByUserIdError(error) {
                vm.error = "Could not fetch user data at this time. Please try again later.";
            }
        }
        init();

    }
})();