const express = require("express")
const UserController = require("../controllers/UserController")
const UserRouter = express.Router()


UserRouter.post('/create', UserController.createUser);

UserRouter.post('/login', UserController.login);

UserRouter.get('/', UserController.findAll);
UserRouter.post('/checkAccount', UserController.checkAccount);

UserRouter.get('/:id', UserController.findOne);
UserRouter.put('/update/:id', UserController.updateUser);
UserRouter.delete('/delete/:id', UserController.delete);
// UsersRouter.get('/:id', UsersController.getUserById)
// UsersRouter.post('/:id', UsersController.updateUser)



module.exports = UserRouter