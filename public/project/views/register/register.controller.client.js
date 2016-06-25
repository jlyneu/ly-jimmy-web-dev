(function() {
    angular
        .module("PetShelter")
        .controller("RegisterController", RegisterController);

    // controller for the register.view.client.html template
    function RegisterController($rootScope, $location, UserService) {
        var vm = this;

        vm.register = register;

        function register(user) {
            UserService
                .register(user)
                .then(registerSuccess, registerError);

            function registerSuccess(response) {
                var newUser = response.data;
                if (!$.isEmptyObject(newUser)) {
                    $rootScope.currentUser = newUser;
                    $location.url("/profile");
                }
            }

            function registerError(error) {

            }
        }
    }
})();