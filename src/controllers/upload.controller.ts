import { Request, Response } from "express";
import { uploadService } from "../service/email.upload";
import { prisma } from "../prisma/prismaConfig";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file!;
    const { emailId } = req.body;
    const result = await uploadService(file);
    const upload = await prisma.fileUpload.create({
      data: {
        url: result.url,
        publicId: result.public_id,
        fileName: result.filename,
        size: result.size,
        mimeType: file.mimetype,
        emailJobId: emailId, 
      },
    });
    res.status(200).json({
      success: true,
      // data: result,
      upload
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};