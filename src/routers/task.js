const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const imgUploaded = require('../middleware/imgUploaded');
const router = new express.Router();

//creates a task to the specific user
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, //copy all info from the object
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});


// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1 // -1 if true 1 if false (terniary operator)
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id });

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip), // has to provide a number
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id }) // req.user._id from the auth user

        await task.save();

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })


        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/tasks/:id/avatar', auth, imgUploaded.single('avatar'), async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
 
    task.avatar = buffer; //multer processed the data passed to this function, storing the avatar data on req.user.avatar field and saving it on the db

    await task.save();
    res.status(200).send('File uploaded successfully.');
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/tasks/:id/avatar', auth, async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    task.avatar = undefined
    await task.save();
    res.status(200).send();
});

router.get('/tasks/:id/avatar', auth, async (req, res) =>{ 
    try {
        const task = await Task.findById(req.params.id);

        if(!task || !task.avatar) {
            throw new Error()
        }

        console.log('ok')

        res.set('Content-Type', 'image/png')
        res.send(task.avatar);
    }catch (e) {
        res.status(404).send();
    }
})

// router.delete('/tasks/:id/avatar', auth, async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);

//         if(!task || !task.avatar) {
//             throw new Error()
//         }

//         console.log('ok delete')
//         task.avatar = undefined;
//         await task.avatar.save()
//         res.send(task.avatar);
//     }catch (e) {
//         res.status(404).send();
//     }
// })

module.exports = router;