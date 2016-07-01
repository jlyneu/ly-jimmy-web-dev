(function() {
    angular
        .module("PetShelter")
        .factory("MessageService", MessageService);
    function MessageService($http) {
        var api = {
            "createMessage"                 : createMessage,
            "findMessagesByMessagethreadId" : findMessagesByMessagethreadId,
            "findMessageById"               : findMessageById,
            "updateMessage"                 : updateMessage,
            "deleteMessage"                 : deleteMessage
        };
        return api;

        // return a promise for creating a message on the server. if the message was created
        // successfully, then the promise will resolve with the new message.
        // if the message was not created, the promise will resolve with an error.
        function createMessage(messagethreadId, message) {
            var url = "/api/petshelter/messagethread/" + messagethreadId + "/message";
            return $http.post(url, message);
        }

        // return a promise for finding messages by the given user id. if the messages were found,
        // then the promise will resolve with the existing messages. if the messages were not
        // found, then the promise will resolve with an error.
        function findMessagesByMessagethreadId(messagethreadId) {
            var url = "/api/petshelter/messagethread/" + messagethreadId + "/message";
            return $http.get(url);
        }

        // return a promise for finding a message by the given id. if the message was found,
        // then the promise will resolve with the existing message. if the message was not
        // found, then the promise will resolve with an error.
        function findMessageById(messageId) {
            var url = "/api/petshelter/message/" + messageId;
            return $http.get(url);
        }

        // return a promise for updating the given message on the server. if the message was updated
        // successfully, then the promise will resolve with the updated message. if the message was not
        // updated, then the promise will resolve with an error.
        function updateMessage(messageId, message) {
            var url = "/api/petshelter/message/" + messageId;
            return $http.put(url, message);
        }

        // return a promise for deleting the given message on the server. if the message was deleted
        // successfully, then the promise will resolve with 'true'. if the message was not
        // deleted, then the promise will resolve with an error.
        function deleteMessage(messageId) {
            var url = "/api/petshelter/message/" + messageId;
            return $http.delete(url);
        }
    }
})();