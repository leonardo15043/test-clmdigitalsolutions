const Router = require('koa-router');
const bodyParser = require('koa-body')()
const router = Router();
const fetch = require('node-fetch');

const Movie = require('../models/Movie');

// Buscador de películas:

router.get(`${process.env.BASE_URL}/movies/search/:title/:year`,  async (ctx, next)=>{

    const body = {
        'apikey':process.env.APY_KEY,
        't':ctx.params.title,
        'y':ctx.params.year
    }

    const options = {
        method: 'GET',
        headers: {'Content-type': 'application/json; charset=UTF-8'}
    };

    const response = await fetch(`${process.env.URL_API}?apikey=${body.apikey}&t=${body.t}&y=${body.y}`, options );
    const post = await response.json();
    const movie = new Movie(post);
        
    await movie.save() .then(data => {
        ctx.body = data;
    }).catch(err => {
        if(err.code && err.code == 11000){
            ctx.body = { message: 'Esta pelicula ya existe en la base de datos' } ;
        } else {
            ctx.body = err;
        }
    });
    

});

// Obtener todas las películas:

router.get(`${process.env.BASE_URL}/movies/`,  async (ctx, next)=>{
    const headers = ctx.request.header;
    const page = (headers.page - 1 )*5;
    const movies = await Movie.find().limit(5).skip(page);
    ctx.body = movies;
});

// Buscar y reemplazar:

router.post(`${process.env.BASE_URL}/prueba`, bodyParser , async (ctx) =>{
    const { movie,find,replace } = ctx.request.body;
    const data = await Movie.findOne({'Title': movie });
    const { Plot } = data;
  
    const regExp = new RegExp(find, "g");
    
    const rep = Plot.replace(regExp, replace);
    const MovieReplace = await Movie.findOneAndUpdate({ Title: movie }, { Plot: rep });
    ctx.body = MovieReplace;
});


module.exports = router;