(function() {
    angular
        .module("PetShelter")
        .controller("MessagethreadListController", MessagethreadListController);

    // controller for the messagethread-list.view.client.html template
    function MessagethreadListController($rootScope, MessagethreadService) {
        var vm = this;
        
        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;

        // intialize messagethread list page by finding message threads for current user
        function init() {
            MessagethreadService
                .findMessagethreadsByUserId(vm.user._id)
                .then(findMessagethreadsByUserIdSuccess, findMessagethreadsByUserIdError);
            
            // a 200 came back. if messagethreads returned arent null, then set messagethread data and sort
            // by last message time in each messagethread
            function findMessagethreadsByUserIdSuccess(response) {
                vm.messagethreads = response.data;
                // sort messages by last updated time
                vm.messagethreads.sort(function(a, b) {
                    return new Date(b.dateUpdated) - new Date(a.dateUpdated);
                })
            }

            function findMessagethreadsByUserIdError(error) {
                vm.error = "Could not fetch messages at this time. Please try again later.";
            }
        }
        init();
    }
})();