(function() {
    angular
        .module("PetShelter")
        .controller("ProfileEditController", ProfileEditController);

    // controller for the profile-edit.view.client.html template
    function ProfileEditController($rootScope, $location, UserService) {
        var vm = this;
        
        vm.update = update;
        
        vm.user = $rootScope.currentUser;
        
        function update(user) {
            UserService
                .updateUser(user._id, user)
                .then(updateUserSuccess, updateUserError);

            function updateUserSuccess(response) {
                if (!$.isEmptyObject(response)) {
                    // update cached current user
                    $rootScope.user = user;
                    $location.url("/profile");
                }
            }

            function updateUserError(error) {

            }
        }
    }
})();