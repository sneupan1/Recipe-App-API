const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Recipe = require('../models/recipe')


router.post('/recipes',auth, async(req, res)=> {
    try {
        const recipe = new Recipe({
            ...req.body,
            owner: req.user._id
        })
        await recipe.save()
        res.status(201).send(recipe)
    } catch(e) {
        res.status(400).send()
    }
})

router.get('/recipes', auth, async(req, res)=> {
    try{
        await req.user.populate('recipes').execPopulate()
        if(!req.user.recipes){
            return res.status(404).send()
        }
        res.send(req.user.recipes)
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/recipes/:id', auth, async(req, res)=> {
    try {
        const recipe = await Recipe.findOne({_id: req.params.id, owner: req.user._id})
        if(!recipe) {
            return res.status(404).send()
        }
        res.send(recipe)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/recipes/:id', auth, async(req, res)=> {
    const updates = Object.keys(req.body)
    const AllowedUpdates = ["private", "name", "ingridients"]
    const isAllowed = updates.every((update)=> AllowedUpdates.includes(update))

    if(!isAllowed){
        return res.status(400).send({error: "Invalid Updates"})
    }

    try {
        const recipe = await Recipe.findOne({_id: req.params.id, owner: req.user._id})
        if(!recipe) {
            return res.status(404).send()
        }
        updates.forEach((update)=> recipe[update] = req.body[update])
        await recipe.save()
        res.status(201).send(recipe)
    } catch(e) {
        console.log('error')
        res.status(400).send()
    }
})

router.delete('/recipes/:id', auth, async(req, res)=> {
    try {
        const recipe = await Recipe.findOne({_id: req.params.id, owner: req.user._id})
        if(!recipe) {
            return res.status(404).send()
        }
        await recipe.delete()
        res.send(recipe)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router