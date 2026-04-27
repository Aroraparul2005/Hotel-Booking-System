import multer from "multer";

// FIX: was multer.diskStorage({}) which returns a storage engine, not an upload instance
// Must use multer({ storage }) to get the upload middleware
const storage = multer.diskStorage({});
const upload = multer({ storage });

export default upload;
