(function() {
    angular
        .module("PetShelter")
        .controller("ProfileDetailController", ProfileDetailController);

    // controller for the profile-detail.view.client.html template
    function ProfileDetailController($rootScope, $location, UserService) {
        var vm = this;

        // event handlers
        vm.logout = logout;

        // initialize profile detail page by getting current user
        function init() {
            // get current user from rootScope if present
            vm.user = $rootScope.currentUser;
        }
        init();

        // make a request to the server to logout the current user. if successful,
        // route the user to the login page. also clear the current user from the rootScope.
        // otherwise, an error occurred so display an error.
        function logout() {
            UserService
                .logout()
                .then(logoutSuccess, logoutError);

            // a 200 was returned, so remove the user from the rootScope and navigate to the home page
            function logoutSuccess(response) {
                $rootScope.currentUser = null;
                $location.url("/");
            }

            // if the server returned an error, then display an error
            function logoutError(error) {
                vm.error = "Could not logout. Please try again later.";
            }
        }
    }
})();