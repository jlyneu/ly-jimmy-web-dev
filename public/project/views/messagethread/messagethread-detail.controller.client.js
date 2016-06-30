(function() {
    angular
        .module("PetShelter")
        .controller("MessagethreadDetailController", MessagethreadDetailController);

    // controller for the messagethread-detail.view.client.html template
    function MessagethreadDetailController($rootScope, $routeParams, MessagethreadService, MessageService) {
        var vm = this;

        vm.send = send;

        vm.user = $rootScope.currentUser;
        vm.messagethreadId = $routeParams["messagethreadId"];

        function init() {
            MessageService
                .findMessagesByMessagethreadId(vm.messagethreadId)
                .then(findMessagesByMessagethreadIdSuccess, findMessagesByMessagethreadIdError);


            function findMessagesByMessagethreadIdSuccess(response) {
                vm.messages = response.data;
                MessagethreadService
                    .findMessagethreadById(vm.messagethreadId)
                    .then(findMessagethreadByIdSuccess, findMessagethreadByIdError);
            }

            function findMessagesByMessagethreadIdError(error) {

            }

            function findMessagethreadByIdSuccess(response) {
                vm.messagethread = response.data;
            }

            function findMessagethreadByIdError(error) {

            }
        }
        init();

        function send(message) {
            var messageObj = {
                _messagethread: vm.messagethread._id,
                text: message,
                _user: vm.user._id
            };
            MessageService
                .createMessage(vm.messagethread._id, messageObj)
                .then(createMessageSuccess, createMessageError);
            
            function createMessageSuccess(response) {
                vm.messages.push(messageObj);
                vm.message = "";
            }
            
            function createMessageError(error) {
                
            }
        }
    }
})();