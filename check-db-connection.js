
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

async function testConnection() {
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("❌ ERROR: Could not connect.");
        console.error("Reason:", err.message);
        if (err.message.includes('bad auth')) {
            console.error("👉 HINT: Check your Username and Password carefully.");
        } else if (err.message.includes('ECONNREFUSED')) {
            console.error("👉 HINT: Network error. Check your Internet or Atlas IP Whitelist.");
        } else if (err.message.includes('SSL')) {
            console.error("👉 HINT: SSL Error. Try adding &tls=true or checking network/firewall.");
        }
        process.exit(1);
    }
}

testConnection();
