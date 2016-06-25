module.exports = function(mongoose) {

    var PetSchema = mongoose.Schema({
        _shelter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shelter",
            required: true
        },
        type: {
            type: String,
            enum: ["BARNYARD", "BIRD", "CAT", "DOG", "HORSE", "PIG", "REPTILE", "SMALLFURRY"]
        },
        breeds: {
            type: [String]
        },
        name: {
            type: String,
            required: true
        },
        description: String,
        size: {
            type: String,
            enum: ["S", "M", "L", "XL"] // small, medium, large, extra-large
        },
        sex: {
            type: String,
            enum: ["M", "F"] // male, female
        },
        options: [String],
        photoUrl: String,
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
    }, { collection: "project.pet" });

    return PetSchema;
};