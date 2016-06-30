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
                console.log(vm.messagethreads);
                vm.messagethreads.sort(function(a, b) {
                    return new Date(b.dateUpdated) - new Date(a.dateUpdated);
                })
            }

            function findMessagethreadsByUserIdError(error) {

            }
        }
        init();
    }
})();