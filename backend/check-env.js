import dotenv from 'dotenv';
dotenv.config();

console.log("Checking Cloudinary Env Vars:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "Set" : "Missing");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing");
