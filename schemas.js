const joi = require('joi')

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        // image: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        location: joi.string().required()
    }).required(),
    deleteImages: joi.array()
})


module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        range:  joi.number().required()
    }).required()

})
   
    
