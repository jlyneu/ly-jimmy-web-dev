(function() {
    angular
        .module("PetShelter")
        .controller("SearchController", SearchController);

    // controller for the search.view.client.html template
    function SearchController($rootScope, PetService, PetShelterConstants) {
        var vm = this;
        
        vm.search = search;

        vm.user = $rootScope.currentUser;
        vm.animals = PetShelterConstants.getAnimals();
        vm.breeds = PetShelterConstants.getBreeds();
        vm.sizes = PetShelterConstants.getSizes();
        vm.sexes = PetShelterConstants.getSexes();
        vm.ages = PetShelterConstants.getAges();
        
        function search(query) {
            if (!query.location) {
                vm.error = "Location is required";
            }
            
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