const Task = require('../models/Task');
const { updateDailyLog } = require('./statsController');
const { format } = require('date-fns');

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks.map(task => ({
            ...task.toObject(),
            id: task._id.toString()
        })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a task
exports.createTask = async (req, res) => {
    const task = new Task({
        title: req.body.title,
        dueDate: req.body.dueDate,
        isCompleted: req.body.isCompleted || false,
        priority: req.body.priority,
        category: req.body.category,
        reminder: req.body.reminder,
        autoPostpone: req.body.autoPostpone,
        subtasks: req.body.subtasks,
    });

    try {
        const newTask = await task.save();
        await updateDailyLog(format(new Date(), 'yyyy-MM-dd'));
        res.status(201).json({ ...newTask.toObject(), id: newTask._id.toString() });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.body.title != null) task.title = req.body.title;
        if (req.body.isCompleted != null) task.isCompleted = req.body.isCompleted;
        if (req.body.dueDate != null) task.dueDate = req.body.dueDate;
        if (req.body.priority != null) task.priority = req.body.priority;
        if (req.body.category != null) task.category = req.body.category;
        if (req.body.reminder != null) task.reminder = req.body.reminder;
        if (req.body.autoPostpone != null) task.autoPostpone = req.body.autoPostpone;
        if (req.body.subtasks != null) task.subtasks = req.body.subtasks;

        const updatedTask = await task.save();
        await updateDailyLog(format(new Date(), 'yyyy-MM-dd'));
        res.json({ ...updatedTask.toObject(), id: updatedTask._id.toString() });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();
        await updateDailyLog(format(new Date(), 'yyyy-MM-dd'));
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
