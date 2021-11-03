const express = require('express');

// Import our modular routers for /tips and /feedback
const tipsRouter = require('./tips');
const feedbackRouter = require('./feedback');
const diagnosticsRouter = require('./diagnostics');
// const landingPageRouter = require('./landingPage')

const app = express();

// app.use('/', landingPageRouter);
app.use('/tips', tipsRouter);
app.use('/feedback', feedbackRouter);
app.use('/diagnostics', diagnosticsRouter);

module.exports = app;
