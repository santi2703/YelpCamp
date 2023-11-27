const mongoose = require('mongoose')
const schema = mongoose.Schema

const ReviewSchema = new schema({
    body: String,
    rating: Number,
    author: {
        type: schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', ReviewSchema)