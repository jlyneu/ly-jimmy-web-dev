module.exports = function(app, models) {

    // declare the API
    app.post("/api/petfinder/user/:userId/notification", createNotification);
    app.get("/api/petfinder/user/:userId/notification", findAllNotificationsForUser);
    app.get("/api/petfinder/notification/:notificationId", findNotificationById);
    app.put("/api/petfinder/notification/:notificationId", updateNotification);
    app.delete("/api/petfinder/notification/:notificationId", deleteNotification);

    var notificationModel = models.notificationModel;

    // adds the notification body parameter instance to the local notifications array.
    // return the notification if creation was successful, otherwise return an error.
    function createNotification(req, res) {
        var userId = req.params["userId"];
        var notification = req.body;
        var errorMessage = {};

        // first check for validation errors
        if (!userId) {
            errorMessage.message = "A userId is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to create the notification in the database
        notificationModel
            .createNotification(userId, notification)
            .then(createNotificationSuccess, createNotificationError);

        // if the notification creation is successful, then return the new notification
        function createNotificationSuccess(newNotification) {
            if (newNotification) {
                res.json(newNotification);
            } else {
                errorMessage.message = "Could not create notification. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function createNotificationError(error) {
            errorMessage.message = "Could not create notification. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the notifications in local notifications array whose userId
    // matches the parameter userId
    function findAllNotificationsForUser(req, res) {
        var userId = req.params["userId"];
        var errorMessage = {};

        // try to find the notifications in the database
        notificationModel
            .findAllNotificationsForUser(userId)
            .then(findAllNotificationsForUserSuccess, findAllNotificationsForUserError);

        // return the notifications from the model. otherwise, something went wrong
        function findAllNotificationsForUserSuccess(notifications) {
            if (notifications) {
                res.json(notifications);
            } else {
                errorMessage.message = "Could not fetch notifications. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findAllNotificationsForUserError(error) {
            errorMessage.message = "Could not fetch notifications. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the notification in local notifications array whose _id matches
    // the notificationId parameter. return an error if the notification cannot be found.
    function findNotificationById(req, res) {
        var notificationId = req.params["notificationId"];
        var errorMessage = {};

        // try to find the notification in the database
        notificationModel
            .findNotificationById(notificationId)
            .then(findNotificationByIdSuccess, findNotificationByIdError);

        // return the notification from the model. otherwise, the notification wasn't found
        function findNotificationByIdSuccess(notification) {
            if (notification) {
                res.json(notification);
            } else {
                errorMessage.message = "Notification with id " + notificationId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findNotificationByIdError(error) {
            errorMessage.message = "Could not fetch notification. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // updates the notification in local notifications array whose _id matches
    // the notificationId parameter
    // return the updated notification if successful, otherwise return an error
    function updateNotification(req, res) {
        var notificationId = req.params["notificationId"];
        var notification = req.body;
        var errorMessage = {};

        if (!notification.name) {
            errorMessage.message = "A notification name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to update the notification in the database
        notificationModel
            .updateNotification(notificationId, notification)
            .then(updateNotificationSuccess, updateNotificationError);

        // return the notification if update successful. otherwise the notification wasn't found
        function updateNotificationSuccess(numUpdated) {
            if (numUpdated) {
                res.json(notification);
            } else {
                errorMessage.message = "Notification with id " + notificationId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function updateNotificationError(error) {
            errorMessage.message = "Could not update notification. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the notification from local notifications array whose _id matches
    // the notificationId parameter.
    // return true if the notification is successfully deleted, otherwise return an error.
    function deleteNotification(req, res) {
        var notificationId = req.params["notificationId"];
        var errorMessage = {};

        // try to delete the notification from the database
        notificationModel
            .deleteNotification(notificationId)
            .then(deleteNotificationSuccess, deleteNotificationError);

        // if deletion is successful, then return true. otherwise, the notification wasn't found
        function deleteNotificationSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "Notification with id " + notificationId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function deleteNotificationError(error) {
            errorMessage.message = "Could not delete notification. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }
};