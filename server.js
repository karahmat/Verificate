require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT;

const userRoute = require('./controllers/userController');
const documentRoute = require('./controllers/documentController');
const domainRoute = require('./controllers/domainController');
//const paymentRoute = require('./controllers/paymentController.js');

//Mongoose setup
const db = mongoose.connection;
const mongoURI = process.env.MONGO_URI;
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('The connection with mongod is established');
  }
);

db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));

// //Set Static File
// app.use(express.static('public'));

//Middleware
app.use(express.json());
app.use(cookieParser());
// app.use((_, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   )
//   next()
// });


//Routes
app.use('/api/users', userRoute);
app.use('/api/documents', documentRoute);
app.use('/api/domain', domainRoute);
//app.use('/api/stripe', paymentRoute);


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Listen on port 3000
app.listen(PORT, () => console.info('Listening on port ' + PORT));

