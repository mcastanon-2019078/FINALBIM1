'use strict'

import {Router} from "express"
import { isClient, validateJwt } from "../middlewares/validate-jwt.js"
import { test,register, verCompra ,update, generateAndDeleteInvoices} from "../compra/compra.controller.js"

const api = Router()

api.get('/test', test)
api.post('/register',[validateJwt, isClient], register)
api.get('/get', [validateJwt, isClient], verCompra)
api.put('/update/:id',[validateJwt, isClient], update)
api.get('/factura', [validateJwt, isClient], generateAndDeleteInvoices);

export default api 