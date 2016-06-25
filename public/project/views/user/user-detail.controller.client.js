(function() {
    angular
        .module("PetShelter")
        .controller("UserDetailController", UserDetailController);

    // controller for the user-detail.view.client.html template
    function UserDetailController($rootScope, $location, $routeParams, UserService) {
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
            }

            function findUserByIdError(error) {

            }
        }
        init();

    }
})();