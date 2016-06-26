(function() {
    angular
        .module("PetShelter")
        .controller("MessagethreadListController", MessagethreadListController);

    // controller for the messagethread-list.view.client.html template
    function MessagethreadListController($rootScope, MessagethreadService) {
        var vm = this;
        
        vm.user = $rootScope.currentUser;

        function init() {
            MessagethreadService
                .findMessagethreadsByUserId(vm.user._id)
                .then(findMessagethreadsByUserIdSuccess, findMessagethreadsByUserIdError);


            function findMessagethreadsByUserIdSuccess(response) {
                vm.messagethreads = response.data;
            }

            function findMessagethreadsByUserIdError(error) {

            }
        }
        init();
    }
})();