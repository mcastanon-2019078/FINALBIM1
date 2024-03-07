import {Schema, model} from 'mongoose'

const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    }
},{
    versionKey: false
})

export default model('product', productSchema)