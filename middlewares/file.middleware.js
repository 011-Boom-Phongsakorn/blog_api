const multer = require("multer");
const path = require("path");
const supabaseAdmin = require("../config/supabase.config");

// Initialize Supabase Storage
// We'll use supabaseAdmin client for server-side operations

// set storage engine
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000, fieldSize: 2 * 1024 * 1024 },
}).fields([
  { name: "file", maxCount: 1 },
  { name: "title", maxCount: 1 },
  { name: "summary", maxCount: 1 },
  { name: "content", maxCount: 1 },
]);

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extName = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb("Error image only!!");
  }
}

// upload to supabase storage ย้ายจาก ram ไปที่ supabase
async function uploadToFirebase(req, res, next) {
  // When using .fields(), files are in req.files object
  const fileArray = req.files?.file;
  if (!fileArray || fileArray.length === 0) {
    next();
    return;
  }

  const fileObj = fileArray[0];

  try {
    // Upload to Supabase Storage
    const fileName = `uploads/${Date.now()}-${fileObj.originalname}`;
    const { data, error } = await supabaseAdmin.storage
      .from("uploads")
      .upload(fileName, fileObj.buffer, {
        contentType: fileObj.mimetype,
      });

    if (error) {
      throw error;
    }

    // Get public URL from Supabase
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("uploads")
      .getPublicUrl(fileName);

    // Store file info for use in controller
    req.file = {
      originalname: fileObj.originalname,
      firebaseUrl: publicUrlData.publicUrl,
    };
    next();
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Something went wrong while uploading to supabase",
    });
  }
}

module.exports = { upload, uploadToFirebase };
