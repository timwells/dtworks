const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_KEY} = require("../secrets/secrets.js")
const { 
    S3Client, 
    CreateBucketCommand, 
    PutObjectCommand, 
    ListObjectsV2Command,
    ListBucketsCommand 
} = require("@aws-sdk/client-s3");

// Initialize the S3 client with AWS credentials
const s3 = new S3Client({
    region: AWS_REGION_KEY, // e.g., "us-east-1"
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

// Function to create a new S3 bucket
const createBucket = async (bucketName) => {
    try {
        const command = new CreateBucketCommand({ Bucket: bucketName });
        const response = await s3.send(command);
        console.log("Bucket created successfully:", response);
    } catch (error) {
        console.error("Error creating bucket:", error);
    }
}

// Function to upload a file to the S3 bucket
const uploadToBucket = async (bucketName, fileName, fileContent) => {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileContent,
        });
        const response = await s3.send(command);
        console.log("File uploaded successfully:", response);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

// Function to list objects in the S3 bucket
const listBucketContents = async (bucketName) => {
    try {
        const command = new ListObjectsV2Command({ Bucket: bucketName });
        const response = await s3.send(command);
        console.log("Bucket contents:", response.Contents);
    } catch (error) {
        console.error("Error listing bucket contents:", error);
    }
}

const listBuckets = async () => {
    try {
        const command = new ListBucketsCommand();
        const response = await s3.send(command);
        console.log("Buckets:", response.Buckets.map(bucket => bucket.Name));
    } catch (error) {
        console.error("Error listing buckets:", error);
    }
}

module.exports = {
    createBucket,
    uploadToBucket,
    listBuckets,
    listBucketContents  
}



// Usage example (replace placeholders with actual values)
/*
(async () => {
    const bucketName = "your-unique-bucket-name"; // Bucket name must be globally unique
    const fileName = "example.txt";
    const fileContent = "Hello, S3!";

    await createBucket(bucketName);
    await uploadToBucket(bucketName, fileName, fileContent);
    await listBucketContents(bucketName);
})();
*/