module.exports = function(app) {

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
    ];

    // declare the API
    app.post("/api/user", createUser);
    app.get("/api/user", getUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    function createUser(req, res) {
        var user = req.body;
        user['_id'] = (new Date()).getTime().toString();
        users.push(user);
        res.json(user);
    }

    function getUsers(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        if (username && password) {
            findUserByCredentials(username, password, res);
        } else if (username) {
            findUserByUsername(username, res);
        } else {
            res.json(users);
        }
    }

    function findUserByUsername(username, res) {
        for (var i in users) {
            if (users[i]['username'] === username) {
                res.json(users[i]);
                return;
            }
        }
        res.json({});
    }

    function findUserByCredentials(username, password, res) {
        for (var i in users) {
            if (users[i]['username'] === username &&
                users[i]['password'] === password) {
                res.json(users[i]);
                return;
            }
        }
        res.json({});
    }

    function findUserById(req, res) {
        var userId = req.params['userId'];
        for (var i in users) {
            if (users[i]['_id'] === userId) {
                res.json(users[i]);
                return;
            }
        }
        res.json({});
    }

    function updateUser(req, res) {
        var userId = req.params['userId'];
        var user = req.body;
        for (var i in users) {
            if (users[i]['_id'] === userId) {
                users[i].email = user.email;
                users[i].firstName = user.firstName;
                users[i].lastName = user.lastName;
                res.json(user);
                return;
            }
        }
        res.json({});
    }

    function deleteUser(req, res) {
        var userId = req.params['userId'];
        for (var i in users) {
            if (users[i]['_id'] === userId) {
                users.splice(i, 1);
                res.send(true);
                return;
            }
        }
        res.send(false);
    }
};