module.exports = function(app, models) {

    // declare the API
    app.post("/api/user", createUser);
    app.get("/api/user", getUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    
    var userModel = models.userModel;

    // adds the user body parameter instance to the local users array.
    // return the user if creation was successful, otherwise return an error.
    function createUser(req, res) {
        var user = req.body;
        var errorMessage = {};

        // first check for validation errors
        if (!user.username) {
            errorMessage.message = "Username is required";
            res.status(400).json(errorMessage);
            return;
        }
        else if (!user.password) {
            errorMessage.message = "Password is required";
            res.status(400).json(errorMessage);
            return;
        }
        // make sure passwords match
        else if (user.password !== user.verifyPassword) {
            errorMessage.message = "Passwords do not match";
            res.status(400).json(errorMessage);
            return;
        }

        // try to create the user in the database
        userModel
            .createUser(user)
            .then(createUserSuccess, createUserError);

        // if user creation is successful, then return the new user
        function createUserSuccess(newUser) {
            if (newUser) {
                res.json(newUser);
            } else {
                errorMessage.message = "Could not create user. Please try again later.";
                res.status(500).json(errorMessage);
            }
        }

        // if the username is already taken then return an error
        function createUserError(error) {
            errorMessage.message = user.username + " is already taken.";
            res.status(400).json(errorMessage);
        }
    }

    // return the list of all users if no query parameters were provided, as discussed in class.
    // if only a username is provided, return the user with the given username.
    // if both a username and password are provided, then return the user with the given credentials.
    // return an error if a user isn't found.
    function getUsers(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        if (username && password) {
            findUserByCredentials(username, password, res);
        } else if (username) {
            findUserByUsername(username, res);
        } else {
            var errorMessage = {
                message: "Must provide either a username or both username and password."
            };
            res.status(400).json(errorMessage);
        }
    }

    // returns the user in local users array whose username matches
    // the parameter username. return an error if the user cannot be found.
    function findUserByUsername(username, res) {
        var errorMessage = {};

        userModel
            .findUserByUsername(username)
            .then(findUserByUsernameSuccess, findUserByUsernameError);

        function findUserByUsernameSuccess(user) {
            if (!user) {
                errorMessage.message = username + " was not found.";
                res.status(404).json(errorMessage);
            }
            res.json(user);
        }

        // the user could not be found so return an error
        function findUserByUsernameError(error) {
            errorMessage.message = "Could not fetch user data. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // returns the user whose username and password match
    // the username and password parameters. return an error
    // if the user cannot be found.
    function findUserByCredentials(username, password, res) {
        var errorMessage = {};

        userModel
            .findUserByCredentials(username, password)
            .then(findUserByCredentialsSuccess, findUserByCredentialsError);

        function findUserByCredentialsSuccess(user) {
            if (!user) {
                errorMessage.message = "The provided username and password combination is invalid.";
                res.status(401).json(errorMessage);
            } else {
                res.json(user);
            }
        }

        // the user could not be found so return an error.
        function findUserByCredentialsError(error) {
            errorMessage.message = "Could not fetch user data. Please try again later.";
            res.status(401).json(errorMessage);
        }
    }

    // returns the user in the local users array whose _id matches
    // the userId path parameter
    function findUserById(req, res) {
        var userId = req.params['userId'];
        var errorMessage = {};

        userModel
            .findUserById(userId)
            .then(findUserByIdSuccess, findUserByIdError);

        function findUserByIdSuccess(user) {
            if (user) {
                res.json(user);
            } else {
                errorMessage.message = "User with id " + userId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        function findUserByIdError(error) {
            errorMessage.message = "Could not fetch user data. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // updates the user in local users array whose _id matches
    // the userId parameter.
    // return the user if update was successful, otherwise return an error.
    function updateUser(req, res) {
        var userId = req.params['userId'];
        var user = req.body;
        var errorMessage = {};

        userModel
            .updateUser(userId, user)
            .then(updateUserSuccess, updateUserError);

        function updateUserSuccess(numUpdated) {
            if (numUpdated) {
                res.json(user);
            } else {
                errorMessage.message = "User with id " + userId + " was not found.";
                res.status(404).json(errorMessage);
            }
        }

        // user was not found so return an error
        function updateUserError(error) {
            errorMessage.message = "Could not update the user. Please try again later.";
            res.status(500).json(errorMessage);
        }
    }

    // removes the user whose _id matches the userId parameter.
    // return true if the deletion was successful, otherwise return an error.
    function deleteUser(req, res) {
        var userId = req.params['userId'];
        var errorMessage = {};

        userModel
            .deleteUser(userId)
            .then(deleteUserSuccess, deleteUserError);

        function deleteUserSuccess(numDeleted) {
            if (numDeleted) {
                res.send(true);
            } else {
                errorMessage.message = "User with id " + userId + " was not found.";
                res.status(404).send(errorMessage);
            }
        }

        // user was not found so return an error
        function deleteUserError(error) {
            errorMessage.message = "Could not delete user. Please try again later.";
            res.status(500).send(errorMessage);
        }
    }
};