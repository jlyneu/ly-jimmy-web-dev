(function() {
    angular
        .module("PetShelter")
        .controller("UserDetailController", UserDetailController);

    // controller for the user-detail.view.client.html template
    function UserDetailController($rootScope, $location, $routeParams, UserService, ShelterService) {
        var vm = this;

        vm.user = $rootScope.currentUser;
        vm.userDetail = {}
        vm.userDetail._id = $routeParams["userId"];

        function init() {
            UserService
                .findUserById(vm.userDetail._id)
                .then(findUserByIdSuccess, findUserByIdError);

            function findUserByIdSuccess(response) {
                vm.userDetail = response.data;

                ShelterService
                    .findSheltersByUserId(vm.userDetail._id)
                    .then(findSheltersByUserIdSuccess, findSheltersByUserIdError);
            }

            function findUserByIdError(error) {

            }

            function findSheltersByUserIdSuccess(response) {
                vm.shelters = response.data;
            }

            function findSheltersByUserIdError(error) {

            }
        }
        init();

    }
})();