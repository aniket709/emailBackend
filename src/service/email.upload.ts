import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadService = async (file: Express.Multer.File) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const streamUpload = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "email_attachments",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    return {
      url: result.secure_url,
      public_id: result.public_id,
      filename: file.originalname,
      size: file.size,
    };
  } catch (error:any) {
    throw new Error("Upload failed: " + error.message);
  }
};