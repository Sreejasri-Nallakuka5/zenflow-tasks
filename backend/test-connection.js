const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

console.log('Testing connection to:', MONGO_URI.replace(/:([^@]+)@/, ':****@'));

async function testConnection() {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Successfully connected to MongoDB Atlas!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed!');
        console.error('Error Code:', err.code);
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);

        if (err.message.includes('IP address') || err.message.includes('whitelisted')) {
            console.log('\n💡 SUGGESTION: Your current IP address is not whitelisted in MongoDB Atlas.');
            console.log('Please go to Atlas -> Network Access and add your current IP address.');
        } else if (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv')) {
            console.log('\n💡 SUGGESTION: This might be a DNS issue with the SRV record.');
            console.log('Try using the "Standard Connection String" (starts with mongodb:// instead of mongodb+srv://).');
        }

        process.exit(1);
    }
}

testConnection();
