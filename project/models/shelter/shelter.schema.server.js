module.exports = function(mongoose) {

    var ShelterSchema = mongoose.Schema({
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "PetUser"
        }],
        name: {
            type: String,
            required: true
        },
        address1: {
            type: String
        },
        address2: String,
        city: String,
        state: String,
        zip: {
            type: String,
            required: true
        },
        country: String,
        latitude: Number,
        longitude: Number,
        phone: String,
        fax: String,
        email: String,
        source: {
            type: String,
            enum: ["PETFINDER", "PETSHELTER"]
        },
        petfinderId: {
            type: String
        },
        dateCreated: {
            type: Date,
            default: Date.now
        },
        dateUpdated: {
            type: Date,
            default: Date.now
        }
    }, { collection: "project.shelter" });

    return ShelterSchema;
};