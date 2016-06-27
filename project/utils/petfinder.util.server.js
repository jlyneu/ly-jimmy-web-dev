module.exports = function() {

    var api = {
        cleanPetObj: cleanPetObj
    };
    return api;

    function cleanPetObj(rawPetObj) {
        var cleanPetObj = {};
        cleanPetObj.status = rawPetObj.status.$t;
        cleanPetObj.age = rawPetObj.age.$t;
        cleanPetObj.size = rawPetObj.size.$t;
        cleanPetObj.media = rawPetObj.media.$t;
        cleanPetObj.id = rawPetObj.id.$t;
        cleanPetObj.shelterPetId = rawPetObj.shelterPetId.$t;
        cleanPetObj.name = rawPetObj.name.$t;
        cleanPetObj.sex = rawPetObj.sex.$t;
        cleanPetObj.description = rawPetObj.description.$t;
        cleanPetObj.animal = rawPetObj.animal.$t;
        cleanPetObj.breeds = [];
        for (var i = 0; i < rawPetObj.breeds.breed.length; i++) {
            cleanPetObj.breeds.push(rawPetObj.breeds.breed[i].$t);
        }
        cleanPetObj.options = [];
        if (rawPetObj.options.option) {
            for (i = 0; i < rawPetObj.options.option.length; i++) {
                cleanPetObj.options.push(rawPetObj.options.option[i].$t);
            }
        }

        if (rawPetObj.media && rawPetObj.media.photos && rawPetObj.media.photos.photo) {
            for (i = 0; i < rawPetObj.media.photos.photo.length; i++) {
                var photo = rawPetObj.media.photos.photo[i];
                if (photo["@size"] == "pn" && photo["@id"] == "1") {
                    cleanPetObj.photoUrl = photo.$t;
                }
            }
        }
        cleanPetObj.contact = {};
        cleanPetObj.contact.name = rawPetObj.contact.name && rawPetObj.contact.name.$t;
        cleanPetObj.contact.phone = rawPetObj.contact.phone.$t;
        cleanPetObj.contact.email = rawPetObj.contact.email.$t;
        cleanPetObj.contact.address1 = rawPetObj.contact.address1.$t;
        cleanPetObj.contact.address2 = rawPetObj.contact.address2.$t;
        cleanPetObj.contact.city = rawPetObj.contact.city.$t;
        cleanPetObj.contact.state = rawPetObj.contact.state.$t;
        cleanPetObj.contact.zip = rawPetObj.contact.zip.$t;
        cleanPetObj.contact.fax = rawPetObj.contact.fax.$t;
        cleanPetObj.source = "PETFINDER";

        return cleanPetObj;
    }
};