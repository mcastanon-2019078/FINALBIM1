'use strict'

import {Router} from "express"
import { isClient, validateJwt } from "../middlewares/validate-jwt.js"
import { test,register, get,update, deleteCom} from "../compra/compra.controller.js"

const api = Router()

api.get('/test', test)
api.post('/register',[validateJwt, isClient], register)
api.get('/get', [validateJwt, isClient], get)
api.put('/update/:id',[validateJwt, isClient], update)
api.delete('/delete/:id',[validateJwt, isClient], deleteCom)

export default api 