module.exports = function(mongoose, messagethreadModel) {

    var q = require("q");
    var MessageSchema = require("./message.schema.server.js")(mongoose);
    var Message = mongoose.model("Message", MessageSchema);

    var api = {
        createMessage: createMessage,
        findAllMessagesForMessagethread: findAllMessagesForMessagethread,
        findMessageById: findMessageById,
        updateMessage: updateMessage,
        deleteMessage: deleteMessage
    };
    return api;

    // Creates a new message instance for messagethread whose _id is messagethreadId
    function createMessage(messagethreadId, message) {
        message._messagethread = messagethreadId;
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var newMessage;

        // create the message in the db, push the message id to the messagethread's messages array,
        // then resolve the promise with the newly created message
        Message
            .create(message)
            .then(pushMessageForMessagethread,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the message creation is successful, then push the message id onto the messagethread's messages array
        function pushMessageForMessagethread(message) {
            newMessage = message;
            return messagethreadModel.pushMessage(messagethreadId, newMessage._id);
        }

        // if the message id is successfully pushed onto the messagethread's messages array then resolve the promise
        // with the newly created message
        function resolvePromise(numUpdated) {
            deferred.resolve(newMessage);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }
    }

    // Retrieves all message instances for messagethread whose _id is messagethreadId
    function findAllMessagesForMessagethread(messagethreadId) {
        return Message.find({ _messagethread: messagethreadId });
    }

    // Retrieves single message instance whose _id is messageId
    function findMessageById(messageId) {
        return Message.findById(messageId);
    }

    // Updates message instance whose _id is messageId
    function updateMessage(messageId, message) {
        return Message.update(
            { _id: messageId },
            { $set:
                {
                    text: message.text,
                    dateUpdated: Date.now()
                }
            }
        );
    }

    // Removes message instance whose _id is messageId
    function deleteMessage(messageId) {
        // use q to decide what to resolve from the returned promise and when to reject
        var deferred = q.defer();
        var errorMessage = {};
        var numDeleted;
        var messageObj;

        // find the message by id to determine the parent messagethread, then
        // remove the message from the database, then remove the message id
        // from the messagethread's messages array, then resolve the promise with
        // the number of messages deleted
        Message
            .findById(messageId)
            .then(removeMessage,rejectError)
            .then(pullMessageFromMessagethread,rejectError)
            .then(resolvePromise,rejectError);

        return deferred.promise;

        // if the message is successfully found, then remove the message from the db
        function removeMessage(message) {
            if (message) {
                messageObj = message;
                return Message.remove({ _id: messageId });
            } else {
                errorMessage.message = "Could not find message with id" + messageId;
                throw new Error(errorMessage);
            }
        }

        // if the message is successfully removed from the db, then remove the message id from the
        // messagethread's array of message ids
        function pullMessageFromMessagethread(deleted) {
            // make sure a message was actually found and deleted
            if (deleted) {
                numDeleted = deleted;
                return messagethreadModel.pullMessage(messageObj._messagethread, messageId);
            } else {
                errorMessage.message = "Could not find message with id" + messageId;
                throw new Error(errorMessage);
            }
        }

        // if the message id is successfully removed from the messagethread array of message ids, then resolve
        // the promise with the number of messages deleted.
        function resolvePromise(numUpdated) {
            deferred.resolve(numDeleted);
        }

        // an error occurred so reject the promise
        function rejectError(err) {
            deferred.reject(err);
        }
    }
};