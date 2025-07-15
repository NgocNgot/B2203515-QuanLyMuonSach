require('dotenv').config();
const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");


const mongoose = require("mongoose");

async function startServer() {
    try {
        await mongoose.connect(config.db.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Thời gian chờ tối đa để kết nối
        });
        console.log("Connected to the database!");

        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();
