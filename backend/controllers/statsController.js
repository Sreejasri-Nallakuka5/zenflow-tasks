const DailyLog = require('../models/DailyLog');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const Task = require('../models/Task');
const Stats = require('../models/Stats');
const { format } = require('date-fns');

// Helper to update daily log for a specific date
const updateDailyLog = async (dateStr) => {
    try {
        const habits = await Habit.find();
        const tasks = await Task.find(); // For now, assuming current tasks reflect today.
        // In a real app, tasks would have dates. Our Task model has dueDate.
        const habitLogs = await HabitLog.find({ date: dateStr });
        const habitLogMap = {};
        habitLogs.forEach(log => {
            habitLogMap[log.habitId.toString()] = log;
        });

        const todayTasks = tasks.filter(t => {
            if (!t.dueDate) return true; // Floating tasks count for today?
            const taskDate = format(new Date(t.dueDate), 'yyyy-MM-dd');
            return taskDate === dateStr;
        });

        const activeHabits = habits.filter(h => h.status === 'active' || !h.status);

        const completedHabits = activeHabits.filter(h => {
            const log = habitLogMap[h._id.toString()];
            return log ? log.isCompleted : false;
        }).length;
        const totalHabits = activeHabits.length;

        const completedTasks = todayTasks.filter(t => t.isCompleted).length;
        const totalTasks = todayTasks.length;

        const totalItems = totalHabits + totalTasks;
        const completedItems = completedHabits + completedTasks;

        const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        await DailyLog.findOneAndUpdate(
            { date: dateStr },
            {
                completedHabits,
                totalHabits,
                completedTasks,
                totalTasks,
                completionRate,
                updatedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        // Update Aggregate Stats
        const logs = await DailyLog.find().sort({ date: 1 });
        let streak = 0;
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const sortedLogs = [...logs].reverse();

        for (const log of sortedLogs) {
            if (log.completionRate > 0) {
                streak++;
            } else {
                if (log.date === todayStr) continue;
                break;
            }
        }

        const perfectDays = logs.filter(l => l.completionRate >= 100).length;
        const activeDays = logs.filter(l => l.completionRate > 0).length;
        const totalRate = logs.reduce((acc, log) => acc + log.completionRate, 0);
        const overallRate = logs.length > 0 ? totalRate / logs.length : 0;

        await Stats.findOneAndUpdate(
            { userId: 'default_user' },
            {
                streak,
                perfectDays,
                activeDays,
                overallRate,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error('Error updating daily log:', err);
    }
};

exports.updateDailyLog = updateDailyLog;

exports.getStats = async (req, res) => {
    try {
        const logs = await DailyLog.find().sort({ date: 1 });
        const statsDoc = await Stats.findOne({ userId: 'default_user' });

        // Activity Data for Calendar
        const activityData = {};
        logs.forEach(log => {
            activityData[log.date] = log.completionRate;
        });

        if (statsDoc) {
            res.json({
                streak: statsDoc.streak,
                perfectDays: statsDoc.perfectDays,
                activeDays: statsDoc.activeDays,
                overallRate: statsDoc.overallRate,
                activityData
            });
        } else {
            // Fallback to calculation if doc doesn't exist yet
            res.json({
                streak: 0,
                perfectDays: 0,
                activeDays: 0,
                overallRate: 0,
                activityData
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
