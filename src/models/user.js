const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Recipe = require('../models/recipe')

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
        unique: true,
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
    },
    tokens: [
        {
            token : {
                type: String,
                required: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual("recipes", {
    ref: 'Recipe',
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.toJSON = function() {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const token = await jwt.sign({_id: this._id.toString()}, "TopSecretHaiGuys")
    this.tokens  = this.tokens.concat({token})
    await this.save()
    return token
}

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({email})
    if(!user) {
        throw new Error({error: "Invalid email"})
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error({error: "Invalid password"})
    }

    return user
}

userSchema.pre('save', async function (next) {
    
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

userSchema.pre('remove', async function (next) {
    await Recipe.deleteMany({owner: this._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User