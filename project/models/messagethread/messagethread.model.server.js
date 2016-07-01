module.exports = function(mongoose) {

    var q = require("q");
    var MessagethreadSchema = require("./messagethread.schema.server.js")(mongoose);
    var Messagethread = mongoose.model("Messagethread", MessagethreadSchema);

    var api = {
        createMessagethread: createMessagethread,
        findAllMessagethreadsForUser: findAllMessagethreadsForUser,
        findAllMessagethreadsForShelters: findAllMessagethreadsForShelters,
        findMessagethreadById: findMessagethreadById,
        updateMessagethread: updateMessagethread,
        deleteMessagethread: deleteMessagethread,
        pushMessage: pushMessage,
        pullMessage: pullMessage
    };
    return api;

    // create a new messagethread instance whose users array contains the given userId
    function createMessagethread(userId, messagethread) {
        messagethread._user = userId;
        return Messagethread.create(messagethread);
    }

    // Retrieves all messagethread instances for user whose _id is userId
    function findAllMessagethreadsForUser(userId) {
        var deferred = q.defer();
        var errorMessage = {};

        Messagethread
            .find({ _user: userId })
            .populate(["_user", "_shelter"])
            .exec(function (error, messagethread) {
                if (error) {
                    errorMessage.message = "Could not fetch messagethread. Please try again later.";
                    deferred.reject(errorMessage);
                } else {
                    deferred.resolve(messagethread);
                }
            });
        return deferred.promise;
    }

    function findAllMessagethreadsForShelters(shelterIds) {
        var deferred = q.defer();
        var errorMessage = {};

        Messagethread
            .find({ _shelter: { $in: shelterIds }})
            .populate(["_user", "_shelter"])
            .exec(function (error, messagethread) {
                if (error) {
                    errorMessage.message = "Could not fetch messagethread. Please try again later.";
                    deferred.reject(errorMessage);
                } else {
                    deferred.resolve(messagethread);
                }
            });
        return deferred.promise;
    }

    // Retrieves single messagethread instance whose _id is messagethreadId
    function findMessagethreadById(messagethreadId) {
        var deferred = q.defer();
        Messagethread
            .findById(messagethreadId)
            .populate(['_user','_shelter'])
            .exec(function (error, messagethread) {
                if (messagethread) {
                    deferred.resolve(messagethread);
                } else {

                }
            });
        return deferred.promise;
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