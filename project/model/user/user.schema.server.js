module.exports = function(mongoose) {

    var UserSchema = mongoose.Schema({
        username: {
            type: String,
            unique: true
        },
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        dateCreated: {
            type: Date,
            default: Date.now
        },
        dateUpdated: {
            type: Date,
            default: Date.now
        }
    }, { collection: "project.pet" });

    return UserSchema;
};