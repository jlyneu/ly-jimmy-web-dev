(function() {
    angular
        .module("PetShelter")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "/project/views/home/home.view.client.html",
            controller: "HomeController",
            controllerAs: "model",
            resolve: { loggedin: resolveUser }
        }).when("/login", {
            templateUrl: "/project/views/login/login.view.client.html",
            controller: "LoginController",
            controllerAs: "model",
            resolve: { loggedin: resolveUser }
        }).when("/register", {
            templateUrl: "/project/views/register/register.view.client.html",
            controller: "RegisterController",
            controllerAs: "model",
            resolve: { loggedin: resolveUser }
        }).when("/profile", {
            templateUrl: "/project/views/profile/profile-detail.view.client.html",
            controller: "ProfileDetailController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/profile/edit", {
            templateUrl: "/project/views/profile/profile-edit.view.client.html",
            controller: "ProfileEditController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/profile/message", {
            templateUrl: "/project/views/messagethread/messagethread-list.view.client.html",
            controller: "MessagethreadListController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/profile/message/:messagethreadId", {
            templateUrl: "/project/views/messagethread/messagethread-detail.view.client.html",
            controller: "MessagethreadDetailController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/profile/shelter", {
            templateUrl: "/project/views/shelter/shelter-list.view.client.html",
            controller: "ShelterListController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/profile/saved/shelter", {
            templateUrl: "/project/views/shelter/saved-shelter-list.view.client.html",
            controller: "SavedShelterListController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/profile/saved/pet", {
            templateUrl: "/project/views/pet/saved-pet-list.view.client.html",
            controller: "SavedPetListController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/user/:userId", {
            templateUrl: "/project/views/user/user-detail.view.client.html",
            controller: "UserDetailController",
            controllerAs: "model",
            resolve: { loggedin: resolveUser }
        }).when("/search", {
            templateUrl: "/project/views/search/search.view.client.html",
            controller: "SearchController",
            controllerAs: "model",
            resolve: { loggedin: resolveUser }
        }).when("/shelter/new", {
            templateUrl: "/project/views/shelter/shelter-new.view.client.html",
            controller: "ShelterNewController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/shelter/:shelterId", {
            templateUrl: "/project/views/shelter/shelter-detail.view.client.html",
            controller: "ShelterDetailController",
            controllerAs: "model",
            resolve: { loggedin: resolveUser }
        }).when("/shelter/:shelterId/edit", {
            templateUrl: "/project/views/shelter/shelter-edit.view.client.html",
            controller: "ShelterEditController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/shelter/:shelterId/pet/new", {
            templateUrl: "/project/views/pet/pet-new.view.client.html",
            controller: "PetNewController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).when("/shelter/:shelterId/pet/:petId", {
            templateUrl: "/project/views/pet/pet-detail.view.client.html",
            controller: "PetDetailController",
            controllerAs: "model",
            resolve: { loggedin: resolveUser }
        }).when("/shelter/:shelterId/pet/:petId/edit", {
            templateUrl: "/project/views/pet/pet-edit.view.client.html",
            controller: "PetEditController",
            controllerAs: "model",
            resolve: { loggedin: checkLoggedin }
        }).otherwise({
            redirectTo: "/"
        });

        // make a call to the server to determine whether or not the user
        // is currently logged in. if the user is not logged in, then send
        // the user to the login page
        function checkLoggedin($q, $http, $timeout, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get("/api/petshelter/loggedin").success(function(user) {
                $rootScope.errorMessage = null;
                // if "0" didn't come back, then the user is indeed logged in so
                // cache the user in the rootScope
                if (user !== "0") {
                    $rootScope.currentUser = user;
                    deferred.resolve();
                } else {
                    deferred.reject();
                    $location.url("/login");
                }
            });
            return deferred.promise;
        }

        // make a call to the server to determine whether or not the user
        // is currently logged in. if the user is not logged in, then don't
        // take any action. this is for pages that don't require authentication
        // but should display the user's name in the header
        function resolveUser($q, $http, $timeout, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get("/api/petshelter/loggedin").success(function(user) {
                $rootScope.errorMessage = null;
                // if "0" didn't come back, then the user is indeed logged in so
                // cache the user in the rootScope
                if (user !== "0") {
                    $rootScope.currentUser = user;
                    deferred.resolve();
                } else {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }
    }
})();