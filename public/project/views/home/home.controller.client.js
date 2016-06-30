(function() {
    angular
        .module("PetShelter")
        .controller("HomeController", HomeController);

    // controller for the home.view.client.html template
    function HomeController($rootScope) {
        var vm = this;

        vm.learnMore = learnMore;

        vm.user = $rootScope.currentUser;

        function learnMore() {
            $('html, body').animate({
                scrollTop: $('#ps-home-description').offset().top + 'px'
            }, 'slow');
        }
    }
})();