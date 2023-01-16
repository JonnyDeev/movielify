const { Router } = require('express');
const {home, login, register} = require('./controllers');

const routes = Router();


routes.get('/', home)
routes.post('/login', login)
routes.post('/register', register)





module.exports = routes;
