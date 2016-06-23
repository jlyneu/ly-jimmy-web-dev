module.exports = function(app, models) {

    // declare the API
    app.post("/api/messagethread/:messagethreadId/message", createMessage);
    app.get("/api/messagethread/:messagethreadId/message", findAllMessagesForMessagethread);
    app.get("/api/message/:messageId", findMessageById);
    app.put("/api/message/:messageId", updateMessage);
    app.delete("/api/message/:messageId", deleteMessage);

    var messageModel = models.messageModel;

    // adds the message body parameter instance to the local messages array.
    // return the message if creation was successful, otherwise return an error.
    function createMessage(req, res) {
        var messagethreadId = req.params["messagethreadId"];
        var message = req.body;
        var errorMessage = {};

        // first check for validation errors
        if (!messagethreadId) {
            errorMessage.message = "A messagethreadId is required.";
            res.status(400).json(errorMessage);
            return;
        } else if (!message.text) {
            errorMessage.message = "Message text is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to create the message in the database
        messageModel
            .createMessage(messagethreadId, message)
            .then(createMessageSuccess, createMessageError);

        // if the message creation is successful, then return the new message
        function createMessageSuccess(newMessage) {
            if (newMessage) {
                res.json(newMessage);
            } else {
                errorMessage.message = "Could not create message. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function createMessageError(error) {
            errorMessage.message = "Could not create message. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the messages in local messages array whose messagethreadId
    // matches the parameter messagethreadId
    function findAllMessagesForMessagethread(req, res) {
        var messagethreadId = req.params["messagethreadId"];
        var errorMessage = {};

        // try to find the messages in the database
        messageModel
            .findAllMessagesForMessagethread(messagethreadId)
            .then(findAllMessagesForMessagethreadSuccess, findAllMessagesForMessagethreadError);

        // return the messages from the model. otherwise, something went wrong
        function findAllMessagesForMessagethreadSuccess(messages) {
            if (messages) {
                res.json(messages);
            } else {
                errorMessage.message = "Could not fetch messages. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findAllMessagesForMessagethreadError(error) {
            errorMessage.message = "Could not fetch messages. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // retrieves the message in local messages array whose _id matches
    // the messageId parameter. return an error if the message cannot be found.
    function findMessageById(req, res) {
        var messageId = req.params["messageId"];
        var errorMessage = {};

        // try to find the message in the database
        messageModel
            .findMessageById(messageId)
            .then(findMessageByIdSuccess, findMessageByIdError);

        // return the message from the model. otherwise, the message wasn't found
        function findMessageByIdSuccess(message) {
            if (message) {
                res.json(message);
            } else {
                errorMessage.message = "Message with id " + messageId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function findMessageByIdError(error) {
            errorMessage.message = "Could not fetch message. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // updates the message in db whose _id matches the messageId parameter
    // return the updated message if successful, otherwise return an error
    function updateMessage(req, res) {
        var messageId = req.params["messageId"];
        var message = req.body;
        var errorMessage = {};

        if (!message.name) {
            errorMessage.message = "A message name is required.";
            res.status(400).json(errorMessage);
            return;
        }

        // try to update the message in the database
        messageModel
            .updateMessage(messageId, message)
            .then(updateMessageSuccess, updateMessageError);

        // return the message if update successful. otherwise the message wasn't found
        function updateMessageSuccess(numUpdated) {
            if (numUpdated) {
                res.json(message);
            } else {
                errorMessage.message = "Message with id " + messageId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function updateMessageError(error) {
            errorMessage.message = "Could not update message. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the message from local messages array whose _id matches
    // the messageId parameter.
    // return true if the message is successfully deleted, otherwise return an error.
    function deleteMessage(req, res) {
        var messageId = req.params["messageId"];
        var errorMessage = {};

        // try to delete the message from the database
        messageModel
            .deleteMessage(messageId)
            .then(deleteMessageSuccess, deleteMessageError);

        // if deletion is successful, then return true. otherwise, the message wasn't found
        function deleteMessageSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "Message with id " + messageId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // if an error occurred, then return an error
        function deleteMessageError(error) {
            errorMessage.message = "Could not delete message. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }
};