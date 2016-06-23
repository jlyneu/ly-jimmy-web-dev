(function() {
    angular
        .module("PetShelter")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "/project/views/home/home.view.client.html",
            controller: "HomeController",
            controllerAs: "model"
        }).when("/login", {
            templateUrl: "/project/views/login/login.view.client.html",
            controller: "LoginController",
            controllerAs: "model"
        }).when("/register", {
            templateUrl: "/project/views/register/register.view.client.html",
            controller: "RegisterController",
            controllerAs: "model"
        }).when("/profile", {
            templateUrl: "/project/views/profile/profile.view.client.html",
            controller: "ProfileController",
            controllerAs: "model"
        }).when("/profile/message", {
            templateUrl: "/project/views/messagethread/messagethread-list.view.client.html",
            controller: "MessagethreadListController",
            controllerAs: "model"
        }).when("/profile/message/:messagethreadId", {
            templateUrl: "/project/views/messagethread/messagethread-detail.view.client.html",
            controller: "MessagethreadDetailController",
            controllerAs: "model"
        }).when("/profile/shelter", {
            templateUrl: "/project/views/shelter/shelter-list.view.client.html",
            controller: "ShelterListController",
            controllerAs: "model"
        }).when("/profile/saved/shelter", {
            templateUrl: "/project/views/shelter/saved-shelter-list.view.client.html",
            controller: "SavedShelterListController",
            controllerAs: "model"
        }).when("/profile/saved/pet", {
            templateUrl: "/project/views/pet/saved-pet-list.view.client.html",
            controller: "SavedPetListController",
            controllerAs: "model"
        }).when("/user/:userId", {
            templateUrl: "/project/views/user/user-detail.view.client.html",
            controller: "UserDetailController",
            controllerAs: "model"
        }).when("/search", {
            templateUrl: "/project/views/search/search.view.client.html",
            controller: "SearchController",
            controllerAs: "model"
        }).when("/shelter/new", {
            templateUrl: "/project/views/shelter/shelter-new.view.client.html",
            controller: "ShelterNewController",
            controllerAs: "model"
        }).when("/shelter/:shelterId", {
            templateUrl: "/project/views/shelter/shelter-detail.view.client.html",
            controller: "ShelterDetailController",
            controllerAs: "model"
        }).when("/shelter/:shelterId/edit", {
            templateUrl: "/project/views/shelter/shelter-edit.view.client.html",
            controller: "ShelterEditController",
            controllerAs: "model"
        }).when("/shelter/:shelterId/pet/new", {
            templateUrl: "/project/views/pet/pet-new.view.client.html",
            controller: "PetNewController",
            controllerAs: "model"
        }).when("/shelter/:shelterId/pet/:petId", {
            templateUrl: "/project/views/shelter/shelter-edit.view.client.html",
            controller: "PetDetailController",
            controllerAs: "model"
        }).when("/shelter/:shelterId/pet/:petId/edit", {
            templateUrl: "/project/views/shelter/shelter-edit.view.client.html",
            controller: "PetEditController",
            controllerAs: "model"
        }).otherwise({
            redirectTo: "/"
        });
    }
})();