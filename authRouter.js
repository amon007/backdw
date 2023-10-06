const Router = require('express')
const router = new Router()
const controller = require('./authController')
const { check } = require('express-validator')
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')

router.post('/registration', [
    check('username', "Username cannot be empty").notEmpty().trim(),
    check('password', "Password must be more than 6 characters").isLength({min: 6, max: 15}),
],controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']),controller.getUsers)
router.delete('/delete',authMiddleware, roleMiddleware(['ADMIN']), controller.deleteUser)
router.post('/post', controller.addPost)
router.delete('/deletepost', authMiddleware, roleMiddleware(['USER']),controller.deletePost)

module.exports = router