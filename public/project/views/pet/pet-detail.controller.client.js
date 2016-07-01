(function() {
    angular
        .module("PetShelter")
        .controller("PetDetailController", PetDetailController);

    // controller for the pet-detail.view.client.html template
    function PetDetailController($rootScope, $location, $routeParams, ShelterService, PetService, MessagethreadService, MessageService) {
        var vm = this;

        // event handlers
        vm.savePet = savePet;
        vm.sendMessage = sendMessage;

        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;
        // get shelter id and pet id from URL
        vm.shelterId = $routeParams["shelterId"];
        vm.petId = $routeParams["petId"];
        // records whether current user has saved this shelter or not
        vm.saveStats = {
            isSaved: false,
            isSavedDisplay: "Save",
            isSavedClass: "btn-primary"
        };

        // initialize pet detail page by determining whether user has saved this pet, then getting the pet info.
        // then get the shelter info to determine whether the current user owns this pet
        function init() {
            if (vm.user) {
                // determine if the user has saved this pet or not
                vm.saveStats = {
                    isSaved: false,
                    isSavedDisplay: "Save",
                    isSavedClass: "btn-primary"
                };
                for (var i = 0; i < vm.user.savedPets.length; i++) {
                    if (vm.user.savedPets[i]._id === vm.petId) {
                        vm.saveStats = {
                            isSaved: true,
                            isSavedDisplay: "Saved",
                            isSavedClass: "btn-success"
                        }
                    }
                }
            }

            // get information about the pet from the server
            PetService
                .findPetById(vm.petId)
                .then(findPetByIdSuccess, displayError);

            // a 200 came back. if the pet object is not empty, set the pet information and try to find the shelter info.
            //  then try to see if the current user has any current messagethreads with this shelter.
            // otherwise an error occurred, so display an error.
            function findPetByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    vm.pet = response.data;
                    // check to see if this user owns this pet
                    ShelterService
                        .findShelterById(vm.shelterId)
                        .then(findShelterByIdSuccess, displayError);

                    // if this is a pet that was created in petfinder instead of petshelter, then we need
                    // to use the third party petfinder API to get the rest of the pet info
                    if (vm.pet.source == "PETFINDER") {
                        PetService
                            .findPetfinderPetById(vm.pet.petfinderId)
                            .then(findPetfinderPetByIdSuccess, displayError);
                    }

                    if (vm.user) {
                        MessagethreadService
                            .findMessagethreadsByUserId(vm.user._id)
                            .then(findMessagethreadsByUserIdSuccess, displayError);
                    }
                } else {
                    vm.error = "Could not fetch pet info at this time. Please try again later.";
                }
            }

            // display an error on the page
            function displayError(error) {
                vm.error = "Could not fetch pet info at this time. Please try again later.";
            }

            // a 200 came back. if the shelter object is not empty, set the shelter information and
            // determine whether the current user is an owner
            function findShelterByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    vm.shelter = response.data;
                    if (vm.user) {
                        for (var i = 0; i < vm.shelter.users.length; i++) {
                            if (vm.shelter.users[i]._id === vm.user._id) {
                                vm.isOwner = true;
                            }
                        }
                    }
                } else {
                    vm.error = "Could not fetch shelter info at this time. Please try again later.";
                }
            }

            // a 200 came back so set the pet info if the pet object is not empty. otherwise, an error occurred
            // so display an error
            function findPetfinderPetByIdSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    vm.pet = response.data;
                } else {
                    vm.error = "Could not fetch pet info at this time. Please try again later.";
                }
            }

            // a 200 came back so set the messagethread id if the messagethread object returned is not empty.
            // otherwise, an error occurred so display an error
            function findMessagethreadsByUserIdSuccess(response) {
                if (response.data) {
                    var messagethreads = response.data;
                    vm.hasMessagethread = false;
                    for (var i = 0; i < messagethreads.length; i++) {
                        if (vm.shelterId === messagethreads[i]._shelter._id) {
                            vm.hasMessagethread = true;
                            vm.messagethreadId = messagethreads[i]._id;
                            break;
                        }
                    }
                } else {
                    vm.error = "Could not fetch pet info at this time. Please try again later.";
                }
            }
        }
        init();

        // if the user has not saved this pet, then add this pet to the user's list
        // of saved pets. if the user has already saved this pet, then remove this pet
        // from the user's list of saved pets
        function savePet() {
            PetService
                .savePet(vm.user._id, vm.petId, vm.saveStats.isSaved)
                .then(savePetSuccess, savePetError);

            // a 200 came back. if the user object returned is not empty, update the current user and switch
            // the isSaved values. otherwise an error occurred so display an error
            function savePetSuccess(response) {
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
                    vm.error = "Could not change saved pets at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function savePetError(error) {
                vm.error = "Could not change saved pets at this time. Please try again later.";
            }
        }

        // create a message thread with the user, create the message that the user is sending, then navigate
        // user to the messagethread details page
        function sendMessage(message) {
            var newMessagethread;
            var messagethreadObj = {
                _user: vm.user._id,
                _shelter: vm.shelterId,
                messages: []
            };
            MessagethreadService
                .createMessagethread(vm.user._id, messagethreadObj)
                .then(createMessagethreadSuccess, displayError)
                .then(createMessageSuccess, displayError);

            // a 200 came back. if the messagethread object is not empty, then create the first message.
            // otherwise, throw an error.
            function createMessagethreadSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    newMessagethread = response.data;
                    var messageObj = {
                        _messagethread: newMessagethread._id,
                        text: message,
                        _user: vm.user._id
                    };
                    return MessageService.createMessage(newMessagethread._id, messageObj);
                } else {
                    throw new Error("Could not create message at this time. Please try again later.");
                }
            }

            // an error occurred so display an error to the user
            function displayError(error) {
                vm.error = "Could not create message at this time. Please try again later.";
            }

            // a 200 came back. if the message object is not empty, then navigate the user to the messagethread
            // details page
            function createMessageSuccess(response) {
                if (!$.isEmptyObject(response.data)) {
                    $location.url("/profile/message/" + newMessagethread._id);
                } else {
                    vm.error = "Could not create message at this time. Please try again later.";
                }
            }
        }
    }
})();