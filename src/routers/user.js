const express = require('express');
const User = require('../models/user');
// const sharp = require('sharp'); cuz at work it is not allowed --"
const auth = require('../middleware/auth');
const imgUploaded = require('../middleware/imgUploaded');
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account');

const router = new express.Router();

//to create a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send()
    }
})

// { USER AVAILABLE
// 	"name": "Igor Salgado",
// 	"email": "ksks@kkkj.com",
// 	"password": "!saaaes2s$"
// }

// {
// 	"name": "Taynara Derbona",
// 	"email": "tay@gmail.com",
// 	"password": "m0z40s2"
// }

//to login with a user and gerating a session token
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token });
    } catch (e) {
        res.status(400).send("something wrong is not right");
    }
})

//to find all users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})


//to update a user by id
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid udpates!' })
    }

    try {
        // no longer need to fetch the user aby this param.. will acess from auth 
        // const user = await User.findById(req.user._id);

        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save();

        // user always exists as auth already run
        // if (!user) {
        //     return res.status(404).send();
        // }

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

//to delete a user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendGoodbyeEmail(req.user.email, req.user.name);
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e);
    }
})

//to upload a avatar to an user
// router.post('/users/me/avatar', auth, imgUploaded.single('avatar'), async (req, res) => {
//     const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    
//     req.user.avatar = buffer; //multer processed the data passed to this function, storing the avatar data on req.user.avatar field and saving it on the db
//     await req.user.save();
//     res.status(200).send('File uploaded successfully.');
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
// });

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save();
    res.status(200).send();
});

//to check the avatar by user id
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;