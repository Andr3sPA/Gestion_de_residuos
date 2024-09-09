const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const reqLogger = require('morgan');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

const usersRouter = require('./routes/users');
const companyRouter = require('./routes/company');
const wasteRouter = require('./routes/waste');
const offersRouter = require('./routes/offers');
const counterOffersRouter = require('./routes/counter_offer');
const salesRouter = require('./routes/sales');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(reqLogger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/users', usersRouter);
app.use('/company', companyRouter);
app.use('/waste', wasteRouter);
app.use('/offers', offersRouter);
app.use('/counteroffers', counterOffersRouter);
app.use('/sales', salesRouter);

// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

// DB connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.mongoDB_URL;

mongoose.connect(mongoDB)
  .then((res) => {
    console.log(`connected to database: ${res.connection.name}`)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  });

module.exports = app;
