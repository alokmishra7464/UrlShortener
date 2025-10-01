const Url = require('../models/Url');
const QrCode = require('qrcode'); // to generate qr code for short url
const { nanoid } = require('nanoid'); // package to shorten the url (we only use nanoid() func of it.)


exports.shortenUrl = async(req, res) => {
    const { originalUrl } = req.body; // destructure the original url from req body

    try { // try to shorten the url
        const shortCode = nanoid(6);
        const base = process.env.BASE_URL || "http://localhost:5000"; // base url (either from .env or localhost)

        const shortUrl = `${base}/${shortCode}`; // generate full short url along with base url to easily redirect.

        const qrCodeImage = await QrCode.toDataURL(shortUrl); // generate qr code

        const newUrl = new Url({ // create a new object in database and store these values along with user 
            originalUrl,
            shortCode,
            user: req.user?.id,
            qrCode : qrCodeImage,
        });

        await newUrl.save(); // save the new Url in db

        res.status(201).json(newUrl); // send the ok response
    }

    catch(err) { // catches the err
        console.log('Shorten url err', err);
        res.status(500).json({message: 'Server error'});
    }
};

// controller for redirecting to the original url
exports.redirectUrl = async(req, res) => {
    const { shortCode } = req.params; // destruct the shortid from the route params
    
    try { // try finding the short id in db
        const url = await Url.findOne({ shortCode });

        if(!url) { // not found
            return res.status(404).json({ message: 'Short Url not found'});
        }
        
        url.clicks += 1; // increase the click count & save the record in db
        await url.save();
        
        return res.redirect(url.originalUrl); // found , redirect to original (using express redirect method)
    }
    catch(err) { // error while redirecting
        console.log('Error while redirecting shortUrl', err);
        res.status(500).json({ message: 'Server error'});
    }
}

// get user's all urls
exports.getMyUrls = async(req, res) => {
    try {
        const url = await Url.find( {user: req.user.id } );
        res.json(url);
    }
    catch(err) {
        console.log('Error while getting user url' , err);
        res.status(500).json({message: 'Server err' });
    }
}

// delete a Url
exports.deleteUrl = async(req, res) => {
    try { // try to find the url from request
        const url = await Url.findById(req.params.id);
        
        if(!url) return res.status(404).json({message: 'Url not found'});

        if(!url.user || url.user.toString() !== req.user.id) { // check the user's ownership
            return res.status(403).json({message: 'Not authorized to delete'});
        }

        await url.deleteOne(); // delete the url (specific instance)

        res.status(200).json({message: 'Url deleted successfully'});
    }
    catch(err) { // err
        console.log(err);
        res.status(500).json({message: 'Server err'});
    }

}