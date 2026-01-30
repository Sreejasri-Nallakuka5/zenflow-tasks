const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: 'default_user', // Since we don't have auth yet
        unique: true
    },
    streak: {
        type: Number,
        default: 0
    },
    perfectDays: {
        type: Number,
        default: 0
    },
    activeDays: {
        type: Number,
        default: 0
    },
    overallRate: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Stats || mongoose.model('Stats', statsSchema);
