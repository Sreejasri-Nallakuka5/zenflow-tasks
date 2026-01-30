const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    date: {
        type: String, // 'YYYY-MM-DD'
        required: true,
        unique: true,
    },
    completedHabits: {
        type: Number,
        default: 0,
    },
    totalHabits: {
        type: Number,
        default: 0,
    },
    completedTasks: {
        type: Number,
        default: 0,
    },
    totalTasks: {
        type: Number,
        default: 0,
    },
    completionRate: {
        type: Number,
        default: 0,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);
