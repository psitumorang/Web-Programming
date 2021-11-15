const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const webapp = express();

webapp.use(cors());

const userLib = require('./userTableDatabase');
const profileLib = require('./profileTableDatabase');

const port = 8080;

webapp.use(bodyParser.urlencoded());
webapp.use(bodyParser.json());

webapp.use(express.urlencoded({
    extended: true,
}));

let userDb;
let profileDb;

webapp.listen(port, async () => {
    userDb = await userLib.connect();
    profileDb = await profileLib.connect();
    console.log('listening');
});

webapp.post('/registration', async (req, res) => {
    console.log('register a user');
    try {
        const nextId = await userLib.getNextId(userDb);
        const newUser = {
          user_id: nextId + 1,
          user_name: req.body.user_name,
          user_password: req.body.user_password,
        };
        const newProfile = {
          user_id: nextId + 1,
          first_name: '',
          last_name: '',
          biography: '',
          profile_picture_url: '',
        };
        const resultsUser = await userLib.addUser(userDb, newUser);
        console.log(resultsUser);
        if (resultsUser === null) {
            res.status(404).json({err: 'username already taken'});
            console.log('we outtie');
        } else {
            const resultsProfile = await profileLib.addProfile(profileDb, newProfile);
        
            res.status(201).json({
                user: newUser,
                profile: newProfile,
            });
        }
    } catch (err) {
        res.status(404).json({err: err.message});
    }
});

webapp.use((req, res) => {
    console.log('NOT REGISTERED ROUTE');
    console.log(req.url);
    console.log(req.method);
    res.status(404);
});