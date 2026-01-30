const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true,
    },
    date: {
        type: String, // 'YYYY-MM-DD'
        required: true,
    },
    currentCount: {
        type: Number,
        default: 0,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.models.HabitLog || mongoose.model('HabitLog', habitLogSchema);
