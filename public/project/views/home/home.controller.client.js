(function() {
    angular
        .module("PetShelter")
        .controller("HomeController", HomeController);

    // controller for the home.view.client.html template
    function HomeController($rootScope) {
        var vm = this;

        // event handlers
        vm.learnMore = learnMore;

        // initialize the home page by getting the current user
        function init() {
            // get the current user object from the rootScope if present
            vm.user = $rootScope.currentUser;
        }
        init();

        // When the user clicks the 'Learn More' button on the cover photo, scroll down the page to
        // the description about PetShelter.
        function learnMore() {
            $('html, body').animate({
                scrollTop: $('#ps-home-description').offset().top + 'px'
            }, 'slow');
        }
    }
})();