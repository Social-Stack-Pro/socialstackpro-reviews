const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.SSPReviews_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SSPReviews_AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.SSPReviews_BUCKET_NAME;

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const data = JSON.parse(event.body);
        const params = {
            Bucket: BUCKET_NAME,
            Key: 'reviews.json',
            Body: JSON.stringify(data),
            ContentType: 'application/json'
        };

        await s3.putObject(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Review saved' })
        };
    } catch (error) {
        console.error('Error saving review:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};
