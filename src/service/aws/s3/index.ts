import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Create an S3 client
const client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    }
});


const getObjects = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: "bucket name",
        Key: key
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
}

const putObjects = async (fileName: string, ContentType: string) => {
    const command = new PutObjectCommand({
        Bucket: "bucket name",
        Key: `upload/user/${fileName}`,
        ContentType: ContentType
    });

    const url = await getSignedUrl(client, command);
    return url;
}

export {
    getObjects,
    putObjects
};