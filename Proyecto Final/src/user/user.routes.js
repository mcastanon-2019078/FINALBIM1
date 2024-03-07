'use strict'
import express from 'express'
import {validateJwt, isAdmin} from '../middlewares/validate-jwt.js'
import {register, login, update, deleteU, listUser, searchUser} from './user.controller.js'

const api = express.Router()

//ADMIN/CLIENT
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteU)

//ADMIN
api.get('/listUsers', [validateJwt, isAdmin], listUser)
api.post('/search', [validateJwt, isAdmin], searchUser)

export default api