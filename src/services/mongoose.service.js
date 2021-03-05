const mongoose = require('mongoose');
const config = require('../configs/db.config');

exports.connect = () => {
    let url = config.url;
    mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => {
            console.log("[DATABASE] Connected to Atlas successfully.");
        })
        .catch(err => {
            console.log("[DATABASE] Could not connect to the database, see below for errors.\n", err);
            process.exit(-1);
        }
    )
};