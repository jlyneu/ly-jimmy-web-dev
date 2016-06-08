module.exports = function(app, mongoose) {

    var models = require("./models/models.js")(mongoose);

    var userService = require("./services/user.service.server.js")(app, models);
    var websiteService = require("./services/website.service.server.js")(app, models);
    var pageService = require("./services/page.service.server.js")(app, models);
    var widgetService = require("./services/widget.service.server.js")(app, models);
};