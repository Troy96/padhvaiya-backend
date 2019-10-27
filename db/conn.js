const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PadhvaiyaDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
let db = mongoose.connection;
db.on('error', e => {
    throw new Error('> UNABLE TO CONNECT TO THE DATABASE! CHECK CONNECTION');
})