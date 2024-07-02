const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.SSPReviews_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SSPReviews_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const params = {
        Bucket: process.env.SSPReviews_BUCKET_NAME,
        Key: 'reviews.json'
    };

    try {
        console.log('Fetching reviews with params:', params);
        const data = await s3.getObject(params).promise();
        const reviews = JSON.parse(data.Body.toString('utf-8'));
        console.log('Raw data fetched:', data);
        console.log('Parsed reviews:', reviews);

        // Ensure reviews is an array
        return {
            statusCode: 200,
            body: JSON.stringify(Array.isArray(reviews) ? reviews : [reviews])
        };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch reviews' })
        };
    }
};
