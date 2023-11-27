const express = require('express')
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const {isLoggedIn , isReviewAuthor} = require('../middleware') 
const review = require('../controllers/review') //controllers



const validateReview = (req, res , next)=>{
    const {error} =  campgroundSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(result.error.details, 400)
    }else {
        next()
    }
}

router.post('/', isLoggedIn, catchAsync(review.createReview))

router.delete('/:reviewId', isReviewAuthor, catchAsync(async (req, res, next) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews:reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfully delete review')
    res.redirect(`/campgrounds/${id}`) 

}))


module.exports = router