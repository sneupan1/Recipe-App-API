const express = require('express')
const router = new express.Router()
const User = require('../models/user')

router.post('/users', async(req, res)=> {
    try{
        const user = new User(req.body)
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get("/users", async (req, res)=> {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch("/users/:id", async (req, res)=> {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password"]
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: "Invalid Updates"})
    }

    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update)=> user[update] = req.body[update])
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete("/users/:id", async (req,res)=> {
    try {
        const user = await User.findById(req.params.id)
        await user.delete()
        res.send(user)
    } catch(e) {
        res.status(400).send()
    }
})

module.exports = router