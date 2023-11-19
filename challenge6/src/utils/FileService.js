const { v4: uuidv4 } = require('uuid');
const imagekit = require('./ImgKit');

const imgUpload = async (file) => {
  try {
    const supportedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = file.originalname.slice((file.originalname.lastIndexOf('.') - 1 >>> 0) + 2);

    if (!supportedExtensions.includes(`.${fileExtension.toLowerCase()}`)) {
      throw new Error('Unsupported file extension');
    }

    const buffer = file.buffer.toString('base64');
    const randomFileName = `${uuidv4()}_${file.originalname}`;

    let uploadFile;

    if (file.mimetype.startsWith('image/')) {
      uploadFile = await imagekit.upload({
        file: buffer,
        fileName: randomFileName,
      });
    } else {
      throw new Error('Unsupported file type');
    }

    return uploadFile.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

module.exports = { imgUpload };
