(function() {
    angular
        .module("PetShelter")
        .controller("ShelterDetailController", ShelterDetailController);

    // controller for the shelter-detail.view.client.html template
    function ShelterDetailController($rootScope, $routeParams, UserService, ShelterService, PetService) {
        var vm = this;

        // event handlers
        vm.saveShelter = saveShelter;
        vm.search = search;
        vm.addUser = addUser;
        vm.removeUser = removeUser;

        // initialize the shelter detail page by fetching the shelter by id then all of the pets
        // at this shelter. also determine whether the current user owns this shelter. if so,
        // then allow the user to edit the shelter or add additional pets.
        function init() {
            // get current user from rootScope if present
            vm.user = $rootScope.currentUser;
            // get shelter id from url
            vm.shelterId = $routeParams["shelterId"];
            // records whether current user has saved this shelter or not
            vm.saveStats = {
                isSaved: false,
                isSavedDisplay: "Save",
                isSavedClass: "btn-primary"
            };
            // records whether shelter was created in petshelter or in petfinder
            vm.source = null;

            ShelterService
                .findShelterById(vm.shelterId)
                .then(findShelterByIdSuccess, displayError);


            // a 200 came back. check to see if the shelter object is empty. if not empty, then
            // set the shelter. if the shelter object is empty, then display an error.
            // if the shelter originated from petfinder, lookup the shelter info from the
            // petfinder API. otherwise, look for this shelter's pets.
            function findShelterByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    vm.shelter = response.data;
                    vm.source = vm.shelter.source;

                    if (vm.shelter.source == "PETFINDER") {
                        // this shelter is from petfinder, so use the API to find the shelter info
                        ShelterService
                            .findPetfinderShelterById(vm.shelter.petfinderId)
                            .then(findPetfinderShelterByIdSuccess, displayError);
                    } else {
                        // this shelter is from petshelter, so we have all the shelter info. look for this
                        // shelter's pets
                        findShelterPets();
                    }
                } else {
                    // the shelter object came back empty so display an error
                    displayError();
                }
            }

            // an error occurred, so display an error
            function displayError(error) {
                vm.error = "Could not get shelter info at this time. Please try again later.";
            }

            // the shelter info was retried from the petfinder API, so set the shelter info and look
            // for the pets for this shelter.
            function findPetfinderShelterByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    vm.shelter = response.data;
                    findShelterPets();
                } else {
                    // the shelter object came back empty so display an error
                    displayError();
                }
            }

            // now that the shelter info has been found, determine whether the user has saved
            // this shelter and also whether the user owns this shelter.
            // then make a request to the server for this shelter's pets
            function findShelterPets() {
                // first check if the user is logged in
                if (vm.user) {
                    vm.saveStats = {
                        isSaved: false,
                        isSavedDisplay: "Save",
                        isSavedClass: "btn-primary"
                    };
                    // see if the user's saved shelters match this shelter
                    for (var i = 0; i < vm.user.savedShelters.length; i++) {
                        if (vm.user.savedShelters[i]._id === vm.shelterId) {
                            vm.saveStats = {
                                isSaved: true,
                                isSavedDisplay: "Saved",
                                isSavedClass: "btn-success"
                            };
                            break;
                        }
                    }
                    // see if this user is in this shelter's list of owners
                    if (vm.shelter.users) {
                        for (i = 0; i < vm.shelter.users.length; i++) {
                            if (vm.shelter.users[i]._id === vm.user._id) {
                                vm.isOwner = true;
                            }
                        }
                    }
                }
                // search for the pets for this shelter
                return PetService
                    .findPetsByShelterId(vm.shelterId, vm.source)
                    .then(findPetsByShelterIdSuccess, displayError);
            }

            // a 200 came back. if the pets list is not null, set the list of pets.
            // otherwise, display an error.
            function findPetsByShelterIdSuccess(response) {
                if (response.data) {
                    vm.pets = response.data;
                } else {
                    vm.error = "Could not fetch shelter pets at this time. Please try again later.";
                }
            }
        }
        init();

        // if the user has not saved this shelter, then add this shelter to the user's list
        // of saved shelters. if the user has already saved this shelter, then remove this shelter
        // from the user's list of saved shelters
        function saveShelter() {
            UserService
                .saveShelter(vm.user._id, vm.shelterId, vm.saveStats.isSaved)
                .then(saveShelterSuccess, saveShelterError);

            // a 200 came back. if the user object was returned, then the save/unsave was successful.
            // otherwise, display an error
            function saveShelterSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    // update user in rootScope
                    vm.user = response.data;
                    $rootScope.currentUser = response.data;
                    // switch isSaved flag value and button text
                    vm.saveStats.isSaved = !vm.saveStats.isSaved;
                    if (vm.saveStats.isSaved) {
                        vm.saveStats = {
                            isSaved: true,
                            isSavedDisplay: "Saved",
                            isSavedClass: "btn-success"
                        };

                    } else {
                        vm.saveStats = {
                            isSaved: false,
                            isSavedDisplay: "Save",
                            isSavedClass: "btn-primary"
                        };
                    }
                } else {
                    vm.error = "Could not change saved shelters at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function saveShelterError(error) {
                vm.error = "Could not change saved shelters at this time. Please try again later.";
            }
        }

        // search for the users whos name contains the contents of the input box on the page.
        // display the results below the input box.
        function search() {
            // don't search if the box is empty
            if (!vm.input) {
                vm.users = [];
                return;
            }
            UserService
                .findAllUsersByName(vm.input)
                .then(findAllUsersByNameSuccess, findAllUsersByNameError);

            // set the users found from the search
            function findAllUsersByNameSuccess(response) {
                var users = response.data;
                var filteredUsers = [];
                // filter out user results that are the current user or any users that manage this shelter
                for (var i = 0; i < users.length; i++) {
                    var isOwner = false;
                    for (var j = 0; j < vm.shelter.users.length; j++) {
                        if (users[i]._id === vm.shelter.users[j]._id) {
                            isOwner = true;
                            break;
                        }
                    }
                    if (!isOwner) {
                        filteredUsers.push(users[i]);
                    }
                }
                vm.users = filteredUsers;
            }

            // an error occurred so display an error
            function findAllUsersByNameError(error) {
                vm.error = "Could not fetch users at this time. Please try again later.";
            }
        }

        // add the user with the provided userId to this shelter's list of managing users
        function addUser(userId) {
            ShelterService
                .addUserToShelter(vm.shelterId, userId)
                .then(addUserToShelterSuccess, addUserToShelterError);

            // if user was successfully added, refresh the page. otherwise, display an error
            function addUserToShelterSuccess(response) {
                if (response.data) {
                    vm.shelter = response.data;
                    // clear the search results
                    vm.users = [];
                } else {
                    vm.error = "Could not add user to shelter at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function addUserToShelterError(error) {
                vm.error = "Could not add user to shelter at this time. Please try again later.";
            }
        }

        // remove the user with the provided userId from this shelter's list of managing users
        function removeUser(userId) {
            ShelterService
                .removeUserFromShelter(vm.shelterId, userId)
                .then(removeUserFromShelterSuccess, removeUserFromShelterError);

            // if user was successfully removed, refresh the page. otherwise, display an error
            function removeUserFromShelterSuccess(response) {
                if (response.data) {
                    vm.shelter = response.data;
                    // clear the search results
                    vm.users = [];
                } else {
                    vm.error = "Could not remove user from shelter at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function removeUserFromShelterError(error) {
                vm.error = "Could not remove user from shelter at this time. Please try again later.";
            }
        }
    }
})();