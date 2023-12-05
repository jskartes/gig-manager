const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on('connected', () => {
  console.log(`Connected to MongoDB ${db.name} on ${db.host}:${db.port}`);
});
