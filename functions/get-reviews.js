const fs = require('fs');
const path = require('path');

exports.handler = async () => {
    const filePath = path.join(__dirname, 'reviews.json');

    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const reviews = JSON.parse(fileData);

        return {
            statusCode: 200,
            body: JSON.stringify(reviews)
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify([])
    };
};
