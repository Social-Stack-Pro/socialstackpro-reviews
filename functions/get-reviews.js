const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.SSPReviews_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SSPReviews_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log('Received event:', event);
    const bucketName = process.env.SSPReviews_BUCKET_NAME;
    const key = 'reviews.json';

    try {
        const params = {
            Bucket: bucketName,
            Key: key,
        };
        console.log('Fetching reviews with params:', params);

        const data = await s3.getObject(params).promise();
        console.log('Raw data fetched:', data);

        const reviews = JSON.parse(data.Body.toString('utf-8'));
        console.log('Parsed reviews:', reviews);

        return {
            statusCode: 200,
            body: JSON.stringify(reviews),
        };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch reviews' }),
        };
    }
};
