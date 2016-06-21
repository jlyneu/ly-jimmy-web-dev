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
        savedShelters: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shelter"
        }],
        savedPets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet"
        }]
        dateCreated: {
            type: Date,
            default: Date.now
        },
        dateUpdated: {
            type: Date,
            default: Date.now
        }
    }, { collection: "project.user" });

    return UserSchema;
};