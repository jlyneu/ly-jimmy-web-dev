module.exports = function(mongoose) {

    var NotificationSchema = mongoose.Schema({
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        _messagethread: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messagethread",
            required: true
        },
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }, { collection: "project.notification" });

    return NotificationSchema;
};