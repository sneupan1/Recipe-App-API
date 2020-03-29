const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: {
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image : {
        type: Buffer
    }
},{
    timestamps: true
})

recipeSchema.methods.toJSON = function() {
    const recipeObject = this.toObject()

    delete recipeObject.image

    return recipeObject
}

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe