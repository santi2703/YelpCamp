const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn ,isAuthor} = require('../middleware')
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const campground = require('../controllers/campground') //controllers
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })


const validateCampground = (req, res , next)=>{
    const result =  campgroundSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(result.error.details, 400)
    }else {
        next()
    }

}




router.get('/', catchAsync(campground.index))

// router.post('/', upload.array('image'), (req, res) => {
//     console.log(req.body, req.file)
//     res.send('it worked')
// })

router.get('/new', isLoggedIn, campground.renderNewForm)

router.post('/',isLoggedIn, upload.array('image'), catchAsync(campground.createCampground))


router.get('/:id', catchAsync(campground.showCampground))


router.get('/:id/edit',  isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

router.put('/:id',   isLoggedIn, isAuthor, upload.array('image'), catchAsync(campground.updateCampground))

router.delete('/:id', isLoggedIn, catchAsync(campground.deleteCampground))


module.exports = router