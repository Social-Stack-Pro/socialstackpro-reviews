const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.SSPReviews_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SSPReviews_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

exports.handler = async (event) => {
    try {
        const review = JSON.parse(event.body);
        console.log('Received review:', review);

        const params = {
            Bucket: process.env.SSPReviews_BUCKET_NAME,
            Key: 'reviews.json'
        };

        const data = await s3.getObject(params).promise();
        let reviews = JSON.parse(data.Body.toString('utf-8'));
        console.log('Current reviews:', reviews);

        // Ensure reviews is an array
        if (!Array.isArray(reviews)) {
            reviews = [reviews];
        }

        reviews.push(review);

        const putParams = {
            Bucket: process.env.SSPReviews_BUCKET_NAME,
            Key: 'reviews.json',
            Body: JSON.stringify(reviews),
            ContentType: 'application/json'
        };

        await s3.putObject(putParams).promise();
        console.log('Review saved successfully');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Review saved successfully' })
        };
    } catch (error) {
        console.error('Error saving review:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save review', details: error.message })
        };
    }
};
