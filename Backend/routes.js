const { Router } = require('express');
const {home, login, register, getMovies, createComment, editComment, deleteComment} = require('./controllers');

const routes = Router();


routes.get('/', home)
routes.post('/login', login)
routes.post('/register', register)
routes.post('/getMovies', getMovies)
routes.post('/createComment', createComment)
routes.post('/editComment', editComment)
routes.post('/deleteComment', deleteComment)





module.exports = routes;
