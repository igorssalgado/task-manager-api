const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;