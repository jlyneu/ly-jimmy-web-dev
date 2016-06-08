module.exports = function(mongoose) {


    var PageSchema = mongoose.Schema({
        _website: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Website"
        },
        name: {
            type: String,
            required: true
        },
        title: String,
        widgets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Widget"
        }],
        dateCreated: {
            type: Date,
            default: Date.now
        },
        dateUpdated: Date
    }, { collection: "assignment.page" });

    return PageSchema;
};