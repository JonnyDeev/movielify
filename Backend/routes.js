const { Router } = require('express');
const {home, login, register, getMovies, createComment, editComment, deleteComment, likeAComment, replyAComment, submitReview, getReviews} = require('./controllers');

const routes = Router();


routes.get('/', home)
routes.post('/login', login)
routes.post('/register', register)
routes.post('/getMovies', getMovies)
routes.post('/createComment', createComment)
routes.post('/editComment', editComment)
routes.post('/deleteComment', deleteComment)
routes.post('/likeAcomment', likeAComment)
routes.post('/replyAComment', replyAComment)
routes.post('/SubmitReview', submitReview)
routes.get('/getReviews/:id', getReviews)




module.exports = routes;
