(function() {
    angular
        .module("PetShelter")
        .factory("NotificationService", NotificationService);
    function NotificationService($http) {
        var api = {
            "createNotification"           : createNotification,
            "findNotificationsByUserId" : findNotificationsByUserId,
            "findNotificationById"         : findNotificationById,
            "updateNotification"           : updateNotification,
            "deleteNotification"           : deleteNotification
        };
        return api;

        // return a promise for creating a notification on the server. if the notification was created
        // successfully, then the promise will resolve with the new notification.
        // if the notification was not created, the promise will resolve with an error.
        function createNotification(userId, notification) {
            var url = "/api/petshelter/petfinder/user/" + userId + "/notification";
            return $http.post(url, notification);
        }

        // return a promise for finding notifications by the given user id. if the notifications were found,
        // then the promise will resolve with the existing notifications. if the notifications were not
        // found, then the promise will resolve with an error.
        function findNotificationsByUserId(userId) {
            var url = "/api/petshelter/petfinder/user/" + userId + "/notification";
            return $http.get(url);
        }

        // return a promise for finding a notification by the given id. if the notification was found,
        // then the promise will resolve with the existing notification. if the notification was not
        // found, then the promise will resolve with an error.
        function findNotificationById(notificationId) {
            var url = "/api/petshelter/petfinder/notification/" + notificationId;
            return $http.get(url);
        }

        // return a promise for updating the given notification on the server. if the notification was updated
        // successfully, then the promise will resolve with the updated notification. if the notification was not
        // updated, then the promise will resolve with an error.
        function updateNotification(notificationId, notification) {
            var url = "/api/petshelter/petfinder/notification/" + notificationId;
            return $http.put(url, notification);
        }

        // return a promise for deleting the given notification on the server. if the notification was deleted
        // successfully, then the promise will resolve with 'true'. if the notification was not
        // deleted, then the promise will resolve with an error.
        function deleteNotification(notificationId) {
            var url = "/api/petshelter/petfinder/notification/" + notificationId;
            return $http.delete(url);
        }
    }
})();