module.exports = function(mongoose) {

    var q = require("q");
    var MessagethreadSchema = require("./messagethread.schema.server.js")(mongoose);
    var Messagethread = mongoose.model("Messagethread", MessagethreadSchema);

    var api = {
        createMessagethread: createMessagethread,
        findAllMessagethreadsForUser: findAllMessagethreadsForUser,
        findMessagethreadById: findMessagethreadById,
        updateMessagethread: updateMessagethread,
        deleteMessagethread: deleteMessagethread,
        pushMessage: pushMessage,
        pullMessage: pullMessage
    };
    return api;

    // create a new messagethread instance whose users array contains the given userId
    function createMessagethread(messagethread, userId, shelterId) {
        messagethread._user = userId;
        messagethread._shelter = shelterId;
        return Messagethread.create(messagethread);
    }

    // Retrieves all messagethread instances for user whose _id is userId
    function findAllMessagethreadsForUser(userId) {
        return Messagethread.find({ _user: userId });
    }

    // Retrieves single messagethread instance whose _id is messagethreadId
    function findMessagethreadById(messagethreadId) {
        return Messagethread.findById(messagethreadId);
    }

    // Updates messagethread instance whose _id is messagethreadId
    function updateMessagethread(messagethreadId, messagethread) {
        delete messagethread._id;
        return Messagethread.update(
            { _id: messagethreadId },
            { $set: messagethread }
        );
    }

    // Removes messagethread instance whose _id is messagethreadId
    function deleteMessagethread(messagethreadId) {
        return Messagethread.remove({ _id: messagethreadId });
    }

    // Add the given messageId to the list of message ids for the messagethread with the given messagethreadId
    function pushMessage(messagethreadId, messageId) {
        return Messagethread.update(
            { _id: messagethreadId },
            { $pushAll:
                {
                    messages: [messageId]
                }
            }
        );
    }

    // Remove the given messageId from the list of message ids for the messagethread with the given messagethreadId
    function pullMessage(messagethreadId, messageId) {
        return Messagethread.update(
            { _id: messagethreadId },
            { $pullAll:
                {
                    messages: [messageId]
                }
            }
        );
    }
};