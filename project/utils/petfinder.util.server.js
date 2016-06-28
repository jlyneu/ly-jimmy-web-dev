module.exports = function() {

    var api = {
        cleanShelterObj : cleanShelterObj,
        cleanPetObj     : cleanPetObj
    };
    return api;

    function cleanShelterObj(rawShelterObj) {
        var cleanShelterObj = {};
        cleanShelterObj.name = rawShelterObj.name.$t;
        cleanShelterObj.address1 = rawShelterObj.address1.$t;
        cleanShelterObj.address2 = rawShelterObj.address2.$t;
        cleanShelterObj.city = rawShelterObj.city.$t;
        cleanShelterObj.state = rawShelterObj.state.$t;
        cleanShelterObj.zip = rawShelterObj.zip.$t;
        cleanShelterObj.country = rawShelterObj.country.$t;
        cleanShelterObj.latitude = rawShelterObj.latitude.$t;
        cleanShelterObj.longitude = rawShelterObj.longitude.$t;
        cleanShelterObj.phone = rawShelterObj.phone.$t;
        cleanShelterObj.email = rawShelterObj.email.$t;
        cleanShelterObj.fax = rawShelterObj.fax.$t;
        return cleanShelterObj;
    }

    function cleanPetObj(rawPetObj) {
        var cleanPetObj = {};
        cleanPetObj.status = rawPetObj.status.$t;
        cleanPetObj.age = rawPetObj.age.$t;
        cleanPetObj.size = rawPetObj.size.$t;
        cleanPetObj.media = rawPetObj.media.$t;
        cleanPetObj.id = rawPetObj.id.$t;
        cleanPetObj.shelterId = rawPetObj.shelterId.$t;
        cleanPetObj.name = rawPetObj.name.$t;
        cleanPetObj.sex = rawPetObj.sex.$t;
        cleanPetObj.description = rawPetObj.description.$t;
        cleanPetObj.animal = rawPetObj.animal.$t;
        cleanPetObj.breeds = [];
        if (rawPetObj.breeds.breed.$t) {
            cleanPetObj.breeds = [rawPetObj.breeds.breed.$t];
        } else {
            for (var i = 0; i < rawPetObj.breeds.breed.length; i++) {
                cleanPetObj.breeds.push(rawPetObj.breeds.breed[i].$t);
            }
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