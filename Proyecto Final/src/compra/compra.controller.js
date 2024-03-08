'use strict'

import Compra from "./compra.model.js"
import { checkUpdate } from "../utils/validator.js"
import Product from "../product/product.model.js"
import Client  from "../user/user.model.js"
import jwt from "jsonwebtoken"
import PDFDocument from 'pdfkit'
import fs from 'fs'

export const test = (req , res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        let data = req.body
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        let {uid} = jwt.verify(token, secretKey)
        data.client = uid
        let product = await Product.findOne({ _id: data.product })
        if (!product) return res.status(404).send({ message: 'Product not found' })
        let client = await Client.findOne({ _id: data.client })
        if (!client) return res.status(404).send({ message: 'Client not found' })
        let restaStock = await Product.findById(data.product)
        restaStock.stock -= parseInt(data.amount)
        await restaStock.save()
        let compra = new Compra(data)
        await compra.save()
        return res.send({message: `Purchase registered correctly ${compra.date} and the stock is updated`, restaStock})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering purchase', err: err})
    }
}

export const update = async (req, res) => { 
    try {
        let { id } = req.params  
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Some data cannot be updated or missing data' })
        let secretKey = process.env.SECRET_KEY
        let { token } = req.headers
        let { uid } = jwt.verify(token, secretKey)
        let originalCompra = await Compra.findById(id)
        if (!originalCompra) return res.status(404).send({ message: 'Purchase not found' })
        if (originalCompra.client.toString() !== uid) return res.status(403).send({ message: 'Unauthorized to update this purchase' })
        let updatedCompra = await Compra.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('product')
        let product = await Product.findById(originalCompra.product)
        let updateAmount =originalCompra.amount  - data.amount
    
        product.stock += updateAmount
        await product.save()

        if (!updatedCompra) return res.status(401).send({ message: 'Purchase not found and not updated' })
        return res.send({ message: 'Purchase updated', updatedCompra })
    } catch (err) {
        console.error(err)
        if (err.keyValue.description) return res.status(400).send({ message: `Purchase ${err.keyValue.description} is already taken` })
        return res.status(500).send({ message: 'Error updating purchase' })
    }
}




export const verCompra = async (req, res) => {
    try {
        let secretKey = process.env.SECRET_KEY
        let { token } = req.headers
        let { uid } = jwt.verify(token, secretKey)

        let compras = await Compra.find({ client: uid })

        return res.send({ compras })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting purchases' })
    }
}


export const generateAndDeleteInvoices = async (req, res) => {
    try {
        const uid = req.user.id
        const compras = await Compra.find({ client: uid }).populate('product').populate('product')
        const doc = new PDFDocument()
        const fileName = `invoices_${uid}.pdf`
        doc.pipe(fs.createWriteStream(fileName))
        doc.fontSize(20).text('Invoices', { align: 'center' }).moveDown()
        compras.forEach(compra => {
            doc.fontSize(14).text(`Date: ${compra.date}`).moveDown()
            doc.fontSize(14).text(`Product: ${compra.product.name}`).moveDown()
            doc.fontSize(14).text(`Amount: ${compra.amount}`).moveDown()
            doc.moveDown()
        })
        doc.end()
        await Compra.deleteMany({ client: uid })
        res.download(fileName)
    } catch (error) {
        console.error('Error generating invoices and deleting purchases:', error)
        res.status(500).send('Error generating invoices and deleting purchases')
    }
}