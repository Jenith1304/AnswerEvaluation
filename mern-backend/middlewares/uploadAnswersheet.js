const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path')
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
//   params: {
//     folder: 'answersheets', // Cloud folder name
//     allowed_formats: ['pdf', 'jpg', 'png'],
//     resource_type: 'auto'
//   },
    params : async(req,file)=>{
        const studentId = req.params.studentId;
        const testId = req.params.testId;

        const extension = path.extname(file.originalname); // e.g. .pdf, .jpg
        const dateTime = new Date().toISOString()
                        .replace(/:/g, '-')      // Replace ":" with "-"
                        .replace(/\..+/, '')     // Remove milliseconds and "Z"
                        .replace('T', '_');      // Optional: Replace "T" with "_" for clarity

        // Generate custom name (adjust as per your need)
        const customFileName = `${studentId}_${testId}_${dateTime}`;

        return {
            folder: 'AnswerEvaluation',
            public_id: customFileName,  // <-- your custom name here
            resource_type: 'auto',
        };
    }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only PDF, JPG, and PNG files are allowed'), false); // Reject file
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

