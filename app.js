const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const favicon = require('serve-favicon');
const dotenv = require('dotenv');
const robots = require('express-robots-txt');
const hbs = require('hbs');

require('./utils/hbsHelpers');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

dotenv.config({
  path: path.join(__dirname, '.env'),
});

mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(
    process.env.MONGO_URL, {
      useNewUrlParser: true,
    },
  ).then(() => {
    console.log('Connection mongodb success!!!');
  }).catch((error) => console.log(error));

const app = express();

// view engine setup
app.set('view engine', 'hbs');
app.set('view options', {
  layout: 'layouts/main',
});

app.enable('view cache');

hbs.registerPartials(path.join(__dirname, '/views/partials'));

app.use(robots({
  UserAgent: '*',
  Disallow: ['/admin'],
  Sitemap: 'https://mysite.ru/sitemap.xml',
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(cookieParser());
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  httpOnly: false,
  store: new MongoStore({
    url: process.env.MONGO_URL,
  }),
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// wigets
app.use(async (req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {};
  const categoryListMiddleware = await require('./widgets/categoriesList').categoriesList();
  res.locals.partials.categoryListContext = categoryListMiddleware;
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
