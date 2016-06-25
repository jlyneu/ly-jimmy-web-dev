(function() {
    angular
        .module("PetShelter")
        .controller("SearchController", SearchController);

    // controller for the search.view.client.html template
    function SearchController($rootScope, PetService) {
        var vm = this;
        
        vm.search = search;

        vm.user = $rootScope.currentUser;
        
        function search(query) {
            PetService.findPet(query)
                .then(findPetSuccess, findPetError);

            function findPetSuccess(response) {
                vm.pets = response.data;
            }

            function findPetError(error) {

            }
        }
    }
})();