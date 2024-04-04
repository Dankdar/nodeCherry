const exp = require('express');
const app = exp();
const taskRoutes = require('./api/routes/tasks');
const playlistRoutes = require('./api/routes/playlist');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://huzaifadar:'+ process.env.MONGO_ATLAS_DB_PWD +'@cherrynode.e3r5vb9.mongodb.net/\n')
app.use(morgan('dev')); // middleware for json parse.
// app.use(bodyParser.urlencoded({
//     extended: true
// })); // middleware for urlencoded parse.
app.use(bodyParser.json());
app.use(exp.json()); // middleware for json parse.
app.use(exp.urlencoded({extended: true})); // middleware for json parse.
// const myMiddleware = (req, res, next) => {
//     console.log('req.body:', req.body);
//     next();
// };
// app.use(myMiddleware)

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accept, Authorization");
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Headers',"PUT, POST, PATCH, DELETE");
        return res.status(200).json({})
    }
    next();
}); // middleware for json parse.

app.use('/api/playlist',playlistRoutes); // middleware for playlists
app.use('/api/tasks',taskRoutes); // middleware for tasks

app.use((req,res,next)=>{
   const error = new Error('Not Found');
   error.status = 404;
   next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
    next();
})
// app.listen(3000,() => console.log(`listening on port `))

module.exports = app;