const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    emoji: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: '',
    },
    targetCount: {
        type: Number,
        default: 1,
    },
    currentCount: {
        type: Number,
        default: 0,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'stopped'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.Habit || mongoose.model('Habit', habitSchema);
