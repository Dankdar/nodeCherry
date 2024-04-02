const exp = require('express');
const app = exp();
const taskRoutes = require('./api/routes/tasks');
const playlistRoutes = require('./api/routes/playlist');

app.use(exp.json()); // middleware for json parse.

app.use('/api/playlist',playlistRoutes); // middleware for playlists
app.use('/api/tasks',taskRoutes); // middleware for tasks

module.exports = app;