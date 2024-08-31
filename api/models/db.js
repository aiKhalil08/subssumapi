const mongoose = require('mongoose');


// const dbURI = 'mongodb://localhost/subssum';
const dbURI = 'mongodb+srv://aikhalil08:thisbelongstoaikhalil08@cluster0.ekhz8.mongodb.net/subssum?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')
});

mongoose.connection.on('error', () => {
    console.log('MongoDB error')
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected')
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    })
})

process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    })
})

require('./users');