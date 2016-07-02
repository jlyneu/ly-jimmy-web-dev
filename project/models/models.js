module.exports = function(mongoose) {

    var messagethreadModel = require("./messagethread/messagethread.model.server.js")(mongoose);
    var messageModel = require("./message/message.model.server.js")(mongoose, messagethreadModel);
    var shelterModel = require("./shelter/shelter.model.server.js")(mongoose);
    var petModel = require("./pet/pet.model.server.js")(mongoose, shelterModel);
    var userModel = require("./user/user.model.server.js")(mongoose);

    var models = {
        messagethreadModel: messagethreadModel,
        messageModel: messageModel,
        shelterModel: shelterModel,
        petModel: petModel,
        userModel: userModel
    };

    return models;
};