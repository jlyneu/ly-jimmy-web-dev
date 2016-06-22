module.exports = function(mongoose) {

    var NotificationSchema = require("./notification.schema.server.js")(mongoose);
    var Notification = mongoose.model("Notification", NotificationSchema);

    var api = {
        createNotification: createNotification,
        findAllNotificationsForUser: findAllNotificationsForUser,
        findNotificationById: findNotificationById,
        updateNotification: updateNotification,
        deleteNotification: deleteNotification
    };
    return api;

    // create a new notification instance
    function createNotification(notification) {
        return Notification.create(notification);
    }

    // retrieve all notifications for the user specified by the given userId parameter
    function findAllNotificationsForUser(userId) {
        return Notification.find({ _user: userId });
    }

    // retrieve a notification instance whose _id is equal to parameter notificationId
    function findNotificationById(notificationId) {
        return Notification.findById(notificationId);
    }


    // Updates notification instance whose _id is equal to parameter notificationId
    function updateNotification(notificationId, notification) {
        delete notification._id;
        return Notification.update(
            { _id: notificationId },
            { $set: notification }
        );
    }

    // Removes notification instance whose _id is equal to parameter notificationId
    function deleteNotification(notificationId) {
        return Notification.remove({ _id: notificationId });
    }
};