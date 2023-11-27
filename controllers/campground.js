const Campground = require('../models/campground')
const Review = require('../models/review')
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('campgrounds/index.ejs', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    
    res.render('campgrounds/new.ejs')
    
}


module.exports.createCampground = async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // console.log(geoData.body.features[0].geometry)

    const newcamp = new Campground(req.body.campground);
    newcamp.geometry = geoData.body.features[0].geometry;
    newcamp.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    newcamp.author = req.user._id;
    await newcamp.save();
    console.log(newcamp)
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newcamp._id}`)
}



module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    // console.log(campground.geometry)
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show.ejs', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground')
       return  res.redirect('/campgrounds')
    }

    // if(!campground.author.equals(req.user._id)){
    //     req.flash('error', 'you do not have permission to do that')
    //  return res.redirect(`/campgrounds/${id}`)

    // }
    
    res.render('campgrounds/edit.ejs', { campground })
}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    // const campground = await Campground.findById(id)
    // if(!campground.author.equals(req.user._id)){
    //     req.flash('error', 'you do not have permission to do that')
    //  return res.redirect(`/campgrounds/${id}`)

    // }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    camp.images.push(...imgs)
    await camp.save();
      if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'successfully updated campground')
    // console.log(campground)
    res.redirect(`/campgrounds/${camp._id}`)

}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)

}