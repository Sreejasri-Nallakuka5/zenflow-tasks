const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { updateDailyLog } = require('./statsController');
const { format } = require('date-fns');

// Get all habits
exports.getHabits = async (req, res) => {
    try {
        const date = req.query.date || format(new Date(), 'yyyy-MM-dd');
        const habits = await Habit.find();
        const logs = await HabitLog.find({ date });

        const habitMap = {};
        logs.forEach(log => {
            habitMap[log.habitId.toString()] = log;
        });

        const mergedHabits = habits.map(habit => {
            const h = habit.toObject();
            const log = habitMap[habit._id.toString()];
            return {
                ...h,
                id: h._id.toString(),
                currentCount: log ? log.currentCount : 0,
                isCompleted: log ? log.isCompleted : false
            };
        });

        res.json(mergedHabits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a habit
exports.createHabit = async (req, res) => {
    const habit = new Habit({
        title: req.body.title,
        emoji: req.body.emoji,
        category: req.body.category,
        targetCount: req.body.targetCount,
    });

    try {
        const newHabit = await habit.save();
        const date = req.body.date || format(new Date(), 'yyyy-MM-dd');
        await updateDailyLog(date);
        res.status(201).json({
            ...newHabit.toObject(),
            id: newHabit._id.toString(),
            currentCount: 0,
            isCompleted: false
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a habit progress for a specific date
exports.updateHabit = async (req, res) => {
    try {
        const date = req.body.date || format(new Date(), 'yyyy-MM-dd');
        const habitId = req.params.id;

        const habit = await Habit.findById(habitId);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        // If it's a general info update (not progress)
        if (req.body.title != null || req.body.emoji != null || req.body.targetCount != null || req.body.status != null) {
            if (req.body.title != null) habit.title = req.body.title;
            if (req.body.emoji != null) habit.emoji = req.body.emoji;
            if (req.body.category != null) habit.category = req.body.category;
            if (req.body.targetCount != null) habit.targetCount = req.body.targetCount;
            if (req.body.status != null) habit.status = req.body.status;
            await habit.save();
        }

        // Handle progress updates in HabitLog
        if (req.body.currentCount != null || req.body.isCompleted != null) {
            const currentCount = req.body.currentCount ?? (req.body.isCompleted ? habit.targetCount : 0);
            const isCompleted = req.body.isCompleted ?? (currentCount >= habit.targetCount);

            await HabitLog.findOneAndUpdate(
                { habitId, date },
                { currentCount, isCompleted, updatedAt: new Date() },
                { upsert: true }
            );
        }

        // Fetch merged record to return
        const log = await HabitLog.findOne({ habitId, date });

        await updateDailyLog(date);

        res.json({
            ...habit.toObject(),
            id: habit._id.toString(),
            currentCount: log ? log.currentCount : 0,
            isCompleted: log ? log.isCompleted : false
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a habit
exports.deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        await habit.deleteOne();
        await updateDailyLog(format(new Date(), 'yyyy-MM-dd'));
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
