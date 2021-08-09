const Koa = require('koa');
const respond = require('koa-respond');
const mongoose = require('mongoose');
require('dotenv').config();

const app = new Koa();

const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const db = mongoose.connection;

mongoose.connect( uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err => console.log(err));

db.once('open', _ =>{
    console.log("Base de datos conectada");
});

app.use(respond());

const movieRouter = require('./routes/movies.routes');
app.use(movieRouter.routes());
app.use(movieRouter.allowedMethods());

app.listen(process.env.PORT,() => console.log("Server started..."));