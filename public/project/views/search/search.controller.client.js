(function() {
    angular
        .module("PetShelter")
        .controller("SearchController", SearchController);

    // controller for the search.view.client.html template
    function SearchController($rootScope, $location, ShelterService, PetService, PetShelterConstants) {
        var vm = this;

        // event handlers
        vm.search = search;
        vm.loadMore = loadMore;

        // initialize search page by getting current user and dropdown options/
        // if there are search parameters in the url, then perform an initial search
        function init() {
            // get current user from rootScope if present
            vm.user = $rootScope.currentUser;
            // will be true once search is ran
            vm.hasSearched = false;
            // determines whether 'Load more' button should be showing. only show when there
            // are search results. hide if 'Load more' search doesn't return additional results
            vm.showLoadMore = false;
            // determines offset for search results when the user clicks 'Load more'
            vm.pageOffset = 0;
            // get options for search field dropdowns
            vm.animals = PetShelterConstants.getAnimals();
            vm.breeds = PetShelterConstants.getBreeds();
            vm.sizes = PetShelterConstants.getSizes();
            vm.sexes = PetShelterConstants.getSexes();
            vm.ages = PetShelterConstants.getAges();
            // do initial search if there are search parameters in the URL
            if (!$.isEmptyObject($location.search())) {
                vm.query = $location.search();
                vm.search(vm.query);
            }
        }
        init();

        // send the search query to the server, searching in both the database and with the third party
        // petfinder api. the results will be populated in the search results at the bottom of the page
        function search(query) {
            // make sure that the user provides a zip code
            if (!query || !query.location) {
                vm.error = "Zip code is required";
                scrollToError();
                return;
            }
            
            // reset page offset
            vm.pageOffset = 0;

            // store the search parameters in the URL for browsing history purposes
            $location.search(query);
            
            PetService.findPet(query)
                .then(findPetSuccess, findPetError);

            // a 200 came back. if null is not returned, set the returned list of pets then scroll
            // down to the search results.
            function findPetSuccess(response) {
                if (response.data) {
                    vm.hasSearched = true;
                    vm.pets = response.data;
                    // when trying to scroll directly after setting the pets, angular has not updated the DOM yet
                    // so jQuery has nothing to scroll down to. a better solution would be to have some listener
                    // that fires after angular has updated the DOM for the search results
                    if (vm.pets.length > 0) {
                        vm.showLoadMore = true;
                        vm.pageOffset += 25;
                        setTimeout(function() {
                            if ($('#ps-search-results')) {
                                $('html, body').animate({
                                    scrollTop: $('#ps-search-results').offset().top + 'px'
                                }, 'slow');
                            }
                        }, 500);
                    } else {
                        setTimeout(function() {
                            if ($('.ps-search-last')) {
                                $('html, body').animate({
                                    scrollTop: $('.ps-search-last').offset().top + 'px'
                                }, 'slow');
                            }
                        }, 500);
                    }

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
        
        // search for the next page of pets from the Petfinder third party API and append
        // the pets to the end of the search results
        function loadMore() {
            var query = $location.search();
            query.offset = vm.pageOffset;
            vm.showLoadMore = false;
            PetService
                .findPet($location.search())
                .then(findPetSuccess, findPetError);
            
            // a 200 came back. if pets were returned, append the new pets to the current
            // results list. otherwise hide the load more button
            function findPetSuccess(response) {
                if (response.data) {
                    var newPets = response.data;
                    if (newPets.length == 0) {
                        vm.showLoadMore = false;
                    } else {
                        vm.pageOffset += 25;
                        vm.pets = vm.pets.concat(newPets);
                        vm.showLoadMore = true;
                    }
                } else {
                    vm.showLoadMore = false;
                }
            }
            
            // an error occurred so hide the load more button
            function findPetError(error) {
                vm.showLoadMore = false;
            }
        }
    }
})();