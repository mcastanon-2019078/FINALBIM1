'use strict'

import {Router} from "express"
import { isClient, validateJwt } from "../middlewares/validate-jwt"  
import { verCompra, deleteCarr } from "./carrito.controller"

const api = Router()

api.get('/verCompra',[isClient], verCompra)
api.delete('/deleteCarr/:id',[isClient], deleteCarr)