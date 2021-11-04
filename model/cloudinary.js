const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "readditmedia",
    api_key: "962865726524216",
    api_secret: "kciERMZ6YkkVOVmlJAd1MnBMhyA",
    upload_preset: 'media'
});

module.exports.uploadFile = (file, callback) => {
        console.log(file);

        // upload image here
        cloudinary.uploader.upload(file.path, { upload_preset: 'media' })
            .then((result) => {
                //Inspect whether I can obtain the file storage id and the url from cloudinary
                //after a successful upload.
                //console.log({imageURL: result.url, publicId: result.public_id});
                let data = { imageURL: result.url, publicId: result.public_id, status: 'success' };
                callback(null, data);
                return;

            }).catch((error) => {

                let message = 'fail';
                callback(error, null);
                return;

            });

} //End of uploadFile