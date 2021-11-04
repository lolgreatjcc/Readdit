var cloudinary = require("../model/cloudinary");
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const path = require("path");

async function mediaUpload(file,callback){
    var file = file;
    var fileName = path.basename(file.path);
    var contentResults = typeOfContent(fileName);
    var {validFileType,content_type} = contentResults;

    if(validFileType){
        cloudinary.uploadFile(file, async function (error,result){
            try{
                console.log('check error variable in fileDataManager.upload code block\n', error);
                console.log('check result variable in fileDataManager.upload code block\n', result);                        
                var media_url = result.imageURL;
                await unlinkAsync(file.path);
                var data =  {success: true, media_url: media_url, content_type: content_type};
                return callback(null, data);
            }
            catch(error){
                let message = "File Submission Failed";
                // Generic Error Message
                var data =  {success:false,message: message};
                return callback(data,null)
            }
        }) 
    }
    else{
        return callback({message:"Invalid File Type"},null)
    }
   
}

//check content type
function typeOfContent(fileName){
    console.log("Filename: " + fileName);
    var fileExtension = fileName.split(".");
    fileExtension = fileExtension[fileExtension.length - 1];
    console.log("FileExt: " + fileExtension);
    var validFileType = false;
    var content_type;
  switch (fileExtension.toLowerCase()) {
    case "jpg":
      validFileType = true;
      content_type = 1;
      break;
    case "jpeg":
      validFileType = true;
      content_type = 1;
      break;
    case "png":
      validFileType = true;
      content_type = 1;
      break;
    case "gif":
      validFileType = true;
      content_type = 3;
      break;
  }

  return {validFileType:validFileType,content_type:content_type}
}

module.exports = mediaUpload;