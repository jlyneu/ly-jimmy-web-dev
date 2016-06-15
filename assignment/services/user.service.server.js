module.exports = function(app, models) {

    var passport = require("passport");
    var LocalStrategy = require("passport-local").Strategy;
    var FacebookStrategy = require("passport-facebook").Strategy;
    var bcrypt = require("bcrypt-nodejs");

    // declare the API
    app.post("/api/login", passport.authenticate("local"), login);
    app.post("/api/logout", logout);
    app.post("/api/register", register);
    app.get("/api/loggedin", loggedin);
    app.post("/api/user", createUser);
    app.get("/api/user", getUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.get("/auth/facebook", passport.authenticate("facebook", { scope: "email" }));
    app.get("/auth/facebook/callback",
        passport.authenticate("facebook", {
            successRedirect: "/#/user",
            failureRedirect: "/#/login"
        }));

    var userModel = models.userModel;
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use("local", new LocalStrategy(localStrategy));
    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
    };
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));


    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(findUserByCredentialsSuccess, findUserByCredentialsError);

        function findUserByCredentialsSuccess(user) {
            if (user && bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }

        function findUserByCredentialsError(error) {
            if (error) {
                return done(error);
            }
        }
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id);
    }

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

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(findUserByIdSuccess, findUserByIdError);

        function findUserByIdSuccess(user) {
            done(null, user);
        }

        function findUserByIdError(error) {
            done(error, null);
        }
    }
    
    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function register(req, res) {
        var user = req.body;
        var errorMessage = {};
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(createUserSuccess, createUserError);

        function createUserSuccess(user) {
            if (user) {
                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        }

        function createUserError(error) {
            errorMessage.message = user.username + " is already taken.";
            res.status(400).json(errorMessage);
        }
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : "0");
    }
};