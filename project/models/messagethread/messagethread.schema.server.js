module.exports = function(mongoose) {

    var MessagethreadSchema = mongoose.Schema({
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        _shelter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shelter",
            required: true
        },
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }],
        dateCreated: {
            type: Date,
            default: Date.now
        },
        dateUpdated: {
            type: Date,
            default: Date.now
        }
    }, { collection: "project.messagethread" });

    return MessagethreadSchema;
};