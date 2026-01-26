const Task = require('../models/Task');

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        // Map _id to id for frontend compatibility
        const tasksWithId = tasks.map(task => ({
            ...task.toObject(),
            id: task._id.toString()
        }));
        res.json(tasksWithId);
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
    });

    try {
        const newTask = await task.save();
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

        const updatedTask = await task.save();
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
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
