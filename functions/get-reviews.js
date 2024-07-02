const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.SSPReviews_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SSPReviews_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

const s3 = new AWS.S3();

exports.handler = async (event) => {
    const { name, email, course, rating, comments } = JSON.parse(event.body);
    const review = { name, email, course, rating, comments };

    const params = {
        Bucket: process.env.SSPReviews_BUCKET_NAME,
        Key: 'reviews.json'
    };

    try {
        const data = await s3.getObject(params).promise();
        const reviews = JSON.parse(data.Body.toString());
        reviews.push(review);

        const updatedParams = {
            Bucket: process.env.SSPReviews_BUCKET_NAME,
            Key: 'reviews.json',
            Body: JSON.stringify(reviews),
            ContentType: 'application/json'
        };

        await s3.putObject(updatedParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Review saved successfully' })
        };
    } catch (error) {
        if (error.code === 'NoSuchKey') {
            const initialParams = {
                Bucket: process.env.SSPReviews_BUCKET_NAME,
                Key: 'reviews.json',
                Body: JSON.stringify([review]),
                ContentType: 'application/json'
            };

            await s3.putObject(initialParams).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Review saved successfully' })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Could not save review' })
            };
        }
    }
};
