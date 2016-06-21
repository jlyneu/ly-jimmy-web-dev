module.exports = function(mongoose) {

    var messagethreadModel = require("./messagethread/messagethread.model.server.js")(mongoose);
    var messageModel = require("./message/message.model.server.js")(mongoose, messagethreadModel);
    var notificationModel = require("./notification/notification.model.server.js")(mongoose);
    var petModel = require("./pet/pet.model.server.js")(mongoose);
    var shelterModel = require("./shelter/shelter.model.server.js")(mongoose);
    var userModel = require("./user/user.model.server.js")(mongoose);

    var models = {
        messagethreadModel: messagethreadModel,
        messageModel: messageModel,
        notificationModel: notificationModel,
        petModel: petModel,
        shelterModel: shelterModel,
        userModel: userModel
    };

    return models;
};