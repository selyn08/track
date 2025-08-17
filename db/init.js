const fs = require('fs');
const path = require('path');
const { db } = require('./db');

const initSql = fs.readFileSync(path.resolve(__dirname, 'init.sql'), 'utf8');

db.exec(initSql, (err) => {
    if (err) {
        console.error("Error initializing database:", err.message);
    } else {
        console.log("Database initialized successfully.");
    }
    db.close();
});
