require('dotenv').config()

const app = require('./services/express.service');
const db = require('./services/mongoose.service');

app.start();
db.connect();
