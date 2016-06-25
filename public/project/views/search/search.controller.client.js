(function() {
    angular
        .module("PetShelter")
        .controller("SearchController", SearchController);

    // controller for the search.view.client.html template
    function SearchController(PetService) {
        var vm = this;
        
        vm.search = search;
        
        function search(query) {
            PetService.findPet(query);
        }
    }
})();