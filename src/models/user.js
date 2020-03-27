const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length <= 6) {
                throw new Error('Password should be greater than 6 characters')
            } else if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not include the word password')
            }
        }
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User