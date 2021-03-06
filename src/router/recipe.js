const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Recipe = require('../models/recipe')
const multer = require('multer')
const sharp = require('sharp')


router.post('/recipes', auth, async (req, res) => {
    try {
        const recipe = new Recipe({
            ...req.body,
            owner: req.user._id
        })
        await recipe.save()
        res.status(201).send(recipe)
    } catch (e) {
        res.status(400).send()
    }
})

//GET /recipes?private=false
//GET /recipes?limit=2&skip=6
//GET /recipes?sortBy=createdAt_asc or /tasks?sortBy=createdAt_desc
router.get('/recipes', auth, async (req, res) => {
    match = {}
    sort = {}

    if (req.query.private) {
        match.private = req.query.private === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split("_")
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'recipes',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        if (!req.user.recipes) {
            return res.status(404).send()
        }
        res.send(req.user.recipes)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/recipes/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, owner: req.user._id })
        if (!recipe) {
            return res.status(404).send()
        }
        res.send(recipe)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/recipes/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const AllowedUpdates = ["private", "name", "ingredients"]
    const isAllowed = updates.every((update) => AllowedUpdates.includes(update))

    if (!isAllowed) {
        return res.status(400).send({ error: "Invalid Updates" })
    }

    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, owner: req.user._id })
        if (!recipe) {
            return res.status(404).send()
        }
        updates.forEach((update) => recipe[update] = req.body[update])
        await recipe.save()
        res.status(201).send(recipe)
    } catch (e) {
        console.log('error')
        res.status(400).send()
    }
})

router.delete('/recipes/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, owner: req.user._id })
        if (!recipe) {
            return res.status(404).send()
        }
        await recipe.delete()
        res.send(recipe)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload image only')) 
        }
        cb(undefined, true)
    }
})

router.post('/recipes/:id/image', auth, upload.single('image'), async(req, res)=> {
    const recipe = await Recipe.findOne({_id: req.params.id, owner: req.user._id})
    if(!recipe) {
        return res.status(404).send()
    }
    recipe.image  = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
    await recipe.save()
    res.send()
}, (error, req, res, next)=> {
    res.status(400).send({error: error.message})
})

router.delete('/recipes/:id/image', auth, async(req, res)=> {
    const recipe = await Recipe.findOne({_id: req.params.id, owner: req.user._id})
    if(!recipe) {
        return res.status(404).send()
    }
    recipe.image = undefined
    await recipe.save()
    res.send()
})

router.get('/recipes/:id/image', auth, async(req, res)=> {
    try {
        const recipe = await Recipe.findOne({_id: req.params.id, owner: req.user._id})
        if(!recipe || !recipe.image) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(recipe.image)
    } catch(e) {
        res.status(400).send()
    }
    
})
module.exports = router