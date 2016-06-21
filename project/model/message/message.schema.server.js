module.exports = function(mongoose) {

    var MessageSchema = mongoose.Schema({
        _messagethread: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messagethread",
            required: true
        },
        text: {
            type: String,
            required: true
        },
        dateCreated: {
            type: Date,
            default: Date.now
        },
        dateUpdated: {
            type: Date,
            default: Date.now
        }
    }, { collection: "project.message" });

    return MessageSchema;
};