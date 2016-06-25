(function() {
    angular
        .module("PetShelter")
        .controller("ProfileDetailController", ProfileDetailController);

    // controller for the profile-detail.view.client.html template
    function ProfileDetailController($rootScope, $location, UserService) {
        var vm = this;

        vm.logout = logout;

        vm.user = $rootScope.currentUser;

        // make a request to the server to logout the current user. if successful,
        // route the user to the login page. also clear the current user from the rootScope.
        // otherwise, an error occurred so display an error.
        function logout() {
            UserService
                .logout()
                .then(logoutSuccess, logoutError);

            function logoutSuccess(response) {
                $rootScope.currentUser = null;
                $location.url("/");
            }

            function logoutError(error) {
                vm.error = "Could not logout. Please try again later.";
            }
        }
    }
})();