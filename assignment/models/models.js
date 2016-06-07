module.exports = function() {
    
    var mongoose = require("mongoose");
    mongoose.createConnection("mongodb://127.0.0.1:27017/webAppMaker");
    
    var userModel = require("./user/user.model.server.js")();
    var websiteModel;
    var pageModel;
    var widgetModel;
    
    var models = {
        userModel: userModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel
    };
    
    return models;
};