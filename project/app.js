module.exports = function(app) {
    require("./services/message.service.server.js")(app);
    require("./services/messagethread.service.server.js")(app);
    require("./services/notification.service.server.js")(app);
    require("./services/pet.service.server.js")(app);
    require("./services/shelter.service.server.js")(app);
    require("./services/user.service.server.js")(app);
};