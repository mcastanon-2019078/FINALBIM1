import { Schema, model } from "mongoose"

const compraSchema = Schema({
    date:{
        type: Date,
        required: true
    },
    product:{
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    client:{
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    }
},{
    versionKey: false
})

export default model('compra', compraSchema)