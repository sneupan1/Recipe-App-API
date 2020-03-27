const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ingridients: {
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        default: false
    }
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe