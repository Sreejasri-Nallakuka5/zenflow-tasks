const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        const errorDetails = {
            message: err.message,
            code: err.code,
            syscall: err.syscall,
            hostname: err.hostname,
            stack: err.stack
        };
        fs.writeFileSync('startup_error.log', JSON.stringify(errorDetails, null, 2));
        console.error('CRITICAL: MongoDB connection failed.');
        console.error('Error Message:', err.message);
        console.log('\nTIP: The server will CONTINUE to run, but API calls will fail until the database is connected.');
        console.log('Check startup_error.log for full details.');

        // Don't exit process, allow server to stay alive for Vite proxy
        // process.exit(1); 
    }
};

connectDB();

// Routes
// Routes
try {
    const habitRoutes = require('./routes/habitRoutes');
    const noteRoutes = require('./routes/noteRoutes');
    const taskRoutes = require('./routes/taskRoutes');
    const statsRoutes = require('./routes/statsRoutes');

    app.use('/api/habits', habitRoutes);
    app.use('/api/notes', noteRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/stats', statsRoutes);
} catch (error) {
    const fs = require('fs');
    fs.writeFileSync('startup_error.log', 'Require Loop Error:\n' + error.stack);
    console.error('Require Loop Error:', error);
    process.exit(1);
}

app.get('/', (req, res) => {
    res.send('Zenflow Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
