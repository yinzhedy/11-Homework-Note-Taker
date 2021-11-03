const express = require('express');

// Import our modular routers for /notes and /feedback
const notesRouter = require('./notes');
const feedbackRouter = require('./feedback');
const diagnosticsRouter = require('./diagnostics');
// const landingPageRouter = require('./landingPage')

const app = express();

// app.use('/', landingPageRouter);
app.use('/notes', notesRouter);
app.use('/feedback', feedbackRouter);
app.use('/diagnostics', diagnosticsRouter);

module.exports = app;
