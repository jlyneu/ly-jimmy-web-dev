// var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var bcrypt = require("bcrypt-nodejs");

module.exports = function(app, models) {

    // declare the API

    // Use management
    // app.post("/api/login", passport.authenticate("local"), login);
    app.post("/api/logout", logout);
    app.post("/api/register", register);
    app.get("/api/loggedin", loggedin);
    // app.get("/auth/facebook", passport.authenticate("facebook", { scope: "email" }));
    // app.get("/auth/facebook/callback", passport.authenticate('facebook', {
    //     successRedirect: '/assignment/#/user',
    //     failureRedirect: '/assignment/#/login'
    // }));

    // CRUD operations
    app.post("/api/user", createUser);
    app.get("/api/user", getUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    // user model to provide CRUD api
    var userModel = models.userModel;
    
    // configure passport for authentication locally and with Facebook
    // passport.serializeUser(serializeUser);
    // passport.deserializeUser(deserializeUser);
    //
    // passport.use("local", new LocalStrategy(localStrategy));

    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
    };
    
    // passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    // provide the user object to store an encrypted representation of the user in a cookie
    function serializeUser(user, done) {
        done(null, user);
    }

    // retrieve the currently logged in user from the encrypted cookie created in serializeUser.
    // if the user cannot be found by the id stored in the cookie, then return an error
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

    // when the user chooses to login via their username and password for this site, lookup the user
    // by their username then determine if the password the user provided is correct. If the user
    // cannot be found by the username or if an error occurs, then return an error.
    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(findUserByCredentialsSuccess, findUserByCredentialsError);

        // the query was successful. if a user is returned and the provided password matches the
        // password in the database (after encryption), then return the user. Otherwise, return false.
        function findUserByCredentialsSuccess(user) {
            if (user && bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }

        // the query threw an error so return an error.
        function findUserByCredentialsError(error) {
            if (error) {
                return done(error);
            }
        }
    }

    // when the user chooses to login via Facebook and Facebook has sent a POST request callback with token
    // and profile, etc. see if the user is already registered with a Facebook id. if so, then simply
    // return the user. otherwise, the user has never logged in with Facebook before so create a new
    // user and store the Facebook id and token. Facebook also sends a displayName, which should also be stored
    // in the database.
    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(findUserByFacebookIdSuccess, handleError);

        // the database query was successful. check if a user was returned, meaning the Facebook id was a match.
        // if so, return the user. otherwise, create a new user using the profile information from Facebook.
        function findUserByFacebookIdSuccess(user) {
            if (user) {
                return done(null, user);
            } else {
                // use firstNamelastName as the username and also parse the names from profile.displayName
                var username = profile.displayName.replace(/ /g, '');
                var bothNames = profile.displayName.split(" ");
                var firstName = bothNames[0];
                var lastName = bothNames[bothNames.length - 1];
                // if Facebook provided any emails, then save one in the database
                var email;
                if (profile.emails) {
                    email = profile.emails[0].value;
                } else {
                    email = "";
                }
                var newUser = {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    facebook: {
                        id: profile.id,
                        token: token
                    }
                };
                // try to create the new user in the database
                userModel.createUser(newUser)
                    .then(createUserSuccess, handleError);
            }
        }

        // the user was successfully created, so return the user
        function createUserSuccess(user) {
            return done(null, user);
        }

        // an error occurred, so return an error
        function handleError(error) {
            return done(error);
        }
    }

    // Implement the API

    // the passport authenticate middleware has already authenticated and found the user in the database,
    // storing the user in the request. simply return the user in the request
    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    // use the request's logout function to invalidate the currently logged in user
    function logout(req, res) {
        req.logout();
        res.status(200).json({});
    }

    // validate the user and try to insert the user into the database if there are no
    // validation errors. if the user is created successfully, then log the user in
    // using the request's login function. once the user is logged in, return the user.
    // otherwise, return an error.
    function register(req, res) {
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

        // encrypt the password to be stored in the database
        user.password = bcrypt.hashSync(user.password);
        // try to create the user
        userModel
            .createUser(user)
            .then(createUserSuccess, createUserError);

        // check to see if a user was created and returned. if so, login the user and return the user.
        // otherwise, return an error
        function createUserSuccess(user) {
            if (user) {
                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            } else {
                errorMessage.message = "Could not create the user. Please try again later.";
                res.status(500).send(errorMessage);
            }
        }

        // user creation failed, most likely due to the username not being unique. return an error
        function createUserError(error) {
            errorMessage.message = user.username + " is already taken.";
            res.status(400).json(errorMessage);
        }
    }

    // if the user is currently logged in, then return the user. otherwise return a falsy value ("0")
    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : "0");
    }

    // adds the user body parameter instance to the database.
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