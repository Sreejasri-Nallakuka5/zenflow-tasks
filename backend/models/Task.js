const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
    },
    priority: {
        type: String,
        enum: ['None', 'Low', 'Medium', 'High'],
        default: 'None',
    },
    category: {
        type: String,
        default: 'None',
    },
    reminder: {
        type: String, // Storing time as string for simplicity
        default: 'Not set',
    },
    autoPostpone: {
        type: Boolean,
        default: false,
    },
    subtasks: [{
        title: String,
        isCompleted: { type: Boolean, default: false }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);
