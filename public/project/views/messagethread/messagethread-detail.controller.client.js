(function() {
    angular
        .module("PetShelter")
        .controller("MessagethreadDetailController", MessagethreadDetailController);

    // controller for the messagethread-detail.view.client.html template
    function MessagethreadDetailController($rootScope, $routeParams, MessagethreadService, MessageService) {
        var vm = this;

        // event handlers
        vm.send = send;
        vm.getMessageClass = getMessageClass;

        // get current user from rootScope if present
        vm.user = $rootScope.currentUser;
        // get messagethread id from URL
        vm.messagethreadId = $routeParams["messagethreadId"];

        // initialize messagethread detail page by getting messages for the current message thread as well
        // as the messagethread info as well
        function init() {
            MessageService
                .findMessagesByMessagethreadId(vm.messagethreadId)
                .then(findMessagesByMessagethreadIdSuccess, findMessagesByMessagethreadIdError)
                .then(findMessagethreadByIdSuccess, displayError);

            // a 200 came back. if the message list isn't null, set the messages then look for the messagethread
            // info. otherwise and error occurred so throw an error.
            function findMessagesByMessagethreadIdSuccess(response) {
                if (response.data) {
                    vm.messages = response.data;
                    return MessagethreadService.findMessagethreadById(vm.messagethreadId);
                } else {
                    throw new Error("Could not fetch messages at this time. Please try again later.");
                }
            }

            // an error occurred so throw a new error
            function findMessagesByMessagethreadIdError(error) {
                throw new Error("Could not fetch messages at this time. Please try again later.");
            }

            // a 200 came back. if the messagethread object is not empty, set the messagethread.
            // otherwise, an error occurred to display an error.
            function findMessagethreadByIdSuccess(response) {
                vm.messagethread = response.data;
            }

            // an error occurred so display an error
            function displayError(error) {
                vm.error = "Could not fetch messages at this time. Please try again later.";
            }
        }
        init();

        // pass the message object to the server to create an instance in the database. if creation is successful,
        // then push the message into this messagethread message list
        function send(message) {
            var messageObj = {
                _messagethread: vm.messagethread._id,
                text: message,
                _user: vm.user
            };
            MessageService
                .createMessage(vm.messagethread._id, messageObj)
                .then(createMessageSuccess, createMessageError);

            // a 200 came back. if the message object is not empty, push the message object into the current
            // conversation. otherwise, an error occurred to display an error
            function createMessageSuccess(response) {
                if (!$.isEmptyObject(response)) {
                    messageObj = response.data;
                    messageObj._user = vm.user;
                    vm.messages.push(messageObj);
                    vm.message = "";
                } else {
                    vm.error = "Could not send message at this time. Please try again later.";
                }
            }

            // an error occurred so display an error
            function createMessageError(error) {
                vm.error = "Could not send message at this time. Please try again later.";
            }
        }

        // if the given userId of the message matches the current user's _id value, then return the css
        // class that will color the message blue. otherwise return the green css class for the message
        function getMessageClass(userId) {
            if (userId == vm.user._id) {
                return "ps-message-detail-message-user";
            } else {
                return "ps-message-detail-message-other";
            }
        }
    }
})();