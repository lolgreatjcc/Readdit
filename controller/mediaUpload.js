var cloudinary = require("../model/cloudinary");
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const path = require("path");
const media = require("../model/media");


async function mediaUpload(file,callback){
    var file = file;
    var fileName = path.basename(file.path);
    var contentResults = typeOfContent(fileName);
    var {validFileType,content_type} = contentResults;
    var fileSizePass = fileSizeChecker(file.path, content_type);
    if(validFileType){
        if(fileSizePass){
            cloudinary.uploadFile(file, async function (error,result){
                try{
                    console.log('check error variable in fileDataManager.upload code block\n', error);
                    console.log('check result variable in fileDataManager.upload code block\n', result);                        
                    var media_url = await result.imageURL;
                    console.log("Media Url: " + media_url);
                    await unlinkAsync(file.path);
                    var data =  {success: true, media_url: media_url, content_type: content_type};
                    console.log("returning callback");
                    return callback(null, data);
                }
                catch(error){
                    let message = "File Submission Failed";
                    // Generic Error Message
                    await unlinkAsync(file.path);
                    var data =  {success:false,"message": message};
                    return callback(data,null)
                }
            })
        }
        else{
            await unlinkAsync(file.path);
            return callback({"message":"File too big!"},null)
        }     
    }
    else{
        await unlinkAsync(file.path);
        return callback({"message":"Invalid File Type"},null)
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
        case "mp4":
            validFileType = true;
            content_type = 2;
            break;
        case "mkv":
            validFileType = true;
            content_type = 2;
            break;
        case "webm":
        validFileType = true;
        content_type = 2;
            break;
        case "gif":
            validFileType = true;
            content_type = 3;
            break;
    }

  return {validFileType:validFileType,content_type:content_type}
}

function fileSizeChecker(filePath,content_type){
  var stats = fs.statSync(filePath);
  var fileSizeInBytes = stats.size;
  var fileSizeMB = fileSizeInBytes / 1000000;
  console.log("File Size: " + fileSizeMB + "MB");
  if (content_type == 1 || content_type == 3){
      if (fileSizeMB < 10){
          return true;
      }
      else{
          return false;
      }
  }
  else if (content_type == 2){
    if (fileSizeMB < 100){
        return true;
    }
    else{
        return false;
    }
  }
}


module.exports = mediaUpload;