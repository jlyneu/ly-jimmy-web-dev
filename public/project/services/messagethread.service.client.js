(function() {
    angular
        .module("PetShelter")
        .factory("MessagethreadService", MessagethreadService);
    function MessagethreadService($http) {
        var api = {
            "createMessagethread"           : createMessagethread,
            "findMessagethreadsByUserId" : findMessagethreadsByUserId,
            "findMessagethreadById"         : findMessagethreadById,
            "updateMessagethread"           : updateMessagethread,
            "deleteMessagethread"           : deleteMessagethread
        };
        return api;

        // return a promise for creating a messagethread on the server. if the messagethread was created
        // successfully, then the promise will resolve with the new messagethread.
        // if the messagethread was not created, the promise will resolve with an error.
        function createMessagethread(userId, messagethread) {
            var url = "/api/petshelter/user/" + userId + "/messagethread";
            return $http.post(url, messagethread);
        }

        // return a promise for finding messagethreads by the given user id. if the messagethreads were found,
        // then the promise will resolve with the existing messagethreads. if the messagethreads were not
        // found, then the promise will resolve with an error.
        function findMessagethreadsByUserId(userId) {
            var url = "/api/petshelter/user/" + userId + "/messagethread";
            return $http.get(url);
        }

        // return a promise for finding a messagethread by the given id. if the messagethread was found,
        // then the promise will resolve with the existing messagethread. if the messagethread was not
        // found, then the promise will resolve with an error.
        function findMessagethreadById(messagethreadId) {
            var url = "/api/petshelter/messagethread/" + messagethreadId;
            return $http.get(url);
        }

        // return a promise for updating the given messagethread on the server. if the messagethread was updated
        // successfully, then the promise will resolve with the updated messagethread. if the messagethread was not
        // updated, then the promise will resolve with an error.
        function updateMessagethread(messagethreadId, messagethread) {
            var url = "/api/petshelter/messagethread/" + messagethreadId;
            return $http.put(url, messagethread);
        }

        // return a promise for deleting the given messagethread on the server. if the messagethread was deleted
        // successfully, then the promise will resolve with 'true'. if the messagethread was not
        // deleted, then the promise will resolve with an error.
        function deleteMessagethread(messagethreadId) {
            var url = "/api/petshelter/messagethread/" + messagethreadId;
            return $http.delete(url);
        }
    }
})();