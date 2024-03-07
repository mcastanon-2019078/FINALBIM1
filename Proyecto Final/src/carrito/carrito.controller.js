'use strict'

import User from "../user/user.model"
import Product from "../product/product.model"
import Carrito from "../carrito/carrito.model"
import Compra from "./compra.model.js"

export const verCompra = async (req, res) =>{
    try{
        let compras = await Compra.find()
        return res.send({ compras })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error when viewing the purchase'})
    }
}

export const deleteCarr = async(req, res)=>{
    try{
        let { id } = req.params
        let deleteCarr = await Compra.findOneAndDelete({_id: id})
        if(!deleteCarr) return res.status(404).send({message: 'Cannot delete cart'})
        return res.send({message: 'The cart was successfully deleted'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting trolley'})
    }
}
