const Habit = require('../models/Habit');

// Get all habits
exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find();
        // Map _id to id for frontend compatibility
        const habitsWithId = habits.map(habit => ({
            ...habit.toObject(),
            id: habit._id.toString()
        }));
        res.json(habitsWithId);
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
        res.status(201).json({ ...newHabit.toObject(), id: newHabit._id.toString() });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a habit (including toggle/counts)
exports.updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        if (req.body.title != null) habit.title = req.body.title;
        if (req.body.emoji != null) habit.emoji = req.body.emoji;
        if (req.body.category != null) habit.category = req.body.category;
        if (req.body.targetCount != null) habit.targetCount = req.body.targetCount;
        if (req.body.currentCount != null) habit.currentCount = req.body.currentCount;
        if (req.body.isCompleted != null) habit.isCompleted = req.body.isCompleted;

        const updatedHabit = await habit.save();
        res.json({ ...updatedHabit.toObject(), id: updatedHabit._id.toString() });
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
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
