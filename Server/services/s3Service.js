import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };
  return s3.upload(params).promise();
};

export const deleteFromS3 = (fileUrl) => {
  const key = fileUrl.split("/").pop();
  return s3
    .deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: key })
    .promise();
};
