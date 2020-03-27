const express = require('express')
const router = new express.Router()
const Recipe = require('../models/recipe')

router.post('/recipes', async(req, res)=> {
    try {
        const recipe = new Recipe(req.body)
        await recipe.save()
        res.status(201).send(recipe)
    } catch(e) {
        res.status(400).send()
    }
})

router.get('/recipes', async(req, res)=> {
    try{
        const recipes = await Recipe.find({})
        res.send(recipes)
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/recipes/:id', async(req, res)=> {
    try {
        const recipe = await Recipe.findById(req.params.id)
        res.send(recipe)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/recipes/:id', async(req, res)=> {
    const updates = Object.keys(req.body)
    const AllowedUpdates = ["private", "name", "ingridients"]
    const isAllowed = updates.every((update)=> AllowedUpdates.includes(update))

    if(!isAllowed){
        return res.status(400).send({error: "Invalid Updates"})
    }

    try {
        const recipe = await Recipe.findById(req.params.id)
        updates.forEach((update)=> recipe[update] = req.body[update])
        await recipe.save()
        res.status(201).send(recipe)
    } catch(e) {
        console.log('error')
        res.status(400).send()
    }
})

router.delete('/recipes/:id', async(req, res)=> {
    try {
        const recipe = await Recipe.findById(req.params.id)
        await recipe.delete()
        res.send(recipe)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router