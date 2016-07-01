(function() {
    angular
        .module("PetShelter")
        .controller("SearchController", SearchController);

    // controller for the search.view.client.html template
    function SearchController($rootScope, $location, ShelterService, PetService, PetShelterConstants) {
        var vm = this;

        // event handlers
        vm.search = search;

        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;
        // get options for search field dropdowns
        vm.animals = PetShelterConstants.getAnimals();
        vm.breeds = PetShelterConstants.getBreeds();
        vm.sizes = PetShelterConstants.getSizes();
        vm.sexes = PetShelterConstants.getSexes();
        vm.ages = PetShelterConstants.getAges();

        // send the search query to the server, searching in both the database and with the third party
        // petfinder api. the results will be populated in the search results at the bottom of the page
        function search(query) {
            // make sure that the user provides a zip code
            if (!query || !query.location) {
                vm.error = "Zip code is required";
                scrollToError();
                return;
            }
            
            PetService.findPet(query)
                .then(findPetSuccess, findPetError);

            // a 200 came back. if null is not returned, set the returned list of pets then scroll
            // down to the search results.
            function findPetSuccess(response) {
                if (response.data) {
                    vm.pets = response.data;
                    // when trying to scroll directly after setting the pets, angular has not updated the DOM yet
                    // so jQuery has nothing to scroll down to. a better solution would be to have some listener
                    // that fires after angular has updated the DOM for the search results
                    setTimeout(function() {
                        $('html, body').animate({
                            scrollTop: $('#ps-search-results').offset().top + 'px'
                        }, 'slow');
                    }, 250);
                } else {
                    vm.error = "Could not search for pets at this time. Please try again later.";
                    scrollToError();
                }
            }

            // an error occurred so display an error
            function findPetError(error) {
                if (error && error.data && error.data.message) {
                    vm.error = error.data.message;
                    scrollToError();
                } else {
                    vm.error = "Could not perform search at this time. Please try again later.";
                    scrollToError();
                }
            }

            // scroll to the top of the page so that the user can see the error message more easily
            function scrollToError() {
                $('html, body').animate({
                    scrollTop: $('ps-header').offset().top + 'px'
                }, 'slow');
            }
        }
    }
})();