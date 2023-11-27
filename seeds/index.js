const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground.js')

mongoose.connect('mongodb://127.0.0.1:27017/Yelp-Camp')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch(err => {
        console.log('OH NOO mongo connection error')
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]



const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '64668a1f6104491e3f31800b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude, 
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtychiden/image/upload/v1685052606/YelpCamp/yuuvytrxfhrhzzce5dnv.jpg',
                    filename: 'YelpCamp/yuuvytrxfhrhzzce5dnv'

                },
                {
                    url: 'https://res.cloudinary.com/dtychiden/image/upload/v1685052606/YelpCamp/ncxuu2jmukc1frmygmka.jpg',
                    filename: 'YelpCamp/ncxuu2jmukc1frmygmka'

                }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})