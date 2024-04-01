const exp = require('express');
const app = exp();
const taskRoutes = require('./api/routes/tasks');

app.use(exp.json());

app.use('/tasks',taskRoutes);

module.exports = app;