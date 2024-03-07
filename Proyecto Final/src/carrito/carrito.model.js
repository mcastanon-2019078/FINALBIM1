import { Schema, model} from "mongoose"

const carritoSchema = Schema ({
    user:{
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    products:[
        {
          type: Schema.Types.ObjectId,
          ref: 'product'
        }
      ]
    },{
        versionKey: false
})

export default model('carrito', carritoSchema)