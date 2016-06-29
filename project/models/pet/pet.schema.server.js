module.exports = function(mongoose) {

    var ContactSchema = mongoose.Schema({
        name: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        zip: String,
        phone: String,
        fax: String,
        email: String
    }, { collection: "project.contact"});

    var PetSchema = mongoose.Schema({
        _shelter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shelter",
            required: true
        },
        animal: String,
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
        age: {
            type: String,
            enum: ["Baby", "Young", "Adult", "Senior"]
        },
        status: {
            type: String,
            enum: ["A", "H", "P", "X"] // adoptable, hold, pending, adopted/removed
        },
        photoUrl: String,
        contact: ContactSchema,
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